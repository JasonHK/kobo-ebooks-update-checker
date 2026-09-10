import Queue from "queue";

import { getBooksFromDocument, type Book } from "../../core/books";
import { fetchProductFromUrl } from "../../core/products";
import { ParsingError, UnlistedError } from "../../core/errors";
import { LL } from "../../locales";

import { setupItemStatus } from "../item-status";
import { useGlobals, type CheckScope, type CheckStates } from "./globals";

export interface CheckActions
{
    checkStates: CheckStates;
    checkSingleBook(book: Book): Promise<void>;
    checkWholePage(): Promise<void>;
    checkWholeLibrary(): Promise<void>;
}

const queue = new Queue({ autostart: true, concurrency: 5 });

export function useCheckActions(): CheckActions
{
    const {
        checkStates,
        beginCheck,
        updateProgress,
        endCheck,
        
        setBookStatusById,
    } = useGlobals();
    const { isChecking, scope } = checkStates;

    async function checkUpdate(book: Book, scope: CheckScope): Promise<void>
    {
        setBookStatusById(book.id, { type: "checking" });

        try
        {
            const product = await fetchProductFromUrl(book.storeUrl);
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
        }
    }

    async function runBatchCheck(books: Book[], scope: Exclude<CheckScope, "single">)
    {
        beginCheck(scope, books.length);
        if (scope === "page") { books.forEach(setupItemStatus); }

        queue.addEventListener("end", () =>
        {
            // TODO
            endCheck();
        }, { once: true });

        for (const book of books)
        {
            queue.push(async () => checkUpdate(book, scope));
        }
    }

    async function checkSingleBook(book: Book): Promise<void>
    {
        if (isChecking && (scope !== "single")) { return; }
    }

    async function checkWholePage(): Promise<void>
    {
        if (isChecking) { return; }

        const books = getBooksFromDocument();
        runBatchCheck(books, "page");
    }

    async function checkWholeLibrary(): Promise<void>
    {

    }

    return {
        checkStates,
        checkSingleBook,
        checkWholePage,
        checkWholeLibrary,
    };
}
