import type { ComponentChildren } from "preact";
import { renderToString } from "preact-render-to-string";
import { GM } from "$";

import type { CheckResults } from "../core/checker";
import { LL, locale } from "../locales";

import type { StatusType } from "./hooks/book-statuses";
import { closeModal, openModal } from "./hooks/modals";

export type ExportReportOptions = Omit<ReportProps, "timestamp">;

export function exportReport(options: ExportReportOptions): void
{
    const timestamp = Date.now();
    const report = `<!DOCTYPE html>${renderToString(<Report timestamp={timestamp} {...options} />)}`;
    const reportUrl = URL.createObjectURL(new Blob([report], { type: "text/html" }));

    GM.download(
        {
            name: `Kobo Update Report ${timestamp}.html`,
            url: reportUrl,
            saveAs: true,

            onload: () => URL.revokeObjectURL(reportUrl),
            onerror: async ({ error, details }) =>
            {
                const tab = await GM.openInTab(reportUrl, { active: true });
                tab.onclose = () => URL.revokeObjectURL(reportUrl);

                const id = openModal(
                    {
                        title: LL.modals.titles.error(),
                        content:
                        <>
                            <p>{LL.error.download[error]()}{details && LL.modals.contents.downloadErrorDetails(details)}</p>
                            <p>{LL.modals.contents.reportOpenedInTab()}</p>
                        </>,
                        actions: <button onClick={() => closeModal(id)}>{LL.modals.actions.gotIt()}</button>
                    });
            },
        });
}

const REPORT_ORDER: StatusType[] = [
    "latest",
    "outdated",
    "preview",
    "preOrder",
    "skipped",
    "failed",
];

interface ReportProps
{
    timestamp: number;
    totalChecked: number;
    results: CheckResults;
}

function Report(props: ReportProps): ComponentChildren
{
    const { timestamp, totalChecked, results } = props;

    return (
        <html lang={locale}>
            <head>
                <title>{LL.report.title()}</title>
                <meta charset="utf-8" />
            </head>
            <body>
                <h1>{LL.report.title()}</h1>
                <p>{LL.report.summary({ timestamp, totalChecked })}</p>
                {REPORT_ORDER.map((status) =>
                {
                    const books = results.get(status);
                    if (!books || (books.length === 0)) { return null; }

                    return (
                        <>
                            <h2>{LL.report.sections[status](books.length)}</h2>
                            <ul>
                                {books.map((book) => (<li>{book.title}</li>))}
                            </ul>
                        </>
                    );
                })}
            </body>
        </html>
    );
}
