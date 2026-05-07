import { render } from "preact";
import { htmlLangAttributeDetector } from "typesafe-i18n/detectors";
import TypesafeI18n, { useI18nContext } from "../locales/i18n-preact";
import { detectLocale } from "../locales/i18n-util";

import classes from "./secondary-controls.module.scss";

export type SecondaryControlsAction = "check-page" | "copy";

export interface SecondaryControlsWidgetProps
{
    onActionClick: (action: SecondaryControlsAction) => void;
}

const widgetsCache = new WeakMap<Element, HTMLDivElement>();

export function renderSecondaryControlsWidget(props: SecondaryControlsWidgetProps): void
{
    const locale = detectLocale(htmlLangAttributeDetector);

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

    render(<TypesafeI18n locale={locale}><SecondaryControlsWidget {...props} /></TypesafeI18n>, widget);
}

const SecondaryControlsWidget = ({ onActionClick }: SecondaryControlsWidgetProps) =>
{
    const { LL } = useI18nContext();

    return (
        <div class={classes.controls}>
            <button class={classes.button} onClick={() => onActionClick("check-page")}>{LL.secondaryControls.checkPage()}</button>
        </div>
    );
};
