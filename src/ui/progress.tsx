import type { AriaAttributes, ComponentChildren, CSSProperties } from "preact";
import type { PropsWithChildren } from "preact/compat";
import clsx from "clsx";

import { clamp } from "../core/utils";
import classes from "./progress.module.scss";

export interface ProgressProps extends AriaAttributes
{
    class?: string;
    value?: number | false;
    max?: number;
    style?: CSSProperties;
}

export function Progress(props: PropsWithChildren<ProgressProps>): ComponentChildren
{
    const {
        class: classNames,
        value,
        max = 1,
        style = {},
        children,
        ...others
    } = props;

    const isIndeterminate = (typeof value !== "number");
    const progress = isIndeterminate ? 0 : clamp(value, 0, max);

    return (
        <div
            {...others}
            class={clsx(classes.progress, (isIndeterminate && classes.indeterminate), classNames)}
            role="progressbar"
            aria-valuenow={isIndeterminate ? undefined : progress}
            aria-valuemin={0}
            aria-valuemax={max}
            style={{ 
                ...style,
                "--progress": isIndeterminate ? null : `${((progress / max) * 100).toFixed(2)}%`
            }}
        >
            {children}
        </div>
    );
}
