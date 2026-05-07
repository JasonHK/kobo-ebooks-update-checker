import { ZodError } from "zod";
import { z } from "zod/mini";
import { UnlistedError, ParsingError } from "./errors";
import { fetchProductFromUrl, type Product } from "./products";

export type BookGizmoConfig = z.infer<typeof BookGizmoConfig>;
export const BookGizmoConfig = z.object(
{
    id: z.uuid(),
    productId: z.uuid(),
    title: z.string(),
    author: z.string(),
    imageUrl: z.string(),
});

export class Book
{
    #config: BookGizmoConfig;
    #storeUrl: string;

    #product: Product | null = null;

    /** The ID of this book. */
    get id(): string { return this.#config.id; }

    /** The product ID of this book. */
    get productId(): string { return this.#config.productId; }

    /** The title of this book. */
    get title(): string { return this.#config.title; }

    /** The author of this book. */
    get author(): string { return this.#config.author; }

    constructor(config: BookGizmoConfig, storeUrl: string)
    {
        this.#config = config;
        this.#storeUrl = storeUrl;
    }

    // async isOutdated()
    // {
    //     return 
    // }

    findElement(): Element | null
    {
        return document.querySelector(`.item-wrapper.book[data-track-info*="${CSS.escape(this.id)}"]`);
    }

    async getLatestProduct()
    {
        return fetchProductFromUrl(this.#storeUrl);
    }

    static fromElement(element: Element): Book
    {
        const action = element.querySelector(".library-action:is(.mark-as-finished, .remove-from-archive)");
        if (!(action instanceof HTMLElement)) { throw new ParsingError("Library action element not found."); }

        try
        {
            const config = BookGizmoConfig.parse(JSON.parse(action.dataset.koboGizmoConfig!));
            const storeUrl = getStoreUrl(element, config);
            return new Book(config, storeUrl);
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

function isAudiobook(element: Element): boolean
{
    return ((element.querySelector(".image-container .product-type-icon")?.childElementCount ?? 0) > 0);
}

function getStoreUrl(element: Element, { imageUrl }: BookGizmoConfig): string
{
    const titleUrl = element.querySelector<HTMLAnchorElement>(".product-field.title a")?.href;
    if (titleUrl?.startsWith("https://www.kobo.com/")) { return titleUrl; }

    const prefix = location.href.substring(0, location.href.indexOf("/library"));
    const bookType = isAudiobook(element) ? "audiobook" : "ebook";
    const productCode = imageUrl.substring(imageUrl.lastIndexOf("/") + 1, imageUrl.lastIndexOf("."));
    return `${prefix}/${bookType}/${productCode}`;
}
