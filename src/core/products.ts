import { ZodError } from "zod";
import { z } from "zod/mini";
import { NetworkError, ParsingError, UnlistedError } from "./errors";

type GizmoConfig = z.infer<typeof GizmoConfig>;
const GizmoConfig = z.object(
{
    /** The unique identifier for the product. */
    productId: z.uuid(),

    /** The type of the product. */
    productType: z.string(),
});

/**
 * Represents a product in the Kobo store.
 */
export type Product = z.infer<typeof Product>;
export const Product = GizmoConfig;

/**
 * Fetches a product from a given URL.
 * 
 * @param url The URL to fetch the product from.
 * @returns A promise that resolves to the product.
 */
export async function fetchProductFromUrl(url: string): Promise<Product>
{
    const response = await fetch(url, { credentials: "omit" });
    if (!response.ok)
    {
        if (response.status === 404)
        {
            throw new UnlistedError();
        }
        
        throw new NetworkError(response.statusText);
    }

    const html = await response.text();
    const parser = new DOMParser();
    const page = parser.parseFromString(html, "text/html");

    return getProductFromDocument(page);
}

/**
 * Gets a product from a document.
 * 
 * @param document The document to get the product from.
 * @returns The product.
 */
function getProductFromDocument(document: Document): Product
{
    const detail = document.querySelector(".item-detail");
    if (!(detail instanceof HTMLElement)) { throw new ParsingError("Item detail element not found."); }

    try
    {
        const { productId, productType } = GizmoConfig.parse(JSON.parse(detail.dataset.koboGizmoConfig!));
        return { productId, productType };
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
