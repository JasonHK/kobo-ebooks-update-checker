import type { ComponentChildren } from "preact";
import { useSyncExternalStore } from "preact/compat";

import { LL } from "../../locales";

interface GlobalsStore
{
    modals: Modal[];
    checkStates: CheckStates;
    bookStatuses: BookStatuses;
}

export interface Globals
{
    readonly modals: Modal[];
    openModal(config?: ModalInit): string;
    closeModal(id?: string): void;
    closeAllModals(): void;

    readonly checkStates: CheckStates;
    beginCheck(scope: CheckScope, total?: number): void;
    incrementProgress(): void;
    endCheck(): void;

    getBookStatusById(id: string): BookStatus;
    setBookStatusById(id: string, status: BookStatus): void;
}

let store: GlobalsStore = {
    modals: [],
    checkStates: {
        isChecking: false,
        scope: null,
        total: 0,
        done: 0,
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

// ▞▀▖▌        ▌  ▞▀▖▐     ▐        
// ▌  ▛▀▖▞▀▖▞▀▖▌▗▘▚▄ ▜▀ ▝▀▖▜▀ ▞▀▖▞▀▘
// ▌ ▖▌ ▌▛▀ ▌ ▖▛▚ ▖ ▌▐ ▖▞▀▌▐ ▖▛▀ ▝▀▖
// ▝▀ ▘ ▘▝▀▘▝▀ ▘ ▘▝▀  ▀ ▝▀▘ ▀ ▝▀▘▀▀                     

export type CheckScope = "single" | "page" | "library";

export interface CheckStates
{
    isChecking: boolean;
    scope: CheckScope | null;
    total: number;
    done: number;
}

function beginCheck(scope: CheckScope, total = 0): void
{
    store = {
        ...store,
        checkStates: {
            isChecking: true,
            scope,
            total,
            done: 0,
        },
    };
    emit();
}

function incrementProgress(): void
{
    store = {
        ...store,
        checkStates: {
            ...store.checkStates,
            done: store.checkStates.done + 1,
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
            total: 0,
            done: 0,
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
    const { modals, checkStates, bookStatuses } = useSyncExternalStore(subscribe, getSnapshot);

    return {
        modals,
        openModal,
        closeModal,
        closeAllModals,

        checkStates,
        beginCheck,
        incrementProgress,
        endCheck,

        getBookStatusById,
        setBookStatusById,
    };
}
