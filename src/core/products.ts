import { ZodError } from "zod";
import { z } from "zod/mini";
import { NetworkError, ParsingError, UnlistedError } from "./errors";

/**
 * The regular expression pattern used to match the `__next_f.push` calls in the HTML scripts.
 */
const NEXT_PUSH_PATTERN = /self\.__next_f\.push\(\s*\[\s*1\s*,\s*("(?:\\.|[^"\\])*")\s*\]\s*\)/g;

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
export async function fetchProductFromUrl(url: string, signal?: AbortSignal): Promise<Product>
{
    const response = await fetch(url, { signal, credentials: "omit" });
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
    if (detail instanceof HTMLElement)
    {
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
    
    const chunks: string[] = [];
    for (const script of document.scripts)
    {
        for (const match of script.textContent.matchAll(NEXT_PUSH_PATTERN))
        {
            chunks.push(JSON.parse(match[1]));
        }
    }

    for (const row of chunks.join("").split("\n"))
    {
        const separatorIndex = row.indexOf(":");
        if (separatorIndex < 1) { continue; }

        try
        {
            const data = JSON.parse(row.slice(separatorIndex + 1));
            const itemDetails = findItemDetails(data);
            if (itemDetails)
            {
                const { productId, productType } = GizmoConfig.parse(itemDetails);
                return { productId, productType };
            }
        }
        catch (error: unknown)
        {
            if (error instanceof ZodError)
            {
                throw new ParsingError("Malformed Kobo Gizmo config", { cause: error });
            }
        }
    }


/**
 * Recursively searches for an "itemDetails" object within the given value.
 * 
 * @param value The value to search for item details.
 * @returns The item details object if found, otherwise `null`.
 */
function findItemDetails(value: unknown): object | null
{
    if (!value || (typeof value !== "object")) { return null; }
    if (Reflect.has(value, "itemDetails"))
    {
        const itemDetails: unknown = Reflect.get(value, "itemDetails");
        if (!itemDetails || (typeof itemDetails !== "object")) { return null; }
        return itemDetails;
    }

    for (const child of Object.values(value))
    {
        const result = findItemDetails(child);
        if (result) { return result; }
    }

    return null;
}
