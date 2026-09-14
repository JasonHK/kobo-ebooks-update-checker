import Queue from "queue";

import { fetchPageFromUrl, getPageFromDocument } from "../../core/pages";
import { getBooksFromDocument, type Book } from "../../core/books";
import { fetchProductFromUrl } from "../../core/products";
import { NetworkError, ParsingError, UnlistedError } from "../../core/errors";
import { LL } from "../../locales";

import { setupItemStatus } from "../item-status";
import { useGlobals, type CheckScope, type CheckStates, type StatusType } from "./globals";
import classes from "./check-actions.module.scss";
import { LIBRARY_PAGINATION } from "../../core/selectors";
import type { ComponentChildren } from "preact";
import { Progress } from "../progress";
import { useId } from "preact/hooks";

export interface CheckActions
{
    checkStates: CheckStates;
    checkSingleBook(book: Book): Promise<void>;
    checkWholePage(): Promise<void>;
    checkWholeLibrary(): Promise<void>;
}

type CheckResults = Map<StatusType, Book[]>;

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

const queue = new Queue({ concurrency: 5 });

function LibraryCheckingProgress(): ComponentChildren
{
    const fetchHeaderId = useId();
    const checkHeaderId = useId();

    const { fetchStates, checkStates } = useGlobals();
    const { isFetched, totalPages, fetchedPages } = fetchStates;
    const { totalBooks, checkedBooks } = checkStates;

    return (
        <>
            <section class={classes.step}>
                <h3 id={fetchHeaderId}>{LL.modals.contents.fetchLibrary()}</h3>
                <Progress value={(totalPages || false) && fetchedPages} max={totalPages} style={{ width: "100%", color: "#bf0000" }} aria-labelledby={fetchHeaderId}></Progress>
                <p>{LL.modals.contents.fetchLibraryProgress({ totalPages, fetchedPages })}</p>
            </section>

            <section class={classes.step}>
                <h3 id={checkHeaderId}>{LL.modals.contents.checkUpdate()}</h3>
                <Progress value={isFetched && checkedBooks} max={totalBooks} style={{ width: "100%", color: "#bf0000" }} aria-labelledby={checkHeaderId}></Progress>
                <p>{LL.modals.contents.checkUpdateProgress({ totalBooks, checkedBooks })}</p>
            </section>
        </>
    );
}

export function useCheckActions(): CheckActions
{
    const {
        openModal,
        closeModal,
        
        setTotalPages,
        incrementFetchedPages,
        getFetchedBooks,
        pushFetchedBooks,
        resetFetchStates,

        checkStates,
        beginCheck,
        incrementTotalBooks,
        incrementCheckedBooks,
        endCheck,
        
        getBookStatusById,
        setBookStatusById,
    } = useGlobals();
    const { isChecking, scope, totalBooks, checkedBooks } = checkStates;

    async function checkUpdate(book: Book, scope: CheckScope): Promise<void>
    {
        const status = getBookStatusById(book.id);
        if (CACHED_STATUSES.has(status.type)) { return; }

        if (book.isPreview)
        {
            setBookStatusById(book.id, { type: "preview" });
            incrementCheckedBooks();
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
        }
        finally
        {
            incrementCheckedBooks();
        }
    }

    function runBatchCheck(books: Book[], scope: Exclude<CheckScope, "single">): Promise<CheckResults>
    {
        if (books.length === 0) { return Promise.resolve(new Map()); }

        beginCheck(scope, books.length);
        if (scope === "page") { books.forEach(setupItemStatus); }

        for (const book of books)
        {
            queue.push(async () => checkUpdate(book, scope));
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
                    endCheck();
                },
                { once: true });
        });

        queue.start();
        return promise;
    }

    function showResultModal(results: CheckResults, scope: Exclude<CheckScope, "single">): void
    {
        const totalChecked = Array.from(results).map(([_, books]) => books.length).reduce((a, b) => (a + b));

        const id = openModal(
            {
                title: LL.modals.titles.checkCompleted(),
                dismissible: false,
                content:
                <>
                    <p class={classes.message}>
                        {(scope === "page") ? LL.modals.contents.finishCheckingPage(totalChecked) : LL.modals.contents.finishCheckingLibrary(totalChecked)}
                    </p>
                    {SUMMARY_STATUSES.map((status) =>
                    {
                        const books = results.get(status);
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
        const results = await runBatchCheck(books, "page");
        showResultModal(results, "page");
    }

    async function loadLibraryBooks(): Promise<void>
    {
        resetFetchStates();

        const currentPage = getPageFromDocument(document);
        let page = await fetchPageFromUrl(currentPage.first);
        setTotalPages(page.total);

        const books = getBooksFromDocument(page.document);
        pushFetchedBooks(books);
        incrementFetchedPages();

        while (page.next !== null)
        {
            page = await fetchPageFromUrl(page.next);
            
            const books = getBooksFromDocument(page.document);
            pushFetchedBooks(books);
            incrementFetchedPages();
            incrementTotalBooks(books.length);
        }
    }

    async function checkWholeLibrary(): Promise<void>
    {
        if (isChecking) { return; }

        if (!document.querySelector(LIBRARY_PAGINATION))
        {
            return checkWholePage();
        }

        const continueCheck = await new Promise<boolean>((resolve) =>
        {
            function onConfirm(): void
            {
                resolve(true);
                closeModal(id);
            }

            const id = openModal(
                {
                    title: LL.modals.titles.warning(),
                    content: <p>{LL.modals.contents.confirmCheckLibrary()}</p>,
                    actions:
                    <>
                        <button class="primary" onClick={onConfirm}>{LL.modals.actions.startChecking()}</button>
                        <button onClick={() => closeModal(id)}>{LL.modals.actions.cancel()}</button>
                    </>,
                    onClose: () => resolve(false),
                });
        });

        if (!continueCheck) { return; }

        const id = openModal(
            {
                title: LL.modals.titles.checkingInProgress(),
                dismissible: false,
                content: <LibraryCheckingProgress />,
                actions: <button onClick={() => closeModal(id)}>{LL.modals.actions.cancel()}</button>
            });

        await loadLibraryBooks();
        const results = await runBatchCheck(getFetchedBooks(), "library");
        closeModal(id);
        showResultModal(results, "library");
    }

    return {
        checkStates,
        checkSingleBook,
        checkWholePage,
        checkWholeLibrary,
    };
}
