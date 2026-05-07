import { render } from "preact";
import { LL } from "../locales";

import classes from "./secondary-controls.module.scss";

export type SecondaryControlsAction = "check-page" | "copy";

export interface SecondaryControlsWidgetProps
{
    onActionClick: (action: SecondaryControlsAction) => void;
}

const widgetsCache = new WeakMap<Element, HTMLDivElement>();

export function renderSecondaryControlsWidget(props: SecondaryControlsWidgetProps): void
{
    const container = document.querySelector(".secondary-controls");
    if (!container) { throw new Error("Unable to find the container for secondary controls"); };

    let widget = widgetsCache.get(container);
    if (!widget)
    {
        widget = document.createElement("div");
        widget.classList.add(classes.widget);
        widgetsCache.set(container, widget);

        container.classList.add(classes.container);
        container.insertBefore(widget, container.querySelector(".sort-by-container"));
    }

    render(<SecondaryControlsWidget {...props} />, widget);
}

const SecondaryControlsWidget = ({ onActionClick }: SecondaryControlsWidgetProps) =>
{
    return (
        <div class={classes.controls}>
            <button class={classes.button} onClick={() => onActionClick("check-page")}>{LL.secondaryControls.checkPage()}</button>
        </div>
    );
};
