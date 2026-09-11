import Queue from "queue";

import { getBooksFromDocument, type Book } from "../../core/books";
import { fetchProductFromUrl } from "../../core/products";
import { ParsingError, UnlistedError } from "../../core/errors";
import { LL } from "../../locales";

import { setupItemStatus } from "../item-status";
import { useGlobals, type CheckScope, type CheckStates, type StatusType } from "./globals";
import classes from "./check-actions.module.scss";

export interface CheckActions
{
    checkStates: CheckStates;
    checkSingleBook(book: Book): Promise<void>;
    checkWholePage(): Promise<void>;
    checkWholeLibrary(): Promise<void>;
}

const CACHED_STATUSES = new Set<StatusType>(
[
    "latest",
    "outdated",
    "preview",
]);

const SUMMARY_STATUSES: Exclude<StatusType, "pending" | "checking">[] = [
    "latest",
    "outdated",
    "preview",
    "skipped",
    "failed",
];

const queue = new Queue({ autostart: true, concurrency: 5 });

export function useCheckActions(): CheckActions
{
    const {
        openModal,
        closeModal,

        checkStates,
        beginCheck,
        incrementProgress,
        endCheck,
        
        getBookStatusById,
        setBookStatusById,
    } = useGlobals();
    const { isChecking, scope, total, done } = checkStates;

    async function checkUpdate(book: Book, scope: CheckScope): Promise<void>
    {
        const status = getBookStatusById(book.id);
        if (CACHED_STATUSES.has(status.type)) { return; }

        if (book.isPreview)
        {
            setBookStatusById(book.id, { type: "preview" });
            return;
        }

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
        finally
        {
            incrementProgress();
        }
    }

    async function runBatchCheck(books: Book[], scope: Exclude<CheckScope, "single">)
    {
        beginCheck(scope, books.length);
        if (scope === "page") { books.forEach(setupItemStatus); }

        queue.addEventListener("end", () =>
        {
            if (scope === "page")
            {
                const booksByStatus = books.reduce((groups, book) =>
                {
                    const status = getBookStatusById(book.id).type;
                    const statusBooks = groups.get(status) ?? [];

                    statusBooks.push(book);
                    groups.set(status, statusBooks);

                    return groups;
                }, new Map<StatusType, Book[]>());

                const id = openModal(
                    {
                        title: LL.modals.titles.checkCompleted(),
                        dismissible: false,
                        content:
                        <>
                            <p class={classes.message}>{LL.modals.contents.finishCheckingPage(books.length)}</p>
                            {SUMMARY_STATUSES.map((status) =>
                            {
                                const books = booksByStatus.get(status);
                                if (!books || (books.length === 0)) { return null; }

                                return (
                                    <details class={classes.details}>
                                        <summary>{LL.modals.contents.statusSummaries[status](books.length)}</summary>
                                        <ul>
                                            {books.map((book) => (<li>{book.title}</li>))}
                                        </ul>
                                    </details>
                                );
                            })}
                        </>,
                        actions: 
                        <>
                            <button class="primary">{LL.modals.actions.saveReport()}</button>
                            <button onClick={() => closeModal(id)}>{LL.modals.actions.gotIt()}</button>
                        </>,
                        onClose: endCheck,
                    });
            }
            else
            {
                endCheck();
            }
        }, { once: true });

        for (const book of books)
        {
            queue.push(async () => checkUpdate(book, scope));
        }
    }

    async function checkSingleBook(book: Book): Promise<void>
    {
        if (isChecking/*  && (scope !== "single") */) { return; }
        beginCheck("single", 0);

        setupItemStatus(book);
        await checkUpdate(book, "single");

        endCheck();
    }

    async function checkWholePage(): Promise<void>
    {
        if (isChecking) { return; }

        const books = getBooksFromDocument();
        runBatchCheck(books, "page");
    }

    async function checkWholeLibrary(): Promise<void>
    {
        if (isChecking) { return; }
    }

    return {
        checkStates,
        checkSingleBook,
        checkWholePage,
        checkWholeLibrary,
    };
}
