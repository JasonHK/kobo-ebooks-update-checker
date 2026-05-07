import { z } from "zod/mini";
import { GM } from "$";

import { Book, BookGizmoConfig } from "./books";

type BookCacheValue = z.infer<typeof BookCacheValue>;
const BookCacheValue = z.object(
{
    config: BookGizmoConfig,
    storeUrl: z.url(),
    expiry: z.int(),
});

type BooksCacheValue = z.infer<typeof BooksCacheValue>;
const BooksCacheValue = z.array(z.tuple([z.uuid(), BookCacheValue]));

const booksCache = new Map<string, BookCacheValue>(BooksCacheValue.parse(await GM.getValue<BooksCacheValue>("booksCache", [])));

// export function getBookFromCache(id: string): Book | null
// {
    
// }
