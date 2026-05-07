import { render } from "preact";
import { clsx } from "clsx";
import { htmlLangAttributeDetector } from "typesafe-i18n/detectors";
import TypesafeI18n, { useI18nContext } from "../locales/i18n-preact";
import { detectLocale } from "../locales/i18n-util";
import type { Book } from "../core/books";
import type { CheckStatus } from "../core/status";

import classes from "./item-status.module.scss";

const widgetsCache = new WeakMap<Element, Element>();

export function renderItemStatusWidget(book: Book, status: CheckStatus, message?: string): void
{
    const locale = detectLocale(htmlLangAttributeDetector);

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

    render(<TypesafeI18n locale={locale}><ItemStatusWidget status={status} /></TypesafeI18n>, widget);
}

interface ItemStatusWidgetProps
{
    status: CheckStatus;
}

const ItemStatusWidget = ({ status }: ItemStatusWidgetProps) =>
{
    const { LL } = useI18nContext();

    return (
        <span class={clsx({ [classes.outdated]: (status === "outdated"), [classes.skipped]: (status === "skipped"), [classes.failed]: (status === "failed") })}>
            {LL.status[status]()}
        </span>
    );
};
