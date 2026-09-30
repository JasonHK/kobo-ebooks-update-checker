import { NetworkError, ParsingError } from "./errors";
import { LIBRARY_FIRST_PAGE, LIBRARY_LAST_PAGE, LIBRARY_NEXT_PAGE } from "./selectors";

/**
 * Represents the pagination information of a library page.
 */
export interface Page
{
    /** The total number of pages in the library. */
    total: number;
    /** The URL of the first page in the library. */
    first: string;
    /** The URL of the next page in the library, or `null` if there is no next page. */
    next: string | null;

    /** The document object of the current page. */
    document: Document;
}

/**
 * Gets the page information from a document.
 * 
 * @param document The document to extract the page information from.
 * @returns The page information extracted from the document.
 */
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

/**
 * Fetches a page from the given URL and extracts its page information.
 * 
 * @param url    The URL of the page to fetch.
 * @param signal An optional AbortSignal to cancel the fetch request.
 * @returns The page information extracted from the fetched document.
 */
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
