import { useSyncExternalStore } from "preact/compat";

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

let statuses: BookStatuses = new Map();

const listeners = new Set<() => void>();

function subscribe(listener: () => void): () => void
{
	listeners.add(listener);
	return () => listeners.delete(listener);
}

function getSnapshot(): BookStatuses
{
	return statuses;
}

function emit(): void
{
	for (const listener of listeners) { listener(); }
}

export function useBookStatuses(): BookStatuses
{
    const statuses = useSyncExternalStore(subscribe, getSnapshot);
    return statuses;
}

export function getBookStatusById(id: string): BookStatus
{
    return statuses.get(id) ?? { type: "pending" };
}

export function setBookStatusById(id: string, status: BookStatus): void
{
    statuses = new Map(statuses);
    statuses.set(id, status);
    emit();
}
