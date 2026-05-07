import { render } from "preact";
import { htmlLangAttributeDetector } from "typesafe-i18n/detectors";
import TypesafeI18n, { useI18nContext } from "../locales/i18n-preact";
import { detectLocale } from "../locales/i18n-util";
import { Book } from "../core/books";

export type LibraryActionsAction = "check-single";

export type LibraryActionsWidgetOptions = Omit<LibraryActionsWidgetProps, "book">;

const widgetsCache = new WeakMap<Element, HTMLDivElement>();

export function renderLibraryActionsWidgets(props: LibraryActionsWidgetOptions): void
{
    const locale = detectLocale(htmlLangAttributeDetector);

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

            render(<TypesafeI18n locale={locale}><LibraryActionsWidget book={book} {...props} /></TypesafeI18n>, widget);
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
    const { LL } = useI18nContext();

    return (
        <li class="library-actions-list-item">
            <button class="library-action" onClick={() => onActionClick("check-single", book)}>{LL.libraryActions.checkSingle()}</button>
        </li>
    );
};
