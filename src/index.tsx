import { render } from "preact";

import { debounce } from "./core/utils";

import { setupSecondaryControls } from "./ui/secondary-controls";
import { setupLibraryActions } from "./ui/library-actions";
import { Root, setupRootContainer } from "./ui/root";

const setupIslands = debounce(() =>
{
    setupSecondaryControls();
    setupLibraryActions();
}, 200);

function startObserver(): MutationObserver
{
    const observer = new MutationObserver(setupIslands);
    observer.observe(document.getElementById("library-grid")!, { childList: true });

    return observer;
}

render(<Root />, setupRootContainer());
setupIslands();
startObserver();
