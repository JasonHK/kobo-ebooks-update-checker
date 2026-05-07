import { type Translation } from "../i18n-types";

const zh_TW: Translation = {
    secondaryControls: {
        checkPage: "為本頁檢查更新",
        checkPageInProgress: "正在檢查更新……",
        copyOutdated: "複製過時書籍",
    },
    libraryActions: {
        checkSingle: "檢查更新",
    },
    status: {
        pending: "等待中……",
        checking: "檢查中……",
        latest: "最新",
        outdated: "過時",
        preview: "預覽",
        skipped: "已略過",
        failed: "檢查失敗",
    },
    error: {
        unlisted: "該書已下架，目前尚未有方法為這類書籍檢查更新。",
        parsing: "無法解析最新的產品編號，請聯絡開發者以進一步調查。",
        unknown: "未知錯誤，請聯絡開發者以進一步調查。",
    },
};

export default zh_TW;
