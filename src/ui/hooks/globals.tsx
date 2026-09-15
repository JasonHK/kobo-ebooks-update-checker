import type { ComponentChildren } from "preact";
import { useSyncExternalStore } from "preact/compat";

import type { Book } from "../../core/books";
import { LL } from "../../locales";

interface GlobalsStore
{
    modals: Modal[];
    fetchStates: FetchStates;
    checkStates: CheckStates;
    bookStatuses: BookStatuses;
}

export interface Globals
{
    readonly modals: Modal[];
    openModal(config?: ModalInit): string;
    closeModal(id?: string): void;
    closeAllModals(): void;

    readonly fetchStates: FetchStates;
    setTotalPages(totalPages: number): void;
    incrementFetchedPages(): void;
    getFetchedBooks(): Book[];
    pushFetchedBooks(books: Book[]): void;
    resetFetchStates(): void;

    readonly checkStates: CheckStates;
    beginCheck(scope: CheckScope, totalBooks?: number): void;
    setTotalBooks(totalBooks: number): void;
    incrementTotalBooks(amount: number): void;
    incrementCheckedBooks(): void;
    endCheck(): void;

    getBookStatusById(id: string): BookStatus;
    setBookStatusById(id: string, status: BookStatus): void;
}

let store: GlobalsStore = {
    modals: [],
    fetchStates: {
        isFetched: false,
        totalPages: 0,
        fetchedPages: 0,
        fetchedBooks: [],
    },
    checkStates: {
        isChecking: false,
        scope: null,
        totalBooks: 0,
        checkedBooks: 0,
    },
    bookStatuses: new Map(),
};

function getSnapshot(): GlobalsStore
{
    return store;
}

const listeners = new Set<() => void>();

function subscribe(listener: () => void): () => void
{
    listeners.add(listener);
    return () => listeners.delete(listener);
}

function emit(): void
{
    for (const listener of listeners)
    {
        listener();
    }
}

// ▙▗▌     ▌   ▜    
// ▌▘▌▞▀▖▞▀▌▝▀▖▐ ▞▀▘
// ▌ ▌▌ ▌▌ ▌▞▀▌▐ ▝▀▖
// ▘ ▘▝▀ ▝▀▘▝▀▘ ▘▀▀ 

export interface Modal
{
    id: string;
    title: ComponentChildren;
    dismissible: boolean;
    content: ComponentChildren;
    actions: ComponentChildren;
    onClose?: () => void;
}

type ModalRequiredFields = "content";
export type ModalInit = Pick<Modal, ModalRequiredFields> & Partial<Exclude<Modal, ModalRequiredFields>>;

function openModal(init: ModalInit): string
{
    const id = init.id ?? crypto.randomUUID();
    const title = init.title ?? LL.modals.titles.message();
    const dismissible = init.dismissible ?? true;
    const actions = init.actions ?? null;
    
    store = {
        ...store,
        modals: [...store.modals, { ...init, id, title, dismissible, actions }],
    };
    emit();

    return id;
}

function closeModal(id?: string): void
{
    let closingModals: Modal[];
    if (!id)
    {
        closingModals = store.modals.slice(-1);
        store = {
            ...store,
            modals: store.modals.slice(0, -1),
        };
    }
    else
    {
        closingModals = store.modals.filter((modal) => (modal.id === id));
        store = {
            ...store,
            modals: store.modals.filter((modal) => (modal.id !== id)),
        };
    }

    closingModals.forEach((modal) => modal.onClose?.());
    emit();
}

function closeAllModals(): void
{
    const closingModals = store.modals;
    store = {
        ...store,
        modals: [],
    };

    closingModals.forEach((modal) => modal.onClose?.());
    emit();
}

// ▛▀▘  ▐     ▌  ▞▀▖▐     ▐        
// ▙▄▞▀▖▜▀ ▞▀▖▛▀▖▚▄ ▜▀ ▝▀▖▜▀ ▞▀▖▞▀▘
// ▌ ▛▀ ▐ ▖▌ ▖▌ ▌▖ ▌▐ ▖▞▀▌▐ ▖▛▀ ▝▀▖
// ▘ ▝▀▘ ▀ ▝▀ ▘ ▘▝▀  ▀ ▝▀▘ ▀ ▝▀▘▀▀ 

export interface FetchStates
{
    isFetched: boolean;
    totalPages: number;
    fetchedPages: number;
    fetchedBooks: Book[];
}

function setTotalPages(totalPages: number): void
{
    store = {
        ...store,
        fetchStates: {
            ...store.fetchStates,
            totalPages,
        },
    };
    emit();
}

