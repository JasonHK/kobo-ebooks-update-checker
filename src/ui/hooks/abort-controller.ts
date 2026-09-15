
import { useSyncExternalStore } from "preact/compat";

export interface AbortControllerStore
{
    controller: AbortController;
    setController(controller: AbortController): void;
}

let controller: AbortController = new AbortController;

const listeners = new Set<() => void>();

function getSnapshot(): AbortController
{
	return controller;
}

function subscribe(listener: () => void): () => void
{
	listeners.add(listener);
	return () => listeners.delete(listener);
}

function setController(nextController: AbortController): void
{
	controller = nextController;

	for (const listener of listeners)
	{
		listener();
	}
}

export function useAbortController(): AbortControllerStore
{
	return {
		controller: useSyncExternalStore(subscribe, getSnapshot),
		setController,
	};
}
