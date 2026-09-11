import { ZodError } from "zod";
import { z } from "zod/mini";
import { ParsingError } from "./errors";
import { LIBRARY_BOOKS } from "./selectors";

type GizmoConfig = z.infer<typeof GizmoConfig>;
const GizmoConfig = z.object(
{
    /** The unique identifier for the book. */
    id: z.uuid(),

    /** The product ID for the book. */
    productId: z.uuid(),

    /** The title of the book. */
    title: z.string(),

    /** The author of the book. */
    author: z.string(),

    /** The URL of the book's image. */
    imageUrl: z.string(),
});

/**
 * Represents a book in the library.
 */
export type Book = z.infer<typeof Book>
export const Book = z.extend(z.omit(GizmoConfig, { imageUrl: true }),
{
    /** The URL of the book's store page. */
    storeUrl: z.url(),
});

/**
 * Gets a book from a library element.
 * 
 * @param element The library element to get the book from.
 * @returns The book.
 */
export function getBookFromElement(element: Element): Book
{
    const action = element.querySelector(".library-action:is(.mark-as-finished, .remove-from-archive)");
    if (!(action instanceof HTMLElement)) { throw new ParsingError("Library action element not found."); }

    try
    {
        const config = GizmoConfig.parse(JSON.parse(action.dataset.koboGizmoConfig!));

        const { id, productId, title, author } = config;
        const storeUrl = getStoreUrl(element, config);
        return { id, productId, title, author, storeUrl };
    }
    catch (error: unknown)
    {
        if ((error instanceof SyntaxError) || (error instanceof ZodError))
        {
            throw new ParsingError("Malformed Kobo Gizmo config", { cause: error });
        }

        throw error;
    }
}

/**
 * Determines if a library element represents an audiobook.
 * 
 * @param element The library element to check.
 * @returns `true` if the element represents an audiobook, `false` otherwise.
 */
function isAudiobook(element: Element): boolean
{
    return ((element.querySelector(".image-container .product-type-icon")?.childElementCount ?? 0) > 0);
}

/**
 * Gets the store URL for a book from a library element and its Gizmo config.
 * 
 * @param element The library element to get the store URL from.
 * @param config  The Gizmo config for the book.
 * @returns The store URL for the book.
 */
function getStoreUrl(element: Element, config: GizmoConfig): string
{
    const { imageUrl } = config;

    const titleUrl = element.querySelector<HTMLAnchorElement>(".product-field.title a")?.href;
    if (titleUrl?.startsWith("https://www.kobo.com/")) { return titleUrl; }

    const prefix = location.href.substring(0, location.href.indexOf("/library"));
    const bookType = isAudiobook(element) ? "audiobook" : "ebook";
    const productCode = imageUrl.substring(imageUrl.lastIndexOf("/") + 1, imageUrl.lastIndexOf("."));
    return `${prefix}/${bookType}/${productCode}`;
}

/**
 * Gets all books from a document.
 * 
 * @param document The document to get the books from. Defaults to `window.document`.
 * @returns An array of all books in the document.
 */
export function getBooksFromDocument(document: Document = window.document): Book[]
{
    return Array.from(document.querySelectorAll(LIBRARY_BOOKS)).map(getBookFromElement);
}

/**
 * Gets the library element for a book.
 * 
 * @param book The book to get the library element for.
 * @returns The library element for the book, or `null` if not found.
 */
export function getElementByBook(book: Book): Element | null
{
    const { id } = book;
    return document.querySelector(`${LIBRARY_BOOKS}[data-track-info*="${CSS.escape(id)}"]`);
}
