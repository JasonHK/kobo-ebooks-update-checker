import type { ComponentChildren, ContainerNode } from "preact";
import { ModalHost } from "./modal-host";

export function Root(): ComponentChildren
{
    return (
        <>
            <ModalHost />
        </>
    );
}

let rootContainer: Element | null = null;

export function setupRootContainer(): ContainerNode
{
    if (rootContainer && document.body.contains(rootContainer)) { return rootContainer; }

    rootContainer = document.createElement("div");
    document.body.appendChild(rootContainer);
    return rootContainer;
}

let overlayContainer: Element | null = null;

export function setupOverlayContainer(): ContainerNode
{
    if (overlayContainer && document.body.contains(overlayContainer)) { return overlayContainer; }

    overlayContainer = document.createElement("div");
    document.body.appendChild(overlayContainer);
    return overlayContainer;
}
