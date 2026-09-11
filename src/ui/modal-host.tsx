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

        function onCancel(e: Event)
        {
            e.preventDefault();
            if (modal.dismissible === true)
            {
                closeModal(modal.id);
            }
        }

        function onClose()
        {
            closeModal(modal.id);
        }

        dialog.addEventListener("cancel", onCancel);
        dialog.addEventListener("close", onClose);

        return (() =>
        {
            dialog.removeEventListener("cancel", onCancel);
            dialog.removeEventListener("close", onClose);
            if (dialog.open) { dialog.close(); }
        });
    }, [modal.id, modal.dismissible, closeModal]);

    return (
        <dialog ref={ref} class={classes.dialog}>
            <button class={classes.close} onClick={() => closeModal(modal.id)}></button>
            <h2 class={classes.header}>{modal.title}</h2>
            {modal.content}
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
        modals.map((modal, i) => (<Dialog key={modal.id} modal={modal} index={i} closeModal={closeModal} />)),
        setupOverlayContainer());
}
