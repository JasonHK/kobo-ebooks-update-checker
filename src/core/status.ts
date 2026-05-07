import type { Book } from "./books";

export type CheckStatus =
    | "pending"
    | "checking"
    | "latest"
    | "outdated"
    | "preview"
    | "skipped"
    | "failed";

export class BookStatus
{
    readonly book: Book;

    status: CheckStatus = "pending";

    message: string | null = null;

    constructor(book: Book)
    {
        this.book = book;
    }
}

export const StatusRegistry = new Map<string, BookStatus>();
