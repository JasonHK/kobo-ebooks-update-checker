import { useSyncExternalStore } from "preact/compat";

import type { BookStatus } from "../../core/status";

interface GlobalsStore
{
    checkStates: CheckStates;
    bookStatuses: BookStatuses;
}

export interface Globals
{
    checkStates: CheckStates;
    beginCheck(scope: CheckScope, total?: number): void;
    updateProgress(done: number, total: number): void;
    endCheck(): void;

    getBookStatusById(id: string): BookStatus;
    setBookStatusById(id: string, status: BookStatus): void;
}

let store: GlobalsStore = {
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

function updateProgress(done: number, total: number): void
{
    store = {
        ...store,
        checkStates: {
            ...store.checkStates,
            total,
            done,
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
    const { checkStates } = useSyncExternalStore(subscribe, getSnapshot);

    return {
        checkStates,
        beginCheck,
        updateProgress,
        endCheck,

        getBookStatusById,
        setBookStatusById,
    };
}
