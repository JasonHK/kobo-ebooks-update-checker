import { render, type ComponentChildren } from "preact";

import { LL } from "../locales";

import { useCheckActions } from "./hooks/check-actions";
import classes from "./secondary-controls.module.scss";

function SecondaryControls(): ComponentChildren
{
    const { checkStates, checkWholePage, checkWholeLibrary } = useCheckActions();
    const { isChecking, scope } = checkStates;

    return (
        <div class={classes.controls}>
            <ul>
                <li>
                    <button class={classes.button} disabled={isChecking} onClick={() => checkWholePage()}>
                        {(isChecking && (scope === "page")) ? LL.secondaryControls.checkPageInProgress() : LL.secondaryControls.checkPage()}
                    </button>
                </li>
                <li>
                    <button disabled={isChecking} onClick={() => checkWholeLibrary()}>
                        {LL.secondaryControls.checkLibrary()}
                    </button>
                </li>
            </ul>
        </div>
    );
};

/**
 * Sets up the secondary controls for the library page.
 */
export function setupSecondaryControls(): void
{
    const grid = document.querySelector(".secondary-controls");
    if (!grid) { throw new Error("Unable to find the container for secondary controls"); };

    const container = document.createElement("div");
    container.classList.add(classes.container);
    grid.insertBefore(container, grid.querySelector(".sort-by-container"));

    render(<SecondaryControls />, container);
}
