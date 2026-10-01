import type { GmDownloadErrorEvent } from "$";
import type { StatusType } from "../../ui/hooks/book-statuses";
import { type BaseTranslation } from "../i18n-types";

const en_US: BaseTranslation = {
    secondaryControls: {
        checkPage: "Check Update for Page",
        checkPageInProgress: "Checking Update...",
        checkLibrary: "Check Update for Library",
        copyOutdated: "Copy Outdated Books",
    },
    libraryActions: {
        checkUpdate: "Check Update",
    },
    status: {
        pending: "Pending...",
        checking: "Checking...",
        latest: "Latest",
        outdated: "Outdated",
        preview: "Preview",
        skipped: "Skipped",
        failed: "Failed",
    } satisfies Record<StatusType, string>,
    modals: {
        titles: {
            message: "Message",
            warning: "Warning",
            error: "Error",
            checkingInProgress: "Checking in Progress",
            checkCompleted: "Check Completed",
        },
        contents: {
            confirmCheckLibrary: "Checking for the entire library may take a while and trigger many requests. Continue?",
            confirmReloadLibrary: "Existing library cache was found, do you want to reload the library from the server? Previously checked books with successful results will be kept.",
            fetchLibrary: "Fetch Library",
            fetchLibraryProgress: "{fetchedPages:number} of {totalPages:number} Page{{totalPages:s}}",
            checkUpdate: "Check Update",
            checkUpdateProgress: "{checkedBooks:number} of {totalBooks:number} Title{{totalBooks:s}}",
            finishCheckingPage: "Finished checking the page. Checked {0:number} title{{s}} in total.",
            finishCheckingLibrary: "Finished checking the library. Checked {0:number} title{{s}} in total.",
            statusSummaries: {
                // Unused, kept for typing purposes.
                pending: "Pending: {0:number} Title{{s}}",
                checking: "Checking: {0:number} Title{{s}}",
                
                latest: "Latest: {0:number} Title{{s}}",
                outdated: "Outdated: {0:number} Title{{s}}",
                preview: "Preview: {0:number} Title{{s}}",
                skipped: "Skipped: {0:number} Title{{s}}",
                failed: "Failed: {0:number} Title{{s}}",
            } satisfies Record<StatusType, string>,
            downloadErrorDetails: " Error details: {0:string}",
            reportOpenedInTab: "Report was opened in a new tab instead.",
        },
        actions: {
            startChecking: "Start Checking",
            reloadLibrary: "Reload Library",
            bypassReloading: "Bypass Reloading",
            saveReport: "Save Report",
            gotIt: "Got It",
            cancel: "Cancel",
        },
    },
    report: {
        title: "Kobo e-Books Update Report",
        summary: "Report created on {timestamp:number|date} {timestamp:number|time}, with {totalChecked:number} title{{totalChecked:s}} checked in total.",
        sections: {
            // Unused, kept for typing purposes.
            pending: "Pending ({0:number} Title{{s}})",
            checking: "Checking ({0:number} Title{{s}})",

            latest: "Latest ({0:number} Title{{s}})",
            outdated: "Outdated ({0:number} Title{{s}})",
            preview: "Preview ({0:number} Title{{s}})",
            skipped: "Skipped ({0:number} Title{{s}})",
            failed: "Failed ({0:number} Title{{s}})",
        } satisfies Record<StatusType, string>,
    },
    error: {
        unlisted: "This book was unlisted, there’s no way to check update for this type of books at the moment.",
        parsing: "Failed to parse the latest product ID, please contact the developer for further investigations.",
        unknown: "Unknown error, please contact the developer for further investigations.",
        download: {
            not_enabled: "Download feature not enabled. Please enable it in the UserScript manager’s settings.",
            not_whitelisted: "File extension not whitelisted. Please add the .html extension to the UserScript manager’s whitelist.",
            not_permitted: "Downloads permission not granted. Please grant the permission to the UserScript manager.",
            not_supported: "Download feature not supported by the browser or UserScript manager.",
            not_succeeded: "Failed to download the file.",
        } satisfies Record<GmDownloadErrorEvent["error"], string>,
    },
};

export default en_US;
