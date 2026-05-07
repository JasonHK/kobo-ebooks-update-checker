import { loadAllLocales } from "./locales/i18n-util.sync";

// import { getBooksMapFromPage } from "./core/loader";
import { renderSecondaryControlsWidget } from "./ui/secondary-controls";
import { renderLibraryActionWidgets } from "./ui/library-actions";

loadAllLocales();

const observer = new MutationObserver(setupInterface);
observer.observe(document.getElementById("library-grid")!, { childList: true });

setupInterface();

function setupInterface()
{
    // getBooksMapFromPage(document);

    renderSecondaryControlsWidget({ onActionClick: console.log });
    renderLibraryActionWidgets({ onActionClick: console.log });
}
