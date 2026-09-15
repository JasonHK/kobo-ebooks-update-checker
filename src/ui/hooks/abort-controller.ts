
import { useSyncExternalStore } from "preact/compat";

let controller: AbortController = new AbortController;

const listeners = new Set<() => void>();

function subscribe(listener: () => void): () => void
{
	listeners.add(listener);
	return () => listeners.delete(listener);
}

function getSnapshot(): AbortController
{
	return controller;
}

function emit(): void
{
	for (const listener of listeners) { listener(); }
}

export function useAbortController(): AbortController
{
    const controller = useSyncExternalStore(subscribe, getSnapshot);
	return controller;
}

export function setAbortController(nextController: AbortController): void
{
	controller = nextController;
    emit();
}
