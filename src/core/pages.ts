import { NetworkError, ParsingError } from "./errors";
import { LIBRARY_FIRST_PAGE, LIBRARY_LAST_PAGE, LIBRARY_NEXT_PAGE } from "./selectors";

export interface Page
{
    total: number;
    first: string;
    next: string | null;

    document: Document;
}

export function getPageFromDocument(document: Document = window.document): Page
{
    const first = document.querySelector(LIBRARY_FIRST_PAGE);
    const last = document.querySelector(LIBRARY_LAST_PAGE);
    const next = document.querySelector(LIBRARY_NEXT_PAGE);
    if (!(first instanceof HTMLAnchorElement) || !(last instanceof HTMLElement) || !next)
    {
        throw new ParsingError("Failed to parse the document");
    }

    return {
        total: Number.parseInt(last.innerText),
        first: first.href,
        next: (next instanceof HTMLAnchorElement) ? next.href : null,
        
        document,
    };
}

export async function fetchPageFromUrl(url: string, signal?: AbortSignal): Promise<Page>
{
    const response = await fetch(url, { signal, credentials: "same-origin" });
    if (!response.ok)
    {
        throw new NetworkError(response.statusText);
    }

    const html = await response.text();
    const parser = new DOMParser();
    const page = parser.parseFromString(html, "text/html");

    return getPageFromDocument(page);
}
