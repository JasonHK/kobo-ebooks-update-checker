import { render, type ComponentChildren } from "preact";
import { clsx } from "clsx";

import { getElementByBook, type Book } from "../core/books";
import { LL } from "../locales";

import { useGlobals } from "./hooks/globals";
import classes from "./item-status.module.scss";

interface ItemStatusProps
{
    book: Book;
}

function ItemStatus(props: ItemStatusProps): ComponentChildren
{
    const { book } = props;

    const { getBookStatusById } = useGlobals();
    const { type, message, error } = getBookStatusById(book.id);
    if (type !== "failed")
    {
        return (
            <span class={clsx(classes[type])}>
                {LL.status[type]()}
            </span>
        );
    }

    return (
        <a class={clsx(classes[type])} onClick={() => {}}>
            {LL.status[type]()}
        </a>
    );
};

export function setupItemStatus(book: Book): void
{
    const element = getElementByBook(book);
    if (!element) { throw new Error("Unable to find the element for the book"); }

    const container = element.querySelector(".item-status");
    if (!container) { throw new Error("Unable to find the element for item status"); }

    container.replaceChildren();
    render(<ItemStatus book={book} />, container);
}
