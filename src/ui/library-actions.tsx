import { render } from "preact";
import { LL } from "../locales";
import { Book } from "../core/books";

export type LibraryActionsAction = "check-single";

export type LibraryActionsWidgetOptions = Omit<LibraryActionsWidgetProps, "book">;

const widgetsCache = new WeakMap<Element, HTMLDivElement>();

export function renderLibraryActionsWidgets(props: LibraryActionsWidgetOptions): void
{
    const elements = document.querySelectorAll(".item-wrapper.book");
    for (const element of elements)
    {
        const book = Book.fromElement(element);
        const containers = element.querySelectorAll(".library-actions-list");
        if (containers.length === 0) { throw new Error("Unable to find the containers for library actions"); };

        for (const container of containers)
        {
            let widget = widgetsCache.get(container);
            if (!widget)
            {
                widget = document.createElement("div");
                widgetsCache.set(container, widget);

                container.append(widget);
            }

            render(<LibraryActionsWidget book={book} {...props} />, widget);
        }
    }
}

export function renderLibraryActionWidget(props: LibraryActionsWidgetOptions)
{

}

interface LibraryActionsWidgetProps
{
    book: Book;
    onActionClick: (action: LibraryActionsAction, target: Book) => void;
}

const LibraryActionsWidget = ({ book, onActionClick }: LibraryActionsWidgetProps) =>
{
    return (
        <li class="library-actions-list-item">
            <button class="library-action" onClick={() => onActionClick("check-single", book)}>{LL.libraryActions.checkSingle()}</button>
        </li>
    );
};
