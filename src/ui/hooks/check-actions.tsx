import type { ComponentChildren } from "preact";
import { useId } from "preact/hooks";

import { getBooksFromDocument, type Book } from "../../core/books";
import { fetchPageFromUrl, getPageFromDocument } from "../../core/pages";
import { checkUpdate, runBatchCheck, type CheckResults } from "../../core/checker";
import { LIBRARY_PAGINATION } from "../../core/selectors";
import { LL, locale } from "../../locales";

import { setupItemStatus } from "../item-status";
import { Progress } from "../progress";
import { exportReport } from "../report";

import { openModal, closeModal } from "./modals";
import { setAbortController, useAbortController } from "./abort-controller";
import { useFetchStates, getFetchedBooks, incrementFetchedPages, pushFetchedBooks, resetFetchStates, setTotalPages } from "./fetch-states";
import { incrementTotalBooks, resetCheckStates, setCheckScope, useCheckStates, type CheckScope } from "./check-states";
import { type StatusType } from "./book-statuses";

import classes from "./check-actions.module.scss";

export interface CheckActions
{
    checkSingleBook(book: Book): Promise<void>;
    checkWholePage(): Promise<void>;
    checkWholeLibrary(): Promise<void>;
}

const SUMMARY_ORDER: StatusType[] = [
    "latest",
    "outdated",
    "preview",
    "preOrder",
    "skipped",
    "failed",
];

const COLLATOR = Intl.Collator(locale, { numeric: true });

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
        await checkUpdate(book, controller.signal);

        resetCheckStates();
    }

    async function checkWholePage(): Promise<void>
    {
        if (isChecking) { return; }

        const books = getBooksFromDocument();
        books.sort((a, b) => COLLATOR.compare(a.title, b.title));
        const results = await runBatchCheck(books, "page", controller.signal);
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
        const books = getFetchedBooks().toSorted((a, b) => COLLATOR.compare(a.title, b.title));
        const results = await runBatchCheck(books, "library", controller.signal);
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
