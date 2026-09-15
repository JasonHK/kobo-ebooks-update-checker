import type { ComponentChildren } from "preact";
import { useSyncExternalStore } from "preact/compat";

import { LL } from "../../locales";

export interface Modal
{
    id: string;
    title: ComponentChildren;
    dismissible: boolean;
    content: ComponentChildren;
    actions: ComponentChildren;
    onClose?: () => void;
}

let modals: Modal[] = [];

const listeners = new Set<() => void>();

function subscribe(listener: () => void): () => void
{
	listeners.add(listener);
	return () => listeners.delete(listener);
}

function getSnapshot(): Modal[]
{
	return modals;
}

function emit(): void
{
	for (const listener of listeners) { listener(); }
}

type ModalRequiredFields = "content";
export type ModalInit = Pick<Modal, ModalRequiredFields> & Partial<Exclude<Modal, ModalRequiredFields>>;

export function openModal(init: ModalInit): string
{
    const id = init.id ?? crypto.randomUUID();
    const title = init.title ?? LL.modals.titles.message();
    const dismissible = init.dismissible ?? true;
    const actions = init.actions ?? null;
    
    modals = [...modals, { ...init, id, title, dismissible, actions }],
    emit();

    return id;
}

export function closeModal(id?: string): void
{
    let closingModals: Modal[];
    if (!id)
    {
        closingModals = modals.slice(-1);
        modals = modals.slice(0, -1);
    }
    else
    {
        closingModals = modals.filter((modal) => (modal.id === id));
        modals = modals.filter((modal) => (modal.id !== id));
    }

    closingModals.forEach((modal) => modal.onClose?.());
    emit();
}

export function closeAllModals(): void
{
    const closingModals = modals;
    modals = [];

    closingModals.forEach((modal) => modal.onClose?.());
    emit();
}

export function useModals(): Modal[]
{
    const modals = useSyncExternalStore(subscribe, getSnapshot)
    return modals;
}
