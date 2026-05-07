import { render } from "preact";
import { clsx } from "clsx";
import { LL } from "../locales";
import type { Book } from "../core/books";
import type { CheckStatus } from "../core/status";

import classes from "./item-status.module.scss";

const widgetsCache = new WeakMap<Element, Element>();

export function renderItemStatusWidget(book: Book, status: CheckStatus, message?: string): void
{
    const element = book.findElement();
    if (!element) { throw new Error("Unable to find the element for the book"); }

    let widget: Element | null | undefined = widgetsCache.get(element);
    if (!widget)
    {
        widget = element.querySelector(".item-status");
        if (!widget) { throw new Error("Unable to find the element for item status"); }

        widget.replaceChildren();
        widgetsCache.set(element, widget);
    }

    render(<ItemStatusWidget status={status} />, widget);
}

interface ItemStatusWidgetProps
{
    status: CheckStatus;
}

const ItemStatusWidget = ({ status }: ItemStatusWidgetProps) =>
{
    return (
        <span class={clsx({ [classes.outdated]: (status === "outdated"), [classes.skipped]: (status === "skipped"), [classes.failed]: (status === "failed") })}>
            {LL.status[status]()}
        </span>
    );
};
