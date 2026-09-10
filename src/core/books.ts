import { ZodError } from "zod";
import { z } from "zod/mini";
import { UnlistedError, ParsingError } from "./errors";
import { fetchProductFromUrl, type Product } from "./products";

type GizmoConfig = z.infer<typeof GizmoConfig>;
const GizmoConfig = z.object(
{
    id: z.uuid(),
    productId: z.uuid(),
    title: z.string(),
    author: z.string(),
    imageUrl: z.url(),
});

export type Book = z.infer<typeof Book>
export const Book = z.extend(z.omit(GizmoConfig, { imageUrl: true }),
{
    storeUrl: z.url(),
});

export function getElementByBook(book: Book): Element | null
{
    const { id } = book;
    return document.querySelector(`.item-wrapper.book[data-track-info*="${CSS.escape(id)}"]`);
}

export function getBookFromElement(element: Element): Book
{
    const action = element.querySelector(".library-action:is(.mark-as-finished, .remove-from-archive)");
    if (!(action instanceof HTMLElement)) { throw new ParsingError("Library action element not found."); }

    try
    {
        const { id, productId, title, author, imageUrl } = GizmoConfig.parse(JSON.parse(action.dataset.koboGizmoConfig!));
        const storeUrl = getStoreUrl(element, imageUrl);

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

function isAudiobook(element: Element): boolean
{
    return ((element.querySelector(".image-container .product-type-icon")?.childElementCount ?? 0) > 0);
}

function getStoreUrl(element: Element, imageUrl: string): string
{
    const titleUrl = element.querySelector<HTMLAnchorElement>(".product-field.title a")?.href;
    if (titleUrl?.startsWith("https://www.kobo.com/")) { return titleUrl; }

    const prefix = location.href.substring(0, location.href.indexOf("/library"));
    const bookType = isAudiobook(element) ? "audiobook" : "ebook";
    const productCode = imageUrl.substring(imageUrl.lastIndexOf("/") + 1, imageUrl.lastIndexOf("."));
    return `${prefix}/${bookType}/${productCode}`;
}
