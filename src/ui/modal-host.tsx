import type { ComponentChildren } from "preact";
import { createPortal, useEffect, useRef } from "preact/compat";

import { setupOverlayContainer } from "./root";
import { useGlobals, type Modal } from "./hooks/globals";
import classes from "./modal-host.module.scss";

interface DialogProps
{
    modal: Modal;
    index: number;
    closeModal: (id: string) => void;
}

function Dialog(props: DialogProps): ComponentChildren
{
    const { modal, closeModal } = props;
    const ref = useRef<HTMLDialogElement>(null);

    useEffect(() =>
    {
        const dialog = ref.current;
        if (!dialog) { return; }
        if (!dialog.open) { dialog.showModal(); }

        function onKeyDown(event: KeyboardEvent): void
        {
            if ((event.key === "Escape") && dialog?.open && !modal.dismissible)
            {
                event.preventDefault();
            }
        }

        function onCancel(event: Event): void
        {
            event.preventDefault();
            if (modal.dismissible)
            {
                closeModal(modal.id);
            }
        }

        function onClose(): void
        {
            closeModal(modal.id);
        }

        dialog.addEventListener("keydown", onKeyDown);
        dialog.addEventListener("cancel", onCancel);
        dialog.addEventListener("close", onClose);

        return (() =>
        {
            dialog.removeEventListener("keydown", onKeyDown);
            dialog.removeEventListener("cancel", onCancel);
            dialog.removeEventListener("close", onClose);
            if (dialog.open) { dialog.close(); }
        });
    }, [modal.id, modal.dismissible, closeModal]);

    return (
        <dialog ref={ref} class={classes.dialog}>
            {modal.dismissible && (<button class={classes.close} onClick={() => closeModal(modal.id)}></button>)}
            <header>
                <h2>{modal.title}</h2>
            </header>
            {modal.content}
            {modal.actions && (<footer>{modal.actions}</footer>)}
        </dialog>
    );
}

/**
 * The host component for rendering modals.
 */
export function ModalHost(): ComponentChildren
{
    const { modals, closeModal } = useGlobals();
    if (modals.length === 0) { return null; }

    return createPortal(
        <>
            {modals.map((modal, i) => (<Dialog key={modal.id} modal={modal} index={i} closeModal={closeModal} />))}
        </>,
        setupOverlayContainer());
}
