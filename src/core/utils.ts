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
