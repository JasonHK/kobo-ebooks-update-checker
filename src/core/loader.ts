import { Book } from "./books";

export function getBooksFromPage(document: Document)
{
    return Array.from(getBooksMapFromPage(document).keys());
}

export function getBooksMapFromPage(document: Document)
{
    return new Map(Array.from(document.querySelectorAll(".item-wrapper.book")).map((element) => [Book.fromElement(element), element]));
}
