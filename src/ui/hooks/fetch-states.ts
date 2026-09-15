import { useSyncExternalStore } from "preact/compat";

import type { Book } from "../../core/books";

export interface FetchStates
{
    isFetched: boolean;
    totalPages: number;
    fetchedPages: number;
    fetchedBooks: Book[];
}

let states: FetchStates = {
    isFetched: false,
    totalPages: 0,
    fetchedPages: 0,
    fetchedBooks: [],
};

const listeners = new Set<() => void>();

function subscribe(listener: () => void): () => void
{
	listeners.add(listener);
	return () => listeners.delete(listener);
}

function getSnapshot(): FetchStates
{
	return states;
}

function emit(): void
{
	for (const listener of listeners) { listener(); }
}

export function useFetchStates(): FetchStates
{
    const states = useSyncExternalStore(subscribe, getSnapshot);
    return states;
}

export function setTotalPages(totalPages: number): void
{
    states = {
        ...states,
        totalPages,
    };
    emit();
}

export function incrementFetchedPages(): void
{
    states = {
        ...states,
        fetchedPages: states.fetchedPages + 1,
    };

    if (states.fetchedPages === states.totalPages) { states.isFetched = true; }
    emit();
}

export function getFetchedBooks(): Book[]
{
    return states.fetchedBooks;
}

export function pushFetchedBooks(books: Book[]): void
{
    states = {
        ...states,
        fetchedBooks: [
            ...states.fetchedBooks,
            ...books,
        ],
    };
    emit();
}

export function resetFetchStates(): void
{
    states = {
        isFetched: false,
        totalPages: 0,
        fetchedPages: 0,
        fetchedBooks: [],
    };
    emit();
}
