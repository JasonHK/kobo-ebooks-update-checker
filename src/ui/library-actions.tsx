import { render, type ComponentChildren } from "preact";
import clsx from "clsx";

import { BOOK_ACTIONS_LIST, LIBRARY_BOOKS } from "../core/selectors";
import { getBookFromElement, type Book } from "../core/books";
import { LL } from "../locales";
import { useCheckActions } from "./hooks/check-actions";

import classes from "./library-action.module.scss";

interface LibraryActionsProps
{
    book: Book;
}

function LibraryActions({ book }: LibraryActionsProps): ComponentChildren
{
    const { checkStates, checkSingleBook } = useCheckActions();
    const { isChecking, scope } = checkStates;

    return (
        <li class="library-actions-list-item">
            <button class={clsx("library-action", classes.action)} disabled={isChecking && (scope !== "single")} onClick={() => checkSingleBook(book)}>{LL.libraryActions.checkUpdate()}</button>
        </li>
    );
};

export function setupLibraryActions(): void
{
    const elements = document.querySelectorAll(LIBRARY_BOOKS);
    for (const element of elements)
    {
        const book = getBookFromElement(element);

        const lists = element.querySelectorAll(BOOK_ACTIONS_LIST);
        if (lists.length === 0)
        {
            console.warn("Unable to find action lists for %o", element);
            continue;
        };

        for (const list of lists)
        {
            const container = document.createElement("div");
            list.append(container);

            render(<LibraryActions book={book} />, container);
        }
    }
}
