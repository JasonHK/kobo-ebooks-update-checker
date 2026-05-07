import { ZodError } from "zod";
import { z } from "zod/mini";
import { NetworkError, ParsingError, UnlistedError } from "./errors";

type ProductGizmoConfig = z.infer<typeof ProductGizmoConfig>;
const ProductGizmoConfig = z.object(
{
    productId: z.uuid(),
    productType: z.string(),
});

export class Product
{
    #config: ProductGizmoConfig;

    get productId() { return this.#config.productId; }

    get productType() { return this.#config.productType; }

    constructor(config: ProductGizmoConfig)
    {
        this.#config = config;
    }

    static fromDocument(document: Document): Product
    {
        const detail = document.querySelector(".item-detail");
        if (!(detail instanceof HTMLElement)) { throw new ParsingError("Item detail element not found."); }

        try
        {
            const config = ProductGizmoConfig.parse(JSON.parse(detail.dataset.koboGizmoConfig!));
            return new Product(config);
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
}

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

    return Product.fromDocument(page);
} 
