import { type Translation } from "../i18n-types";

const zh_TW: Translation = {
    secondaryControls: {
        checkPage: "為本頁檢查更新",
        checkPageInProgress: "正在檢查更新……",
        checkLibrary: "為書庫檢查更新",
        copyOutdated: "複製有更新書籍",
    },
    libraryActions: {
        checkUpdate: "檢查更新",
    },
    status: {
        pending: "等待中……",
        checking: "檢查中……",
        latest: "最新",
        outdated: "有更新",
        preview: "預覽",
        skipped: "已略過",
        failed: "檢查失敗",
    },
    modals: {
        titles: {
            message: "訊息",
            warning: "警告",
            checkingInProgress: "檢查中……",
            checkCompleted: "檢查完成",
        },
        contents: {
            confirmCheckLibrary: "檢查整個書庫可能需要一段時間，並會發出大量請求。要繼續嗎？",
            fetchLibrary: "檢索書庫",
            fetchLibraryProgress: "{fetchedPages}／{totalPages} 頁",
            checkUpdate: "檢查更新",
            checkUpdateProgress: "{checkedBooks}／{totalBooks} 本書",
            finishCheckingPage: "完成檢查本頁。共檢查了 {0} 本圖書。",
            finishCheckingLibrary: "完成檢查書庫。共檢查了 {0} 本圖書。",
            statusSummaries: {
                latest: "最新：{0} 本",
                outdated: "有更新：{0} 本",
                preview: "預覽：{0} 本",
                skipped: "已略過：{0} 本",
                failed: "檢查失敗：{0} 本",
            },
        },
        actions: {
            startChecking: "開始檢查",
            saveReport: "儲存報告",
            gotIt: "了解",
            cancel: "取消",
        },
    },
    error: {
        unlisted: "該書已下架，目前尚未有方法為這類書籍檢查更新。",
        parsing: "無法解析最新的產品編號，請聯絡開發者以進一步調查。",
        unknown: "未知錯誤，請聯絡開發者以進一步調查。",
    },
};

export default zh_TW;
