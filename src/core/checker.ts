import Queue from "queue";

import { LL } from "../locales";

import { getBookStatusById, setBookStatusById, type StatusType } from "../ui/hooks/book-statuses";
import type { CheckResults } from "../ui/hooks/check-actions";
import { type CheckScope, incrementCheckedBooks, setCheckScope, resetCheckStates } from "../ui/hooks/check-states";
import { setupItemStatus } from "../ui/item-status";

import { UnlistedError, ParsingError, NetworkError } from "./errors";
import type { Book } from "./books";
import { fetchProductFromUrl } from "./products";

const CACHED_STATUSES = new Set<StatusType>(
[
    "latest",
    "outdated",
    "preview",
    "preOrder",
]);

const queue = new Queue({ concurrency: 5 });

export async function checkUpdate(book: Book, signal?: AbortSignal): Promise<void>
{
    const status = getBookStatusById(book.id);
    if (CACHED_STATUSES.has(status.type))
    {
        incrementCheckedBooks();
        return;
    }

    if (book.isPreOrder || book.isPreview)
    {
        setBookStatusById(book.id, { type: book.isPreOrder ? "preOrder" : "preview" });
        incrementCheckedBooks();
        return;
    }

    setBookStatusById(book.id, { type: "checking" });

    try
    {
        const product = await fetchProductFromUrl(book.storeUrl, signal);
        if (product.productId === book.productId)
        {
            setBookStatusById(book.id, { type: "latest" });
        }
        else
        {
            setBookStatusById(book.id, { type: "outdated" });
        }
    }
    catch (error: unknown)
    {
        if (error instanceof UnlistedError)
        {
            setBookStatusById(
                book.id,
                {
                    type: "failed",
                    message: LL.error.unlisted(),
                });
        }
        else if (error instanceof ParsingError)
        {
            setBookStatusById(
                book.id,
                {
                    type: "failed",
                    message: LL.error.parsing(),
                    error: String(error.cause),
                });
        }
        else if (error instanceof NetworkError)
        {
            setBookStatusById(
                book.id,
                {
                    type: "failed",
                    message: LL.error.unknown(),
                    error: String(error.message),
                });
        }
        else if ((error instanceof DOMException) && (error.name === "AbortError"))
        {
            setBookStatusById(book.id, { type: "skipped" });
        }
        else
        {
            console.error(error);
            setBookStatusById(
                book.id,
                {
                    type: "failed",
                    message: LL.error.unknown(),
                    error: String(error),
                });
        }
    }
    finally
    {
        incrementCheckedBooks();
    }
}

export function runBatchCheck(books: Book[], scope: Exclude<CheckScope, "single">, signal: AbortSignal): Promise<CheckResults>
{
    if (books.length === 0) { return Promise.resolve(new Map()); }

    setCheckScope(scope, books.length);
    if (scope === "page") { books.forEach(setupItemStatus); }

    for (const book of books)
    {
        queue.push(async () => checkUpdate(book, signal));
    }

    const promise = new Promise<CheckResults>((resolve) =>
    {
        queue.addEventListener("end", () =>
            {
                const booksByStatus = books.reduce((groups, book) =>
                {
                    const status = getBookStatusById(book.id).type;
                    const statusBooks = groups.get(status) ?? [];

                    statusBooks.push(book);
                    groups.set(status, statusBooks);

                    return groups;
                }, new Map<StatusType, Book[]>());

                resolve(booksByStatus);
                resetCheckStates();
            },
            { once: true });
    });

    queue.start();
    return promise;
}
