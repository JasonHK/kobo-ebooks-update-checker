import type { Translation } from "../i18n-types";

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
        preOrder: "預購",
        skipped: "已略過",
        failed: "檢查失敗",
    },
    modals: {
        titles: {
            message: "訊息",
            warning: "警告",
            error: "錯誤",
            checkingInProgress: "檢查中",
            checkCompleted: "檢查完成",
        },
        contents: {
            confirmCheckLibrary: "檢查整個書庫可能需要一段時間，並會發出大量請求。要繼續嗎？",
            confirmReloadLibrary: "已找到現有的書庫快取，是否要從伺服器重新載入書庫？先前檢查過且結果成功的書籍將會保留。",
            fetchLibrary: "檢索書庫",
            fetchLibraryProgress: "{fetchedPages}／{totalPages} 頁",
            checkUpdate: "檢查更新",
            checkUpdateProgress: "{checkedBooks}／{totalBooks} 本",
            finishCheckingPage: "完成檢查本頁。共檢查了 {0} 本圖書。",
            finishCheckingLibrary: "完成檢查書庫。共檢查了 {0} 本圖書。",
            statusSummaries: {
                // Unused, kept for typing purposes.
                pending: "等待中：{0} 本",
                checking: "檢查中：{0} 本",

                latest: "最新：{0} 本",
                outdated: "有更新：{0} 本",
                preview: "預覽：{0} 本",
                preOrder: "預購：{0} 本",
                skipped: "已略過：{0} 本",
                failed: "檢查失敗：{0} 本",
            },
            downloadErrorDetails: "錯誤詳細資訊：{0}",
            reportOpenedInTab: "報告已改為在新分頁中開啟。",
        },
        actions: {
            startChecking: "開始檢查",
            reloadLibrary: "重新載入書庫",
            bypassReloading: "略過重新載入",
            saveReport: "儲存報告",
            gotIt: "了解",
            cancel: "取消",
        },
    },
    report: {
        title: "Kobo 電子書更新報告",
        summary: "報告建立於 {timestamp|date} {timestamp|time}，共檢查 {totalChecked} 本書。",
        sections: {
            // Unused, kept for typing purposes.
            pending: "等待中（{0} 本）",
            checking: "檢查中（{0} 本）",

            latest: "最新（{0} 本）",
            outdated: "有更新（{0} 本）",
            preview: "預覽（{0} 本）",
            preOrder: "預購（{0} 本）",
            skipped: "已略過（{0} 本）",
            failed: "檢查失敗（{0} 本）",
        },
    },
    error: {
        unlisted: "該書已下架，目前尚未有方法為這類書籍檢查更新。",
        parsing: "無法解析最新的產品編號，請聯絡開發者以進一步調查。",
        unknown: "未知錯誤，請聯絡開發者以進一步調查。",
        download: {
            not_enabled: "尚未啟用下載功能。請在 UserScript 管理器的設定中啟用。",
            not_whitelisted: "檔案副檔名不在白名單中。請將 .html 副檔名加入 UserScript 管理器的白名單。",
            not_permitted: "尚未授予下載權限。請授予 UserScript 管理器相關權限。",
            not_supported: "瀏覽器或 UserScript 管理器不支援下載功能。",
            not_succeeded: "檔案下載失敗。",
        },
    },
};

export default zh_TW;
