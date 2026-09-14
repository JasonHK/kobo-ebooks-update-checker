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
    },
    modals: {
        titles: {
            message: "Message",
            warning: "Warning",
            checkingInProgress: "Checking in Progress...",
            checkCompleted: "Check Completed",
        },
        contents: {
            confirmCheckLibrary: "Checking for the entire library may take a while and trigger many requests. Continue?",
            fetchLibrary: "Fetch Library",
            fetchLibraryProgress: "{fetchedPages:number} of {totalPages:number} Page{{totalPages:s}}",
            checkUpdate: "Check Update",
            checkUpdateProgress: "{checkedBooks:number} of {totalBooks:number} Title{{totalBooks:s}}",
            finishCheckingPage: "Finished checking the page. Checked {0:number} title{{s}} in total.",
            finishCheckingLibrary: "Finished checking the library. Checked {0:number} title{{s}} in total.",
            statusSummaries: {
                latest: "Latest: {0: number} Title{{s}}",
                outdated: "Outdated: {0: number} Title{{s}}",
                preview: "Preview: {0: number} Title{{s}}",
                skipped: "Skipped: {0: number} Title{{s}}",
                failed: "Failed: {0: number} Title{{s}}",
            },
        },
        actions: {
            startChecking: "Start Checking",
            saveReport: "Save Report",
            gotIt: "Got It",
            cancel: "Cancel",
        },
    },
    error: {
        unlisted: "This book was unlisted, there’s no way to check update for this type of books at the moment.",
        parsing: "Failed to parse the latest product ID, please contact the developer for further investigations.",
        unknown: "Unknown error, please contact the developer for further investigations.",
    },
};

export default en_US;
