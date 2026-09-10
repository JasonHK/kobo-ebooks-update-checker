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
    error: {
        unlisted: "This book was unlisted, there\u2019s no way to check update for this type of books at the moment.",
        parsing: "Failed to parse the latest product ID, please contact the developer for further investigations.",
        unknown: "Unknown error, please contact the developer for further investigations.",
    },
};

export default en_US;
