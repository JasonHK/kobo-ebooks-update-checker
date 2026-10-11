// ==UserScript==
// @name               Kobo e-Books Update Checker
// @name:zh-TW         Kobo 電子書更新檢查器
// @namespace          https://jasonhk.dev/
// @version            2.1.0
// @author             Jason Kwok
// @description        Checks if updates were available for the e-books you own.
// @description:zh-TW  檢查你購買的電子書是否有更新檔提供。
// @license            GPL-3.0
// @icon               https://icons.duckduckgo.com/ip3/www.kobo.com.ico
// @homepage           https://github.com/JasonHK/kobo-ebooks-update-checker#readme
// @homepageURL        https://github.com/JasonHK/kobo-ebooks-update-checker#readme
// @source             https://github.com/JasonHK/kobo-ebooks-update-checker.git
// @supportURL         https://github.com/JasonHK/kobo-ebooks-update-checker/issues
// @downloadURL        https://github.com/JasonHK/kobo-ebooks-update-checker/releases/latest/download/kobo-ebooks-update-checker.user.js
// @updateURL          https://github.com/JasonHK/kobo-ebooks-update-checker/releases/latest/download/kobo-ebooks-update-checker.meta.js
// @match              https://www.kobo.com/*/*/library/books
// @match              https://www.kobo.com/*/*/library/books?*
// @match              https://www.kobo.com/*/*/library/Books
// @match              https://www.kobo.com/*/*/library/Books?*
// @match              https://www.kobo.com/*/*/library/archive
// @match              https://www.kobo.com/*/*/library/archive?*
// @require            https://unpkg.com/clsx@2.1.1/dist/clsx.min.js
// @require            https://unpkg.com/preact@10.29.8/dist/preact.min.umd.js
// @require            https://unpkg.com/preact@10.29.8/hooks/dist/hooks.umd.js
// @require            https://unpkg.com/preact-render-to-string@6.7.0/dist/index.umd.js
// @require            https://unpkg.com/typesafe-i18n@5.27.1/dist/i18n.all.min.js
// @grant              GM.download
// @grant              GM.openInTab
// @grant              GM.setClipboard
// @grant              GM_addStyle
// @run-at             document-end
// ==/UserScript==