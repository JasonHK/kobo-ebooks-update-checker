/**
 * Clamps a value between a minimum and maximum range.
 * 
 * @param value The value to clamp.
 * @param min   The minimum allowable value.
 * @param max   The maximum allowable value.
 * @returns The clamped value.
 */
export function clamp(value: number, min: number, max: number): number
{
    return Math.min(Math.max(value, min), max);
}

/**
 * Creates a debounced version of the given handler function.
 * 
 * @template T The type of the handler function.
 * @param handler The function to debounce.
 * @param timeout The debounce timeout in milliseconds.
 * @returns A debounced version of the handler function.
 */
export function debounce<T extends (...args: unknown[]) => void>(handler: T, timeout?: number): T
export function debounce(handler: (...args: unknown[]) => void, timeout?: number): (...args: unknown[]) => void
{
    let id: number | undefined = undefined;
    return function(...args: unknown[]): void
    {
        clearTimeout(id);
        id = setTimeout(() => handler(...args), timeout);
    }
}
