import { render } from "preact";
import { htmlLangAttributeDetector } from "typesafe-i18n/detectors";
import TypesafeI18n, { useI18nContext } from "../locales/i18n-preact";
import { detectLocale } from "../locales/i18n-util";

export type LibraryActionsAction = "check-single";

export type LibraryActionWidgetsProps = Omit<LibraryActionsWidgetProps, "book">;

const widgetsCache = new WeakMap<Element, HTMLDivElement>();

export function renderLibraryActionWidgets(props: LibraryActionWidgetsProps)
{
    const locale = detectLocale(htmlLangAttributeDetector);

    const books = document.querySelectorAll(".item-wrapper.book");
    for (const book of books)
    {
        const containers = book.querySelectorAll(".library-actions-list");
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

interface LibraryActionsWidgetProps
{
    book: Element;
    onActionClick: (action: LibraryActionsAction, target: Element) => void;
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
