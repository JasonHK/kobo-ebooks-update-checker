import { htmlLangAttributeDetector } from "typesafe-i18n/detectors";
import { detectLocale } from "./locales/i18n-util";
import { loadLocale } from "./locales/i18n-util.sync";

import Queue from "queue";

// import { getBooksMapFromPage } from "./core/loader";
import { renderSecondaryControlsWidget, type SecondaryControlsWidgetProps } from "./ui/secondary-controls";
import { renderLibraryActionsWidgets, type LibraryActionsWidgetOptions } from "./ui/library-actions";
import { Book } from "./core/books";
import { renderItemStatusWidget } from "./ui/item-status";

const locale = detectLocale(htmlLangAttributeDetector);
loadLocale(locale);

const queue = new Queue({ autostart: true, concurrency: 5 });

const observer = new MutationObserver(setupInterface);
observer.observe(document.getElementById("library-grid")!, { childList: true });

setupInterface();

function setupInterface()
{
    renderSecondaryControlsWidget({ onActionClick });
    renderLibraryActionsWidgets({ onActionClick });
}

async function onActionClick(...args: Parameters<SecondaryControlsWidgetProps["onActionClick"]> | Parameters<LibraryActionsWidgetOptions["onActionClick"]>)
{
    switch (args[0])
    {
        case "check-page":
            checkUpdateForPage();
            break;
        case "check-single":
            checkUpdate(args[1]);
            break;
    }
}

function checkUpdateForPage()
{
    const elements = document.querySelectorAll(".item-wrapper.book");
    for (const element of elements)
    {
        const book = Book.fromElement(element);
        checkUpdate(book);
    }
}

function checkUpdate(book: Book, interactive: boolean = true)
{
    renderItemStatusWidget(book, "pending");

    queue.push(async () =>
    {
        renderItemStatusWidget(book, "checking");

        const product = await book.getLatestProduct();
        if (product.productId === book.productId)
        {
            renderItemStatusWidget(book, "latest");
        }
        else
        {
            renderItemStatusWidget(book, "outdated");
        }
    });
}

function checkUpdateInBackground()
{

}
