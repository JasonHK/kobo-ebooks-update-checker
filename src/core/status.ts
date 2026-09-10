export type StatusType =
    | "pending"
    | "checking"
    | "latest"
    | "outdated"
    | "preview"
    | "skipped"
    | "failed";

export interface BookStatus
{
    type: StatusType;
    message?: string;
    error?: unknown;
}