function incrementFetchedPages(): void
{
    store = {
        ...store,
        fetchStates: {
            ...store.fetchStates,
            fetchedPages: store.fetchStates.fetchedPages + 1,
        },
    };

    if (store.fetchStates.fetchedPages === store.fetchStates.totalPages)
    {
        store.fetchStates.isFetched = true;
    }
    emit();
}

function getFetchedBooks(): Book[]
{
    return store.fetchStates.fetchedBooks;
}

function pushFetchedBooks(books: Book[]): void
{
    store = {
        ...store,
        fetchStates: {
            ...store.fetchStates,
            fetchedBooks: [
                ...store.fetchStates.fetchedBooks,
                ...books,
            ],
        },
    };
    emit();
}

function resetFetchStates(): void
{
    store = {
        ...store,
        fetchStates: {
            isFetched: false,
            totalPages: 0,
            fetchedPages: 0,
            fetchedBooks: [],
        },
    };
    emit();
}

// ▞▀▖▌        ▌  ▞▀▖▐     ▐        
// ▌  ▛▀▖▞▀▖▞▀▖▌▗▘▚▄ ▜▀ ▝▀▖▜▀ ▞▀▖▞▀▘
// ▌ ▖▌ ▌▛▀ ▌ ▖▛▚ ▖ ▌▐ ▖▞▀▌▐ ▖▛▀ ▝▀▖
// ▝▀ ▘ ▘▝▀▘▝▀ ▘ ▘▝▀  ▀ ▝▀▘ ▀ ▝▀▘▀▀                     

export type CheckScope = "single" | "page" | "library";

export interface CheckStates
{
    isChecking: boolean;
    scope: CheckScope | null;
    totalBooks: number;
    checkedBooks: number;
}

function beginCheck(scope: CheckScope, totalBooks: number = 0): void
{
    store = {
        ...store,
        checkStates: {
            isChecking: true,
            scope,
            totalBooks,
            checkedBooks: 0,
        },
    };
    emit();
}

function setTotalBooks(totalBooks: number): void
{
    store = {
        ...store,
        checkStates: {
            ...store.checkStates,
            totalBooks,
        },
    };
    emit();
}

function incrementTotalBooks(amount: number): void
{
    store = {
        ...store,
        checkStates: {
            ...store.checkStates,
            totalBooks: store.checkStates.totalBooks + amount,
        },
    };
    emit();
}

function incrementCheckedBooks(): void
{
    store = {
        ...store,
        checkStates: {
            ...store.checkStates,
            checkedBooks: store.checkStates.checkedBooks + 1,
        },
    };
    emit();
}

function endCheck(): void
{
    store = {
        ...store,
        checkStates: {
            isChecking: false,
            scope: null,
            totalBooks: 0,
            checkedBooks: 0,
        },
    };
    emit();
}

// ▛▀▖      ▌  ▞▀▖▐     ▐              
// ▙▄▘▞▀▖▞▀▖▌▗▘▚▄ ▜▀ ▝▀▖▜▀ ▌ ▌▞▀▘▞▀▖▞▀▘
// ▌ ▌▌ ▌▌ ▌▛▚ ▖ ▌▐ ▖▞▀▌▐ ▖▌ ▌▝▀▖▛▀ ▝▀▖
// ▀▀ ▝▀ ▝▀ ▘ ▘▝▀  ▀ ▝▀▘ ▀ ▝▀▘▀▀ ▝▀▘▀▀ 

export type StatusType =
    | "pending"
    | "checking"
    | "latest"
    | "outdated"
    | "preview"
    | "skipped"
    | "failed";

export interface BookStatus
{
    type: StatusType;
    message?: string;
    error?: unknown;
}

export type BookStatuses = Map<string, BookStatus>;

function setBookStatusById(id: string, status: BookStatus): void
{
    const bookStatuses = new Map(store.bookStatuses);
    bookStatuses.set(id, status);

    store = {
        ...store,
        bookStatuses,
    };

    emit();
}

function getBookStatusById(id: string): BookStatus
{
    const status = store.bookStatuses.get(id);
    return status ?? { type: "pending" };
}

export function useGlobals(): Globals
{
    const { modals, fetchStates, checkStates, bookStatuses } = useSyncExternalStore(subscribe, getSnapshot);

    return {
        modals,
        openModal,
        closeModal,
        closeAllModals,

        fetchStates,
        setTotalPages,
        incrementFetchedPages,
        getFetchedBooks,
        pushFetchedBooks,
        resetFetchStates,

        checkStates,
        beginCheck,
        setTotalBooks,
        incrementTotalBooks,
        incrementCheckedBooks,
        endCheck,

        getBookStatusById,
        setBookStatusById,
    };
}
