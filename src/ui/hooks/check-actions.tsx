import type { ComponentChildren } from "preact";
import { useId } from "preact/hooks";
import Queue from "queue";

import { NetworkError, ParsingError, UnlistedError } from "../../core/errors";
import { getBooksFromDocument, type Book } from "../../core/books";
import { fetchPageFromUrl, getPageFromDocument } from "../../core/pages";
import { fetchProductFromUrl } from "../../core/products";
import { LIBRARY_PAGINATION } from "../../core/selectors";
import { LL } from "../../locales";

import { setupItemStatus } from "../item-status";
import { Progress } from "../progress";
import { exportReport } from "../report";

import { openModal, closeModal } from "./modals";
import { setAbortController, useAbortController } from "./abort-controller";
import { useFetchStates, getFetchedBooks, incrementFetchedPages, pushFetchedBooks, resetFetchStates, setTotalPages } from "./fetch-states";
import { incrementCheckedBooks, incrementTotalBooks, resetCheckStates, setCheckScope, useCheckStates, type CheckScope } from "./check-states";
import { getBookStatusById, setBookStatusById, type StatusType } from "./book-statuses";

import classes from "./check-actions.module.scss";

export interface CheckActions
{
    checkSingleBook(book: Book): Promise<void>;
    checkWholePage(): Promise<void>;
    checkWholeLibrary(): Promise<void>;
}

export type CheckResults = Map<StatusType, Book[]>;

const CACHED_STATUSES = new Set<StatusType>(
[
    "latest",
    "outdated",
    "preview",
    "preOrder",
]);

const SUMMARY_ORDER: StatusType[] = [
    "latest",
    "outdated",
    "preview",
    "preOrder",
    "skipped",
    "failed",
];

const queue = new Queue({ concurrency: 5 });

function LibraryCheckingProgress(): ComponentChildren
{
    const fetchHeaderId = useId();
    const checkHeaderId = useId();

    const { isFetched, totalPages, fetchedPages } = useFetchStates();
    const { totalBooks, checkedBooks } = useCheckStates();

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
    const { isFetched } = useFetchStates();
    const { isChecking } = useCheckStates();
    const controller = useAbortController();

    async function checkUpdate(book: Book, scope: CheckScope): Promise<void>
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
            const product = await fetchProductFromUrl(book.storeUrl, controller.signal);
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
        }
        finally
        {
            incrementCheckedBooks();
        }
    }

    function runBatchCheck(books: Book[], scope: Exclude<CheckScope, "single">): Promise<CheckResults>
    {
        if (books.length === 0) { return Promise.resolve(new Map()); }

        setCheckScope(scope, books.length);
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
                    resetCheckStates();
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
                    {SUMMARY_ORDER.map((status) =>
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
                    <button class="primary" onClick={() => exportReport({ results, totalChecked })}>{LL.modals.actions.saveReport()}</button>
                    <button onClick={() => closeModal(id)}>{LL.modals.actions.gotIt()}</button>
                </>,
                onClose: resetCheckStates,
            });
    }

    async function checkSingleBook(book: Book): Promise<void>
    {
        if (isChecking/*  && (scope !== "single") */) { return; }
        setCheckScope("single", 1);

        setupItemStatus(book);
        await checkUpdate(book, "single");

        resetCheckStates();
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

        try
        {
            const currentPage = getPageFromDocument(document);
            let page = await fetchPageFromUrl(currentPage.first, controller.signal);
            setTotalPages(page.total);

            const books = getBooksFromDocument(page.document);
            pushFetchedBooks(books);
            incrementFetchedPages();

            while (page.next !== null)
            {
                page = await fetchPageFromUrl(page.next, controller.signal);
                
                const books = getBooksFromDocument(page.document);
                pushFetchedBooks(books);
                incrementFetchedPages();
                incrementTotalBooks(books.length);
            }
        }
        catch (error: unknown)
        {
            if (!(error instanceof DOMException) || (error.name !== "AbortError"))
            {
                throw error;
            }
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
        setCheckScope("library");

        let bypassReloading: boolean = false;
        if (isFetched)
        {
            bypassReloading = await new Promise<boolean>((resolve) =>
            {
                function onBypassClicked(): void
                {
                    resolve(true);
                    closeModal(id);
                }
                
                const id = openModal(
                    {
                        title: LL.modals.titles.warning(),
                        dismissible: false,
                        content: <p>{LL.modals.contents.confirmReloadLibrary()}</p>,
                        actions:
                        <>
                            <button class="primary" onClick={() => closeModal(id)}>{LL.modals.actions.reloadLibrary()}</button>
                            <button onClick={onBypassClicked}>{LL.modals.actions.bypassReloading()}</button>
                        </>,
                        onClose: () => resolve(false),
                    });
            });
        }

        const id = openModal(
            {
                title: LL.modals.titles.checkingInProgress(),
                dismissible: false,
                content: <LibraryCheckingProgress />,
                actions: <button onClick={() => controller.abort()}>{LL.modals.actions.cancel()}</button>
            });

        if (!bypassReloading) { await loadLibraryBooks(); }
        const results = await runBatchCheck(getFetchedBooks(), "library");
        closeModal(id);

        setAbortController(new AbortController());
        showResultModal(results, "library");
    }

    return {
        checkSingleBook,
        checkWholePage,
        checkWholeLibrary,
    };
}
