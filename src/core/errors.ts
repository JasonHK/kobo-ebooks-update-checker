export class NetworkError extends Error {}

export class ParsingError extends Error
{
    constructor(message?: string, options?: ErrorOptions)
    constructor(message?: string)
    constructor(message?: string, options?: ErrorOptions)
    {
        super(message ?? "Error occurred during parsing.", options);
    }
}

export class UnlistedError extends Error
{
    constructor(title?: string)
    {
        super(title ? `This book was unlisted from the store: ${title}` : "The book was unlisted from the store.");
    }
}
