import type { ComponentChildren, ContainerNode } from "preact";
import type { PropsWithChildren } from "preact/compat";

export function Root(): ComponentChildren
{
    return null;
}

let rootContainer: Element | null = null;

export function setupRootContainer(): ContainerNode
{
    if (rootContainer && document.body.contains(rootContainer)) { return rootContainer; }

    rootContainer = document.createElement("div");
    document.body.appendChild(rootContainer);
    return rootContainer;
}
