import { useSyncExternalStore } from "preact/compat";

export type CheckScope = "single" | "page" | "library";

export interface CheckStates
{
    isChecking: boolean;
    checkScope: CheckScope | null;
    totalBooks: number;
    checkedBooks: number;
}

let states: CheckStates = {
    isChecking: false,
    checkScope: null,
    totalBooks: 0,
    checkedBooks: 0,
};

const listeners = new Set<() => void>();

function subscribe(listener: () => void): () => void
{
    listeners.add(listener);
    return () => listeners.delete(listener);
}

function getSnapshot(): CheckStates
{
    return states;
}

function emit(): void
{
    for (const listener of listeners) { listener(); }
}

export function useCheckStates(): CheckStates
{
    const states = useSyncExternalStore(subscribe, getSnapshot);
    return states;
}

export function setCheckScope(checkScope: CheckScope, totalBooks: number = 0): void
{
    states = {
        isChecking: true,
        checkScope,
        totalBooks,
        checkedBooks: 0,
    };
    emit();
}

export function setTotalBooks(totalBooks: number): void
{
    states = {
        ...states,
        totalBooks,
    };
    emit();
}

export function incrementTotalBooks(amount: number): void
{
    states = {
        ...states,
        totalBooks: states.totalBooks + amount,
    };
    emit();
}

export function incrementCheckedBooks(): void
{
    states = {
        ...states,
        checkedBooks: states.checkedBooks + 1,
    };
    emit();
}

export function resetCheckStates(): void
{
    states = {
        isChecking: false,
        checkScope: null,
        totalBooks: 0,
        checkedBooks: 0,
    };
    emit();
}
