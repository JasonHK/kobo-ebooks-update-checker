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

(function(preact, typesafe_i18n, preact_hooks, clsx, preact_render_to_string) {
	"use strict";
	var __create = Object.create;
	var __defProp$1 = Object.defineProperty;
	var __getOwnPropDesc$1 = Object.getOwnPropertyDescriptor;
	var __getOwnPropNames$1 = Object.getOwnPropertyNames;
	var __getProtoOf = Object.getPrototypeOf;
	var __hasOwnProp$1 = Object.prototype.hasOwnProperty;
	var __copyProps$1 = (to, from, except, desc) => {
		if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames$1(from), i = 0, n = keys.length, key; i < n; i++) {
			key = keys[i];
			if (!__hasOwnProp$1.call(to, key) && key !== except) __defProp$1(to, key, {
				get: ((k) => from[k]).bind(null, key),
				enumerable: !(desc = __getOwnPropDesc$1(from, key)) || desc.enumerable
			});
		}
		return to;
	};
	var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps$1(isNodeMode || !mod || !mod.__esModule || !__hasOwnProp$1.call(mod, "default") ? __defProp$1(target, "default", {
		value: mod,
		enumerable: true
	}) : target, mod));
	preact_hooks = __toESM(preact_hooks);
	clsx = __toESM(clsx);
	var s = new Set();
	var _css = async (t) => {
		if (s.has(t)) return;
		s.add(t);
		((c) => {
			if (typeof GM_addStyle === "function") GM_addStyle(c);
			else (document.head || document.documentElement).appendChild(document.createElement("style")).append(c);
		})(t);
	};
	_css(" .item-status:has(._outdated_kltd7_1){background:oklch(74.984% .14871 21.212)}.item-status:has(._skipped_kltd7_5){background:oklch(77.311% .00009 271.152)}.item-status:has(._failed_kltd7_9){background:oklch(79.622% .17071 71.703)}.item-status:has(:is(._skipped_kltd7_5,._failed_kltd7_9)) a{text-decoration-line:underline;cursor:help!important}._progress_by2as_1{text-indent:100%;background:#f1f6fa;border-radius:10px;width:200px;height:10px;position:relative;overflow:hidden;box-shadow:inset 0 0 0 1px #ccd6dd}._progress_by2as_1:after{border-radius:inherit;width:var(--progress,0);content:\"\";background-color:currentColor;height:100%;position:absolute;top:0;left:0}._progress_by2as_1._indeterminate_by2as_21:after{--progress:20%;transition:none;animation:1s linear infinite alternate _indeterminate_by2as_21}._progress_by2as_1._no-transition_by2as_26:after{transition:none}@keyframes _indeterminate_by2as_21{0%{transform:translate(0%)}to{transform:translate(400%)}}._step_16esp_1{text-align:center;width:400px}@media (width<=568px){._step_16esp_1{width:100%}}._step_16esp_1 h3{margin:6px 0;font-size:1.4rem}._step_16esp_1 p{font-size:1.3rem}._message_16esp_18{text-align:start;width:100%}._details_16esp_23{border-top:1px solid #000;width:100%}._details_16esp_23:last-of-type{border-bottom:1px solid #000}._details_16esp_23 summary{cursor:pointer;width:100%;padding:.5rem 0;position:relative}._details_16esp_23 summary:after{content:\"\";background:url(\"data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2018%2030'%3e%3cpath%20d='m.9%2015%2014.8%2014.3%201.4-1.4L3.8%2015%2017.1%202.1%2015.7.7'/%3e%3c/svg%3e\") 50%/contain no-repeat;width:1lh;height:1lh;transition:all .2s linear;position:absolute;right:0;transform:scale(.6)}._details_16esp_23[open] summary:after{transform:scale(.6)rotate(-90deg)}._details_16esp_23 ul{padding:.75rem 0 1rem 3rem;font-size:1.35rem;list-style:outside}.secondary-controls{flex-wrap:wrap}@media (width<=568px){.secondary-controls{margin-right:18px}}._container_1p8xn_10{text-align:right;align-items:center;display:flex}@media (width<=568px){._container_1p8xn_10{text-align:left;flex-direction:column;width:100%;margin-bottom:1.5rem;display:flex}}._controls_1p8xn_25{width:auto;min-width:13rem;margin-right:1rem}@media (width<=568px){._controls_1p8xn_25{white-space:break-spaces;width:100%;margin-right:0}}@media (width>=569px){._controls_1p8xn_25 ul{gap:.5ch;display:flex}}@media (width<=568px){._controls_1p8xn_25 ul li:not(:first-child){margin-top:18px}}._controls_1p8xn_25 ul li button{color:#000;text-align:left;text-overflow:ellipsis;white-space:nowrap;white-space:nowrap;background-color:#eee;border-radius:20px;width:auto;min-width:0;max-width:100%;font-family:Rakuten Sans UI,Trebuchet MS,Trebuchet,Arial,Helvetica,sans-serif;font-size:1.6rem;font-weight:400;transition:background-color .3s ease-in-out,color .15s ease-in-out;position:relative;overflow:hidden}._controls_1p8xn_25 ul li button:before{content:\"\";opacity:0;background-color:#0000001a;border-radius:80px;width:calc(100% - 30px);height:60px;position:absolute;top:calc(50% - 30px);transform:scale(0)}._controls_1p8xn_25 ul li button:disabled{background-color:\"#dcdcdc\";color:#0000006b;pointer-events:none}._controls_1p8xn_25 ul li button:hover{background-color:#0000000a}._controls_1p8xn_25 ul li button:focus:before{opacity:1;transform:scale(1)}._controls_1p8xn_25 ul li button:active{color:#fff;background-color:#000}@media (width<=568px){._controls_1p8xn_25 ul li button{text-align:center;width:100%;margin-left:0!important;margin-right:0!important}._controls_1p8xn_25 ul li button:not(:first-child){margin-top:8px}}._action_1lh30_1:disabled{color:oklch(60% .00005 271.152)!important;background-color:#0000!important}:root{--update-checker--primary-color:#bf0000;--update-checker--secondary-color:#595959}html:has(._dialog_1cuj5_6[open]){overflow:clip}._dialog_1cuj5_6{box-sizing:border-box;scrollbar-width:thin;overscroll-behavior:contain;color:#595959;border:none;flex-direction:column;align-items:center;padding:5rem 2rem 2rem;font-family:Georgia,Times,times,serif;font-size:1.4rem;line-height:1.8rem;display:flex}._dialog_1cuj5_6::backdrop{overscroll-behavior:contain;background-color:#000000a6;overflow:hidden}@media (width<=568px){._dialog_1cuj5_6{width:auto;max-width:43rem}}._dialog_1cuj5_6 ._close_1cuj5_35{background-image:url(\"data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2048%2048'%3e%3cpath%20fill='%23010101'%20d='M25.4%2024%2048%2046.6l-.7.7-.7.7L24%2025.4%201.4%2048l-.7-.7-.7-.7L22.6%2024%200%201.4.7.7l.7-.7L24%2022.6%2046.6%200l.7.7.7.7'/%3e%3c/svg%3e\");background-position:50%;background-repeat:no-repeat;background-size:1.5rem 1.5rem;border:0;width:3.5rem;height:3.5rem;min-height:35px;margin:16px;padding:0 15px;transition:background-color .2s,color .2s;display:inline-block;position:absolute;top:0;right:0}._dialog_1cuj5_6 ._close_1cuj5_35:is(:hover,:focus,:active){background-image:url(\"data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2048%2048'%3e%3cpath%20d='M25.4%2024%2048%2046.6l-.7.7-.7.7L24%2025.4%201.4%2048l-.7-.7-.7-.7L22.6%2024%200%201.4.7.7l.7-.7L24%2022.6%2046.6%200l.7.7.7.7'%20style='fill:%23fff'/%3e%3c/svg%3e\");background-color:var(--update-checker--secondary-color)}._dialog_1cuj5_6 header h2{color:#0d0d0d;text-align:center;margin:0 0 2rem;padding:0;font-family:Rakuten Sans UI,Trebuchet MS,Trebuchet,Arial,Helvetica,sans-serif;font-size:2.2rem;font-style:normal;line-height:2.2rem}@media (width<=568px){._dialog_1cuj5_6 header h2{margin-bottom:1.5rem;font-size:1.6rem;line-height:1.6rem}}._dialog_1cuj5_6 footer{flex-direction:row-reverse;justify-content:center;gap:1rem;width:auto;margin:3rem auto 0;display:flex}@media (width<=568px){._dialog_1cuj5_6 footer{flex-direction:column;gap:1.5rem;width:100%}}._dialog_1cuj5_6 footer button{border-style:solid;border-width:3px;border-color:var(--update-checker--secondary-color);box-sizing:border-box;color:#fff;background:#000;background-color:var(--update-checker--secondary-color);text-align:center;cursor:pointer;border-radius:0;outline:0;min-width:70px;min-height:35px;padding:0 15px;font-family:Rakuten Sans UI,Trebuchet MS,Trebuchet,Arial,Helvetica,sans-serif;font-size:1.4rem;font-style:normal;font-weight:700;transition:background-color .2s,color .2s;display:inline-block}._dialog_1cuj5_6 footer button:is(:hover,:focus,:active){color:var(--update-checker--secondary-color);background-color:#fff}._dialog_1cuj5_6 footer button.primary{border-color:var(--update-checker--primary-color);color:#fff;background-color:var(--update-checker--primary-color);padding:0 15px}._dialog_1cuj5_6 footer button.primary:is(:hover,:focus,:active){color:var(--update-checker--primary-color);background-color:#fff}\n/*$vite$:1*/ ");
	var __defProp = Object.defineProperty;
	var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
	var __getOwnPropNames = Object.getOwnPropertyNames;
	var __hasOwnProp = Object.prototype.hasOwnProperty;
	var __exportAll = (all, no_symbols) => {
		let target = {};
		for (var name in all) __defProp(target, name, {
			get: all[name],
			enumerable: true
		});
		if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
		return target;
	};
	var __copyProps = (to, from, except, desc) => {
		if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
			key = keys[i];
			if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
				get: ((k) => from[k]).bind(null, key),
				enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
			});
		}
		return to;
	};
	var __reExport = (target, mod, secondTarget) => (__copyProps(target, mod, "default"), secondTarget && __copyProps(secondTarget, mod, "default"));
	function clamp(value, min, max) {
		return Math.min(Math.max(value, min), max);
	}
	function debounce(handler, timeout) {
		let id = void 0;
		return function(...args) {
			clearTimeout(id);
			id = setTimeout(() => handler(...args), timeout);
		};
	}
	var p = (e) => !!e;
	var n$1 = (e) => Array.from(new Set(e));
	var Nr = (e, o, ...s) => {
		for (let i of s) {
			let t = l(o, i);
			if (t) return t;
		}
		return e;
	};
	var l = (e, o) => {
		let i = n$1(o().map((r) => r.toLowerCase()).flatMap((r) => [r, r.split("-")[0]])), t = e.map((r) => r.toLowerCase());
		return i.map((r) => {
			let c = t.findIndex((x) => x === r);
			return c >= 0 && e[c];
		}).find(p);
	};
	var r$1 = (e) => !!e;
	var ye = () => [document?.documentElement?.lang].filter(r$1);
	var baseLocale = "en-US";
	var locales = ["en-US", "zh-TW"];
	var loadedLocales = {};
	var loadedFormatters = {};
	var i18nObject$1 = (locale) => (0, typesafe_i18n.i18nObject)(locale, loadedLocales[locale], loadedFormatters[locale]);
	var detectLocale = (...detectors) => Nr(baseLocale, locales, ...detectors);
	var o$1 = (t, r = {}) => {
		let e = new Intl.DateTimeFormat(t, r);
		return (n) => e.format(n);
	};
	var o = (t, r = {}) => {
		let e = new Intl.DateTimeFormat(t, r);
		return (n) => e.format(n);
	};
	var initFormatters = (locale) => {
		return {
			date: o$1(locale, { dateStyle: "long" }),
			time: o(locale, {
				timeStyle: "medium",
				hourCycle: "h23"
			})
		};
	};
	var localeTranslations = {
		"en-US": {
			secondaryControls: {
				checkPage: "Check Update for Page",
				checkPageInProgress: "Checking Update...",
				checkLibrary: "Check Update for Library",
				copyOutdated: "Copy Outdated Books"
			},
			libraryActions: { checkUpdate: "Check Update" },
			status: {
				pending: "Pending...",
				checking: "Checking...",
				latest: "Latest",
				outdated: "Outdated",
				preview: "Preview",
				preOrder: "Pre-order",
				skipped: "Skipped",
				failed: "Failed"
			},
			modals: {
				titles: {
					message: "Message",
					warning: "Warning",
					error: "Error",
					checkingInProgress: "Checking in Progress",
					checkCompleted: "Check Completed"
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
						pending: "Pending: {0:number} Title{{s}}",
						checking: "Checking: {0:number} Title{{s}}",
						latest: "Latest: {0:number} Title{{s}}",
						outdated: "Outdated: {0:number} Title{{s}}",
						preview: "Preview: {0:number} Title{{s}}",
						preOrder: "Pre-order: {0:number} Title{{s}}",
						skipped: "Skipped: {0:number} Title{{s}}",
						failed: "Failed: {0:number} Title{{s}}"
					},
					downloadErrorDetails: " Error details: {0:string}",
					reportOpenedInTab: "Report was opened in a new tab instead."
				},
				actions: {
					startChecking: "Start Checking",
					reloadLibrary: "Reload Library",
					bypassReloading: "Bypass Reloading",
					saveReport: "Save Report",
					gotIt: "Got It",
					cancel: "Cancel"
				}
			},
			report: {
				title: "Kobo e-Books Update Report",
				summary: "Report created on {timestamp:number|date} {timestamp:number|time}, with {totalChecked:number} title{{totalChecked:s}} checked in total.",
				sections: {
					pending: "Pending ({0:number} Title{{s}})",
					checking: "Checking ({0:number} Title{{s}})",
					latest: "Latest ({0:number} Title{{s}})",
					outdated: "Outdated ({0:number} Title{{s}})",
					preview: "Preview ({0:number} Title{{s}})",
					preOrder: "Pre-order ({0:number} Title{{s}})",
					skipped: "Skipped ({0:number} Title{{s}})",
					failed: "Failed ({0:number} Title{{s}})"
				}
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
					not_succeeded: "Failed to download the file."
				}
			}
		},
		"zh-TW": {
			secondaryControls: {
				checkPage: "為本頁檢查更新",
				checkPageInProgress: "正在檢查更新……",
				checkLibrary: "為書庫檢查更新",
				copyOutdated: "複製有更新書籍"
			},
			libraryActions: { checkUpdate: "檢查更新" },
			status: {
				pending: "等待中……",
				checking: "檢查中……",
				latest: "最新",
				outdated: "有更新",
				preview: "預覽",
				preOrder: "預購",
				skipped: "已略過",
				failed: "檢查失敗"
			},
			modals: {
				titles: {
					message: "訊息",
					warning: "警告",
					error: "錯誤",
					checkingInProgress: "檢查中",
					checkCompleted: "檢查完成"
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
						pending: "等待中：{0} 本",
						checking: "檢查中：{0} 本",
						latest: "最新：{0} 本",
						outdated: "有更新：{0} 本",
						preview: "預覽：{0} 本",
						preOrder: "預購：{0} 本",
						skipped: "已略過：{0} 本",
						failed: "檢查失敗：{0} 本"
					},
					downloadErrorDetails: "錯誤詳細資訊：{0}",
					reportOpenedInTab: "報告已改為在新分頁中開啟。"
				},
				actions: {
					startChecking: "開始檢查",
					reloadLibrary: "重新載入書庫",
					bypassReloading: "略過重新載入",
					saveReport: "儲存報告",
					gotIt: "了解",
					cancel: "取消"
				}
			},
			report: {
				title: "Kobo 電子書更新報告",
				summary: "報告建立於 {timestamp|date} {timestamp|time}，共檢查 {totalChecked} 本書。",
				sections: {
					pending: "等待中（{0} 本）",
					checking: "檢查中（{0} 本）",
					latest: "最新（{0} 本）",
					outdated: "有更新（{0} 本）",
					preview: "預覽（{0} 本）",
					preOrder: "預購（{0} 本）",
					skipped: "已略過（{0} 本）",
					failed: "檢查失敗（{0} 本）"
				}
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
					not_succeeded: "檔案下載失敗。"
				}
			}
		}
	};
	var loadLocale = (locale) => {
		if (loadedLocales[locale]) return;
		loadedLocales[locale] = localeTranslations[locale];
		loadFormatters(locale);
	};
	var loadFormatters = (locale) => void (loadedFormatters[locale] = initFormatters(locale));
	var locale = detectLocale(ye);
	loadLocale(locale);
	var LL = i18nObject$1(locale);
	var compat_module_exports = __exportAll({
		Children: () => L,
		Component: () => preact.Component,
		Fragment: () => preact.Fragment,
		PureComponent: () => M,
		StrictMode: () => preact.Fragment,
		Suspense: () => P,
		SuspenseList: () => B,
		__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: () => an,
		cloneElement: () => mn,
		createContext: () => preact.createContext,
		createElement: () => preact.createElement,
		createFactory: () => sn,
		createPortal: () => $,
		createRef: () => preact.createRef,
		default: () => gn,
		findDOMNode: () => yn,
		flushSync: () => bn,
		forwardRef: () => D,
		hydrate: () => tn,
		isElement: () => Sn,
		isFragment: () => vn,
		isMemo: () => dn,
		isValidElement: () => hn,
		lazy: () => z,
		memo: () => N,
		render: () => nn,
		startTransition: () => x,
		unmountComponentAtNode: () => pn,
		unstable_batchedUpdates: () => _n,
		useDeferredValue: () => w,
		useInsertionEffect: () => I,
		useSyncExternalStore: () => C,
		useTransition: () => k,
		version: () => cn
	});
	__reExport(compat_module_exports, preact_hooks);
	function g(n, t) {
		for (var e in t) n[e] = t[e];
		return n;
	}
	function E(n, t) {
		for (var e in n) if ("__source" !== e && !(e in t)) return !0;
		for (var r in t) if ("__source" !== r && n[r] !== t[r]) return !0;
		return !1;
	}
	function C(n, t) {
		var e = t(), r = (0, preact_hooks.useState)({ t: {
			__: e,
			u: t
		} }), u = r[0].t, o = r[1];
		return (0, preact_hooks.useLayoutEffect)(function() {
			u.__ = e, u.u = t, R(u) && o({ t: u });
		}, [
			n,
			e,
			t
		]), (0, preact_hooks.useEffect)(function() {
			return R(u) && o({ t: u }), n(function() {
				R(u) && o({ t: u });
			});
		}, [n]), e;
	}
	function R(n) {
		try {
			return !((t = n.__) === (e = n.u()) && (0 !== t || 1 / t == 1 / e) || t != t && e != e);
		} catch (n) {
			return !0;
		}
		var t, e;
	}
	function x(n) {
		n();
	}
	function w(n) {
		return n;
	}
	function k() {
		return [!1, x];
	}
	var I = preact_hooks.useLayoutEffect;
	function M(n, t) {
		this.props = n, this.context = t;
	}
	function N(n, e) {
		function r(n) {
			var t = this.props.ref;
			return t != n.ref && t && ("function" == typeof t ? t(null) : t.current = null), e ? !e(this.props, n) || t != n.ref : E(this.props, n);
		}
		function u(e) {
			return this.shouldComponentUpdate = r, (0, preact.createElement)(n, e);
		}
		return u.displayName = "Memo(" + (n.displayName || n.name) + ")", u.__f = u.prototype.isReactComponent = !0, u.type = n, u;
	}
	(M.prototype = new preact.Component()).isPureReactComponent = !0, M.prototype.shouldComponentUpdate = function(n, t) {
		return E(this.props, n) || E(this.state, t);
	};
	var T = preact.options.__b;
	preact.options.__b = function(n) {
		n.type && n.type.__f && n.ref && (n.props.ref = n.ref, n.ref = null), T && T(n);
	};
	var A = "undefined" != typeof Symbol && Symbol.for && Symbol.for("react.forward_ref") || 3911;
	function D(n) {
		function t(t) {
			var e = g({}, t);
			return delete e.ref, n(e, t.ref || null);
		}
		return t.$$typeof = A, t.render = n, t.prototype.isReactComponent = t.__f = !0, t.displayName = "ForwardRef(" + (n.displayName || n.name) + ")", t;
	}
	var F = function(n, t) {
		return null == n ? null : (0, preact.toChildArray)((0, preact.toChildArray)(n).map(t));
	};
	var L = {
		map: F,
		forEach: F,
		count: function(n) {
			return n ? (0, preact.toChildArray)(n).length : 0;
		},
		only: function(n) {
			var t = (0, preact.toChildArray)(n);
			if (1 !== t.length) throw "Children.only";
			return t[0];
		},
		toArray: preact.toChildArray
	};
	var O = preact.options.__e;
	preact.options.__e = function(n, t, e, r) {
		if (n.then) {
			for (var u, o = t; o = o.__;) if ((u = o.__c) && u.__c) return t.__e ?? (t.__e = e.__e, t.__k = e.__k || []), u.__c(n, t);
		}
		O(n, t, e, r);
	};
	var U = preact.options.unmount;
	function V(n, t, e) {
		return n && (n.__c && n.__c.__H && (n.__c.__H.__.forEach(function(n) {
			"function" == typeof n.__c && n.__c();
		}), n.__c.__H = null), null != (n = g({}, n)).__c && (n.__c.__P === e && (n.__c.__P = t), n.__c.__e = !0, n.__c = null), n.__k = n.__k && n.__k.map(function(n) {
			return V(n, t, e);
		})), n;
	}
	function W(n, t, e) {
		return n && e && (n.__v = null, n.__k = n.__k && n.__k.map(function(n) {
			return W(n, t, e);
		}), n.__c && n.__c.__P === t && (n.__e && e.appendChild(n.__e), n.__c.__e = !0, n.__c.__P = e)), n;
	}
	function P() {
		this.__u = 0, this.o = null, this.__b = null;
	}
	function j(n) {
		var t = n.__ && n.__.__c;
		return t && t.__a && t.__a(n);
	}
	function z(n) {
		var e, r, u, o = null;
		function i(i) {
			if (e || (e = n()).then(function(n) {
				n && (o = n.default || n), u = !0;
			}, function(n) {
				r = n, u = !0;
			}), r) throw r;
			if (!u) throw e;
			return o ? (0, preact.createElement)(o, i) : null;
		}
		return i.displayName = "Lazy", i.__f = !0, i;
	}
	function B() {
		this.i = null, this.l = null;
	}
	preact.options.unmount = function(n) {
		var t = n.__c;
		t && (t.__z = !0), t && t.__R && t.__R(), t && 32 & n.__u && (n.type = null), U && U(n);
	}, (P.prototype = new preact.Component()).__c = function(n, t) {
		var e = t.__c, r = this;
		r.o ??= [], r.o.push(e);
		var u = j(r.__v), o = !1, i = function() {
			o || r.__z || (o = !0, e.__R = null, u ? u(f) : f());
		};
		e.__R = i;
		var l = e.__P;
		e.__P = null;
		var f = function() {
			if (!--r.__u) {
				if (r.state.__a) {
					var n = r.state.__a;
					r.__v.__k[0] = W(n, n.__c.__P, n.__c.__O);
				}
				var t;
				for (r.setState({ __a: r.__b = null }); t = r.o.pop();) t.__P = l, t.forceUpdate();
			}
		};
		r.__u++ || 32 & t.__u || r.setState({ __a: r.__b = r.__v.__k[0] }), n.then(i, i);
	}, P.prototype.componentWillUnmount = function() {
		this.o = [];
	}, P.prototype.render = function(n, e) {
		if (this.__b) {
			if (this.__v.__k) {
				var r = document.createElement("div"), o = this.__v.__k[0].__c;
				this.__v.__k[0] = V(this.__b, r, o.__O = o.__P);
			}
			this.__b = null;
		}
		var i = e.__a && (0, preact.createElement)(preact.Fragment, null, n.fallback);
		return i && (i.__u &= -33), [(0, preact.createElement)(preact.Fragment, null, e.__a ? null : n.children), i];
	};
	var H = function(n, t, e) {
		if (++e[1] === e[0] && n.l.delete(t), n.props.revealOrder && ("t" !== n.props.revealOrder[0] || !n.l.size)) for (e = n.i; e;) {
			for (; e.length > 3;) e.pop()();
			if (e[1] < e[0]) break;
			n.i = e = e[2];
		}
	};
	function Z(n) {
		return this.getChildContext = function() {
			return n.context;
		}, n.children;
	}
	function Y(n) {
		var e = this, r = n.h;
		if (e.componentWillUnmount = function() {
			(0, preact.render)(null, e.v), e.v = null, e.h = null;
		}, e.h && e.h !== r && e.componentWillUnmount(), !e.v) {
			for (var u = e.__v; null !== u && !u.__m && null !== u.__;) u = u.__;
			e.h = r, e.v = {
				nodeType: 1,
				parentNode: r,
				childNodes: [],
				__k: { __m: u.__m },
				contains: function() {
					return !0;
				},
				namespaceURI: r.namespaceURI,
				insertBefore: function(n, t) {
					this.childNodes.push(n), e.h.insertBefore(n, t);
				},
				removeChild: function(n) {
					this.childNodes.splice(this.childNodes.indexOf(n) >>> 1, 1), e.h.removeChild(n);
				}
			};
		}
		(0, preact.render)((0, preact.createElement)(Z, { context: e.context }, n.__v), e.v);
	}
	function $(n, e) {
		var r = (0, preact.createElement)(Y, {
			__v: n,
			h: e
		});
		return r.containerInfo = e, r;
	}
	(B.prototype = new preact.Component()).__a = function(n) {
		var t = this, e = j(t.__v), r = t.l.get(n);
		return r[0]++, function(u) {
			var o = function() {
				t.props.revealOrder ? (r.push(u), H(t, n, r)) : u();
			};
			e ? e(o) : o();
		};
	}, B.prototype.render = function(n) {
		this.i = null, this.l = new Map();
		var t = (0, preact.toChildArray)(n.children);
		n.revealOrder && "b" === n.revealOrder[0] && t.reverse();
		for (var e = t.length; e--;) this.l.set(t[e], this.i = [
			1,
			0,
			this.i
		]);
		return n.children;
	}, B.prototype.componentDidUpdate = B.prototype.componentDidMount = function() {
		var n = this;
		this.l.forEach(function(t, e) {
			H(n, e, t);
		});
	};
	var q = "undefined" != typeof Symbol && Symbol.for && Symbol.for("react.element") || 60103;
	var G = /^(?:accent|alignment|arabic|baseline|cap|clip(?!PathU)|color|dominant|fill|flood|font|glyph(?!R)|horiz|image(!S)|letter|lighting|marker(?!H|W|U)|overline|paint|pointer|shape|stop|strikethrough|stroke|text(?!L)|transform|underline|unicode|units|v|vector|vert|word|writing|x(?!C))[A-Z]/;
	var J = /^on(Ani|Tra|Tou|BeforeInp|Compo)/;
	var K = /[A-Z0-9]/g;
	var Q = "undefined" != typeof document;
	var X = function(n) {
		return ("undefined" != typeof Symbol && "symbol" == typeof Symbol() ? /fil|che|rad/ : /fil|che|ra/).test(n);
	};
	function nn(n, t, e) {
		return t.__k ?? (t.textContent = ""), (0, preact.render)(n, t), "function" == typeof e && e(), n ? n.__c : null;
	}
	function tn(n, t, e) {
		return (0, preact.hydrate)(n, t), "function" == typeof e && e(), n ? n.__c : null;
	}
	preact.Component.prototype.isReactComponent = !0, [
		"componentWillMount",
		"componentWillReceiveProps",
		"componentWillUpdate"
	].forEach(function(t) {
		Object.defineProperty(preact.Component.prototype, t, {
			configurable: !0,
			get: function() {
				return this["UNSAFE_" + t];
			},
			set: function(n) {
				Object.defineProperty(this, t, {
					configurable: !0,
					writable: !0,
					value: n
				});
			}
		});
	});
	var en = preact.options.event;
	preact.options.event = function(n) {
		return en && (n = en(n)), n.persist = function() {}, n.isPropagationStopped = function() {
			return this.cancelBubble;
		}, n.isDefaultPrevented = function() {
			return this.defaultPrevented;
		}, n.nativeEvent = n;
	};
	var rn;
	var un = {
		configurable: !0,
		get: function() {
			return this.class;
		}
	};
	var on = preact.options.vnode;
	preact.options.vnode = function(n) {
		"string" == typeof n.type && function(n) {
			var t = n.props, e = n.type, u = {}, o = -1 == e.indexOf("-");
			for (var i in t) {
				var l = t[i];
				if (!("value" === i && "defaultValue" in t && null == l || Q && "children" === i && "noscript" === e || "class" === i || "className" === i)) {
					var f = i.toLowerCase();
					"defaultValue" === i && "value" in t && null == t.value ? i = "value" : "download" === i && !0 === l ? l = "" : "translate" === f && "no" === l ? l = !1 : "o" === f[0] && "n" === f[1] ? "ondoubleclick" === f ? i = "ondblclick" : "onchange" !== f || "input" !== e && "textarea" !== e || X(t.type) ? "onfocus" === f ? i = "onfocusin" : "onblur" === f ? i = "onfocusout" : J.test(i) && (i = f) : f = i = "oninput" : o && G.test(i) ? i = i.replace(K, "-$&").toLowerCase() : null === l && (l = void 0), "oninput" === f && u[i = f] && (i = "oninputCapture"), u[i] = l;
				}
			}
			"select" == e && (u.multiple && Array.isArray(u.value) && (u.value = (0, preact.toChildArray)(t.children).forEach(function(n) {
				n.props.selected = -1 != u.value.indexOf(n.props.value);
			})), null != u.defaultValue && (u.value = (0, preact.toChildArray)(t.children).forEach(function(n) {
				n.props.selected = u.multiple ? -1 != u.defaultValue.indexOf(n.props.value) : u.defaultValue == n.props.value;
			}))), t.class && !t.className ? (u.class = t.class, Object.defineProperty(u, "className", un)) : t.className && (u.class = u.className = t.className), n.props = u;
		}(n), n.$$typeof = q, on && on(n);
	};
	var ln = preact.options.__r;
	preact.options.__r = function(n) {
		ln && ln(n), rn = n.__c;
	};
	var fn = preact.options.diffed;
	preact.options.diffed = function(n) {
		fn && fn(n);
		var t = n.props, e = n.__e;
		null != e && "textarea" === n.type && "value" in t && t.value !== e.value && (e.value = null == t.value ? "" : t.value), rn = null;
	};
	var an = { ReactCurrentDispatcher: { current: {
		readContext: function(n) {
			return rn.__n[n.__c].props.value;
		},
		useCallback: preact_hooks.useCallback,
		useContext: preact_hooks.useContext,
		useDebugValue: preact_hooks.useDebugValue,
		useDeferredValue: w,
		useEffect: preact_hooks.useEffect,
		useId: preact_hooks.useId,
		useImperativeHandle: preact_hooks.useImperativeHandle,
		useInsertionEffect: I,
		useLayoutEffect: preact_hooks.useLayoutEffect,
		useMemo: preact_hooks.useMemo,
		useReducer: preact_hooks.useReducer,
		useRef: preact_hooks.useRef,
		useState: preact_hooks.useState,
		useSyncExternalStore: C,
		useTransition: k
	} } };
	var cn = "18.3.1";
	function sn(n) {
		return preact.createElement.bind(null, n);
	}
	function hn(n) {
		return !!n && n.$$typeof === q;
	}
	function vn(n) {
		return hn(n) && n.type === preact.Fragment;
	}
	function dn(n) {
		return !!n && "string" == typeof n.displayName && 0 == n.displayName.indexOf("Memo(");
	}
	function mn(n) {
		return hn(n) ? preact.cloneElement.apply(null, arguments) : n;
	}
	function pn(n) {
		return !!n.__k && ((0, preact.render)(null, n), !0);
	}
	function yn(n) {
		return n && (n.base || 1 === n.nodeType && n) || null;
	}
	var _n = function(n, t) {
		return n(t);
	};
	var bn = function(n, t) {
		var r, u = preact.options.debounceRendering;
		preact.options.debounceRendering = function(n) {
			r = n;
		};
		try {
			var o = n(t);
			return r && r(), o;
		} finally {
			preact.options.debounceRendering = u;
		}
	};
	var Sn = hn;
	var gn = {
		useState: preact_hooks.useState,
		useId: preact_hooks.useId,
		useReducer: preact_hooks.useReducer,
		useEffect: preact_hooks.useEffect,
		useLayoutEffect: preact_hooks.useLayoutEffect,
		useInsertionEffect: I,
		useTransition: k,
		useDeferredValue: w,
		useSyncExternalStore: C,
		startTransition: x,
		useRef: preact_hooks.useRef,
		useImperativeHandle: preact_hooks.useImperativeHandle,
		useMemo: preact_hooks.useMemo,
		useCallback: preact_hooks.useCallback,
		useContext: preact_hooks.useContext,
		useDebugValue: preact_hooks.useDebugValue,
		version: "18.3.1",
		Children: L,
		render: nn,
		hydrate: tn,
		unmountComponentAtNode: pn,
		createPortal: $,
		createElement: preact.createElement,
		createContext: preact.createContext,
		createFactory: sn,
		cloneElement: mn,
		createRef: preact.createRef,
		Fragment: preact.Fragment,
		isValidElement: hn,
		isElement: Sn,
		isFragment: vn,
		isMemo: dn,
		findDOMNode: yn,
		Component: preact.Component,
		PureComponent: M,
		memo: N,
		forwardRef: D,
		flushSync: bn,
		unstable_batchedUpdates: _n,
		StrictMode: preact.Fragment,
		Suspense: P,
		SuspenseList: B,
		lazy: z,
		__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: an
	};
	var states$1 = {
		isChecking: false,
		checkScope: null,
		totalBooks: 0,
		checkedBooks: 0
	};
	var listeners$4 = new Set();
	function subscribe$4(listener) {
		listeners$4.add(listener);
		return () => listeners$4.delete(listener);
	}
	function getSnapshot$4() {
		return states$1;
	}
	function emit$4() {
		for (const listener of listeners$4) listener();
	}
	function useCheckStates() {
		return C(subscribe$4, getSnapshot$4);
	}
	function setCheckScope(checkScope, totalBooks = 0) {
		states$1 = {
			isChecking: true,
			checkScope,
			totalBooks,
			checkedBooks: 0
		};
		emit$4();
	}
	function incrementTotalBooks(amount) {
		states$1 = {
			...states$1,
			totalBooks: states$1.totalBooks + amount
		};
		emit$4();
	}
	function incrementCheckedBooks() {
		states$1 = {
			...states$1,
			checkedBooks: states$1.checkedBooks + 1
		};
		emit$4();
	}
	function resetCheckStates() {
		states$1 = {
			isChecking: false,
			checkScope: null,
			totalBooks: 0,
			checkedBooks: 0
		};
		emit$4();
	}
	function jsonStringifyReplacer(_, value) {
		if (typeof value === "bigint") return value.toString();
		return value;
	}
	var Cached = class {
		constructor(getter) {
			this._getter = getter;
			this._value = void 0;
		}
		get value() {
			const getter = this._getter;
			if (getter !== void 0) {
				this._value = getter();
				this._getter = void 0;
			}
			return this._value;
		}
	};
	function cached(getter) {
		return new Cached(getter);
	}
	function assignProp(target, prop, value) {
		Object.defineProperty(target, prop, {
			value,
			writable: true,
			enumerable: true,
			configurable: true
		});
	}
	var captureStackTrace = "captureStackTrace" in Error ? Error.captureStackTrace : (..._args) => {};
	function isObject(data) {
		return typeof data === "object" && data !== null && !Array.isArray(data);
	}
	function clone(inst, def, params) {
		const cl = new inst._zod.constr(def ?? inst._zod.def);
		if (!def || params?.parent) cl._zod.parent = inst;
		return cl;
	}
	function normalizeParams(_params) {
		const params = _params;
		if (!params) return {};
		if (typeof params === "string") return { error: () => params };
		if (params?.message !== void 0) {
			if (params?.error !== void 0) throw new Error("Cannot specify both `message` and `error` params");
			params.error = params.message;
		}
		delete params.message;
		if (typeof params.error === "string") return {
			...params,
			error: () => params.error
		};
		return params;
	}
	function optionalKeys(shape) {
		return Object.keys(shape).filter((k) => {
			return shape[k]._zod.optin !== void 0 && shape[k]._zod.optout === "optional";
		});
	}
	function aborted(x, startIndex = 0) {
		if (x.aborted === true) return true;
		for (let i = startIndex; i < x.issues.length; i++) if (x.issues[i]?.continue !== true) return true;
		return false;
	}
	function explicitlyAborted(x, startIndex = 0) {
		if (x.aborted === true) return true;
		for (let i = startIndex; i < x.issues.length; i++) if (x.issues[i]?.continue === false) return true;
		return false;
	}
	function prefixIssues(path, issues) {
		return issues.map((iss) => {
			var _a;
			(_a = iss).path ?? (_a.path = []);
			iss.path.unshift(path);
			return iss;
		});
	}
	function unwrapMessage(message) {
		return typeof message === "string" ? message : message?.message;
	}
	function attachSchema(issues, start, inst) {
		var _a;
		for (let i = start; i < issues.length; i++) (_a = issues[i]).schema ?? (_a.schema = inst);
	}
	function finalizeIssue(iss, ctx, config) {
		var _a;
		const traits = iss.inst?._zod?.traits;
		if (traits?.has("$ZodType")) {
			if (traits.has("$ZodCheck")) (_a = iss).schema ?? (_a.schema = iss.inst);
			else iss.schema = iss.inst;
		}
		const schemaError = iss.schema !== iss.inst ? iss.schema?._zod.def?.error : void 0;
		const message = iss.message ? iss.message : unwrapMessage(iss.inst?._zod.def?.error?.(iss)) ?? unwrapMessage(schemaError?.(iss)) ?? unwrapMessage(ctx?.error?.(iss)) ?? unwrapMessage(config.customError?.(iss)) ?? unwrapMessage(config.localeError?.(iss)) ?? "Invalid input";
		const full = {};
		for (const k of Object.keys(iss)) {
			if (k === "inst" || k === "schema" || k === "continue" || k === "input" || k === "__proto__") continue;
			full[k] = iss[k];
		}
		full.path ?? (full.path = []);
		full.message = message;
		if (ctx?.reportInput) full.input = iss.input;
		return full;
	}
	function members(proto, table) {
		for (const key in table) {
			const desc = Object.getOwnPropertyDescriptor(table, key);
			if (desc.get) Object.defineProperty(proto, key, {
				...desc,
				enumerable: false
			});
			else defineBound(proto, key, desc.value);
		}
	}
	function own(inst, key, value, enumerable = true) {
		Object.defineProperty(inst, key, {
			configurable: true,
			writable: true,
			enumerable,
			value
		});
		return value;
	}
	function hide(inst, key, value) {
		return own(inst, key, value, false);
	}
	function defineBound(proto, key, fn) {
		Object.defineProperty(proto, key, {
			configurable: true,
			get() {
				return this == null ? fn : own(this, key, fn.bind(this));
			},
			set(value) {
				own(this, key, value);
			}
		});
	}
	function claim(inst, sentinel) {
		const proto = Object.getPrototypeOf(inst);
		return sentinel in proto ? void 0 : proto;
	}
	var installing;
	var broke = false;
	var breaker = {
		configurable: true,
		get() {
			broke = true;
		}
	};
	function defineLazyInternal(inst, key, compute) {
		const proto = Object.getPrototypeOf(inst._zod);
		if (key in proto && installing !== inst._zod) {
			installing = void 0;
			return;
		}
		installing = inst._zod;
		Object.defineProperty(proto, key, {
			configurable: true,
			get() {
				Object.defineProperty(this, key, breaker);
				const outer = broke;
				broke = false;
				try {
					const value = compute(this);
					if (broke) delete this[key];
					else Object.defineProperty(this, key, {
						configurable: true,
						writable: true,
						value
					});
					broke = broke || outer;
					return value;
				} catch (err) {
					delete this[key];
					broke = broke || outer;
					throw err;
				}
			},
			set(value) {
				Object.defineProperty(this, key, {
					configurable: true,
					writable: true,
					value
				});
			}
		});
	}
	function installLazyProp(inst, key, make, enumerable) {
		const proto = claim(inst, key);
		if (!proto) return;
		Object.defineProperty(proto, key, {
			configurable: true,
			get() {
				const desc = {
					configurable: true,
					writable: true,
					enumerable,
					value: void 0
				};
				Object.defineProperty(this, key, desc);
				desc.value = make(this);
				Object.defineProperty(this, key, desc);
				return desc.value;
			},
			set(value) {
				Object.defineProperty(this, key, {
					configurable: true,
					writable: true,
					enumerable,
					value
				});
			}
		});
	}
	var _a;
	var _zodDesc = {
		value: void 0,
		enumerable: false
	};
	var _E = "captureStackTrace" in Error ? Error : null;
	function newError(Definition) {
		const E = _E;
		if (E) {
			const saved = E.stackTraceLimit;
			if (typeof saved === "number") {
				try {
					E.stackTraceLimit = 0;
				} catch {
					_E = null;
					return new Definition();
				}
				try {
					return new Definition();
				} finally {
					E.stackTraceLimit = saved;
				}
			}
		}
		return new Definition();
	}
	function $constructor(name, initializer, proto, params) {
		const zodProto = {};
		function Internals(def) {
			this.def = def;
			this.constr = _;
			this.traits = new Set();
		}
		Internals.prototype = zodProto;
		const protoMembers = proto;
		const initialized = protoMembers && new WeakSet();
		function init(inst, def) {
			if (!inst._zod) {
				_zodDesc.value = new Internals(def);
				try {
					Object.defineProperty(inst, "_zod", _zodDesc);
				} finally {
					_zodDesc.value = void 0;
				}
			} else if (inst._zod.traits.has(name)) return;
			inst._zod.traits.add(name);
			initializer(inst, def);
			if (initialized) {
				const own = Object.getPrototypeOf(inst);
				const ctorProto = inst._zod.constr.prototype;
				let up = own;
				while (up && up !== ctorProto) up = Object.getPrototypeOf(up);
				const target = up ?? own;
				if (!initialized.has(target)) {
					initialized.add(target);
					members(target, protoMembers);
				}
			}
			const proto = _.prototype;
			for (const k in proto) {
				if (!Object.prototype.hasOwnProperty.call(proto, k)) continue;
				if (!(k in inst)) inst[k] = proto[k].bind(inst);
			}
		}
		const Parent = params?.Parent ?? Object;
		class Definition extends Parent {}
		Object.defineProperty(Definition, "name", { value: name });
		function _(def) {
			const inst = params?.Parent ? newError(Definition) : this;
			init(inst, def);
			const deferred = inst._zod.deferred;
			if (deferred) {
				for (const fn of deferred) fn();
				inst._zod.deferred = void 0;
			}
			const pp = globalThis.__zod_globalConfig?.postProcessor;
			if (pp) pp(inst);
			return inst;
		}
		Object.defineProperty(_, "init", { value: init });
		Object.defineProperty(_, Symbol.hasInstance, { value: (inst) => {
			if (params?.Parent && inst instanceof params.Parent) return true;
			return inst?._zod?.traits?.has(name);
		} });
		Object.defineProperty(_, "name", { value: name });
		return _;
	}
	var $ZodAsyncError = class extends Error {
		constructor() {
			super(`Encountered Promise during synchronous parse. Use .parseAsync() instead.`);
		}
	};
	(_a = globalThis).__zod_globalConfig ?? (_a.__zod_globalConfig = {});
	var globalConfig = globalThis.__zod_globalConfig;
	function config(newConfig) {
		if (newConfig) Object.assign(globalConfig, newConfig);
		return globalConfig;
	}
	function _getMessage() {
		const internals = this._zod;
		internals.message ?? (internals.message = JSON.stringify(internals.def, jsonStringifyReplacer, 2));
		return internals.message;
	}
	function _setMessage(value) {
		this._zod.message = value;
	}
	var _messageDesc = {
		get: _getMessage,
		set: _setMessage,
		enumerable: true,
		configurable: true
	};
	var _issuesDesc = {
		value: void 0,
		enumerable: false
	};
	var _installedToString = new WeakSet([Object.prototype, Error.prototype]);
	var initializer$1 = (inst, def) => {
		inst.name = "$ZodError";
		_issuesDesc.value = def;
		Object.defineProperty(inst, "issues", _issuesDesc);
		_issuesDesc.value = void 0;
		Object.defineProperty(inst, "message", _messageDesc);
		const proto = Object.getPrototypeOf(inst);
		if (!_installedToString.has(proto)) {
			_installedToString.add(proto);
			Object.defineProperty(proto, "toString", {
				configurable: true,
				enumerable: false,
				get() {
					const value = () => this.message;
					Object.defineProperty(this, "toString", {
						value,
						configurable: true,
						writable: true
					});
					return value;
				},
				set(value) {
					Object.defineProperty(this, "toString", {
						value,
						configurable: true,
						writable: true
					});
				}
			});
		}
	};
	var $ZodError = $constructor("$ZodError", initializer$1);
	var $ZodRealError = $constructor("$ZodError", initializer$1, void 0, { Parent: Error });
	function node(obj, key, make) {
		if (!Object.prototype.hasOwnProperty.call(obj, key)) {
			if (key === "__proto__") Object.defineProperty(obj, key, {
				value: make(),
				writable: true,
				enumerable: true,
				configurable: true
			});
			else obj[key] = make();
		}
		return obj[key];
	}
	function flattenError(error, mapper = (issue) => issue.message) {
		const fieldErrors = {};
		const formErrors = [];
		for (const sub of error.issues) if (sub.path.length > 0) node(fieldErrors, sub.path[0], () => []).push(mapper(sub));
		else formErrors.push(mapper(sub));
		return {
			formErrors,
			fieldErrors
		};
	}
	function formatError(error, mapper = (issue) => issue.message) {
		const fieldErrors = { _errors: [] };
		const processError = (error, path = []) => {
			for (const issue of error.issues) if (issue.code === "invalid_union" && issue.errors.length) issue.errors.map((issues) => processError({ issues }, [...path, ...issue.path]));
			else if (issue.code === "invalid_key") processError({ issues: issue.issues }, [...path, ...issue.path]);
			else if (issue.code === "invalid_element") processError({ issues: issue.issues }, [...path, ...issue.path]);
			else {
				const fullpath = [...path, ...issue.path];
				if (fullpath.length === 0) fieldErrors._errors.push(mapper(issue));
				else {
					let curr = fieldErrors;
					let i = 0;
					while (i < fullpath.length) {
						const el = fullpath[i];
						const terminal = i === fullpath.length - 1;
						if (el === "_errors") {
							if (terminal) curr._errors.push(mapper(issue));
							i++;
							continue;
						}
						if (!Object.prototype.hasOwnProperty.call(curr, el)) Object.defineProperty(curr, el, {
							value: { _errors: [] },
							enumerable: true,
							writable: true,
							configurable: true
						});
						const node = curr[el];
						if (terminal) node._errors.push(mapper(issue));
						curr = node;
						i++;
					}
				}
			}
		};
		processError(error);
		return fieldErrors;
	}
	var _parse = (_Err) => {
		const fn = (schema, value, _ctx, _params) => {
			const ctx = _ctx ? {
				..._ctx,
				async: false
			} : { async: false };
			const result = schema._zod.run({
				value,
				issues: []
			}, ctx);
			if (result instanceof Promise) throw new $ZodAsyncError();
			if (result.issues.length) {
				const e = new ((_params?.Err) ?? _Err)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())));
				captureStackTrace(e, _params?.callee ?? fn);
				throw e;
			}
			return result.value;
		};
		return fn;
	};
	var parse = _parse($ZodRealError);
	var _parseAsync = (_Err) => {
		const fn = async (schema, value, _ctx, params) => {
			const ctx = _ctx ? {
				..._ctx,
				async: true
			} : { async: true };
			let result = schema._zod.run({
				value,
				issues: []
			}, ctx);
			if (result instanceof Promise) result = await result;
			if (result.issues.length) {
				const e = new ((params?.Err) ?? _Err)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())));
				captureStackTrace(e, params?.callee ?? fn);
				throw e;
			}
			return result.value;
		};
		return fn;
	};
	var parseAsync = _parseAsync($ZodRealError);
	var _safeParse = (_Err) => (schema, value, _ctx) => {
		const ctx = _ctx ? {
			..._ctx,
			async: false
		} : { async: false };
		const result = schema._zod.run({
			value,
			issues: []
		}, ctx);
		if (result instanceof Promise) throw new $ZodAsyncError();
		return result.issues.length ? failure(_Err, result.issues, ctx) : {
			success: true,
			data: result.value
		};
	};
	var safeParse = _safeParse($ZodRealError);
	function failure(Err, issues, ctx) {
		let error;
		return {
			success: false,
			get error() {
				if (!error) {
					error = new Err(issues.map((iss) => finalizeIssue(iss, ctx, config())));
					issues = void 0;
					ctx = void 0;
				}
				return error;
			},
			set error(e) {
				error = e;
				issues = void 0;
				ctx = void 0;
			}
		};
	}
	var _safeParseAsync = (_Err) => async (schema, value, _ctx) => {
		const ctx = _ctx ? {
			..._ctx,
			async: true
		} : { async: true };
		let result = schema._zod.run({
			value,
			issues: []
		}, ctx);
		if (result instanceof Promise) result = await result;
		return result.issues.length ? failure(_Err, result.issues, ctx) : {
			success: true,
			data: result.value
		};
	};
	var safeParseAsync = _safeParseAsync($ZodRealError);
	var uuid$1 = (version) => {
		if (!version) return /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/;
		return new RegExp(`^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-${version}[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})$`);
	};
	var anyString = /^[\s\S]{0,}$/;
	var $ZodCheck = $constructor("$ZodCheck", (inst, def) => {
		var _a;
		inst._zod ?? (inst._zod = {});
		inst._zod.def = def;
		(_a = inst._zod).onattach ?? (_a.onattach = []);
	});
	var $ZodCheckStringFormat = $constructor("$ZodCheckStringFormat", (inst, def) => {
		var _a, _b;
		$ZodCheck.init(inst, def);
		if (def.pattern) (_a = inst._zod).check ?? (_a.check = (payload) => {
			def.pattern.lastIndex = 0;
			if (def.pattern.test(payload.value)) return;
			payload.issues.push({
				origin: "string",
				code: "invalid_format",
				format: def.format,
				input: payload.value,
				...def.pattern ? { pattern: def.pattern.toString() } : {},
				inst,
				continue: !def.abort
			});
		});
		else (_b = inst._zod).check ?? (_b.check = () => {});
	});
	var version = {
		major: 4,
		minor: 6,
		patch: 5
	};
	var $ZodType = $constructor("$ZodType", (inst, def) => {
		var _a;
		inst ?? (inst = {});
		inst._zod.def = def;
		inst._zod.bag = inst._zod.bag || {};
		inst._zod.version = version;
		const defChecks = inst._zod.def.checks;
		const checks = inst._zod.traits.has("$ZodCheck") ? [inst, ...defChecks ?? []] : defChecks?.length ? [...defChecks] : [];
		for (const ch of checks) for (const fn of ch._zod.onattach) fn(inst);
		if (checks.length === 0) {
			(_a = inst._zod).deferred ?? (_a.deferred = []);
			inst._zod.deferred?.push(() => {
				inst._zod.run = inst._zod.parse;
			});
		} else {
			const runChecks = (payload, checks, ctx) => {
				if (payload.memo) return payload;
				let isAborted = aborted(payload);
				let asyncResult;
				for (const ch of checks) {
					if (ch._zod.def.when) {
						if (explicitlyAborted(payload)) continue;
						if (!ch._zod.def.when(payload)) continue;
					} else if (isAborted) continue;
					const currLen = payload.issues.length;
					const _ = ch._zod.check(payload);
					if (_ instanceof Promise && ctx?.async === false) throw new $ZodAsyncError();
					if (asyncResult || _ instanceof Promise) asyncResult = (asyncResult ?? Promise.resolve()).then(async () => {
						await _;
						if (payload.issues.length === currLen) return;
						attachSchema(payload.issues, currLen, inst);
						if (!isAborted) isAborted = aborted(payload, currLen);
					});
					else {
						if (payload.issues.length === currLen) continue;
						attachSchema(payload.issues, currLen, inst);
						if (!isAborted) isAborted = aborted(payload, currLen);
					}
				}
				if (asyncResult) return asyncResult.then(() => {
					return payload;
				});
				return payload;
			};
			const handleCanaryResult = (canary, payload, ctx) => {
				if (aborted(canary)) {
					canary.aborted = true;
					return canary;
				}
				const checkResult = runChecks(payload, checks, ctx);
				if (checkResult instanceof Promise) {
					if (ctx.async === false) throw new $ZodAsyncError();
					return checkResult.then((checkResult) => inst._zod.parse(checkResult, ctx));
				}
				return inst._zod.parse(checkResult, ctx);
			};
			inst._zod.run = (payload, ctx) => {
				if (ctx.skipChecks) return inst._zod.parse(payload, ctx);
				if (ctx.direction === "backward") {
					const canary = inst._zod.parse({
						value: payload.value,
						issues: []
					}, {
						...ctx,
						skipChecks: true
					});
					if (canary instanceof Promise) return canary.then((canary) => {
						return handleCanaryResult(canary, payload, ctx);
					});
					return handleCanaryResult(canary, payload, ctx);
				}
				const result = inst._zod.parse(payload, ctx);
				if (result instanceof Promise) {
					if (ctx.async === false) throw new $ZodAsyncError();
					return result.then((result) => runChecks(result, checks, ctx));
				}
				return runChecks(result, checks, ctx);
			};
		}
	}, {
		get "~standard"() {
			return hide(this, "~standard", standardProps(this));
		},
		set "~standard"(value) {
			own(this, "~standard", value);
		}
	});
	var toStandardResult = (r, ctx) => r.issues.length ? { issues: r.issues.map((iss) => finalizeIssue(iss, ctx, config())) } : { value: r.value };
	async function validateAsync(inst, value) {
		const ctx = { async: true };
		return toStandardResult(await inst._zod.run({
			value,
			issues: []
		}, ctx), ctx);
	}
	function standardProps(inst) {
		return {
			validate: (value) => {
				const ctx = { async: false };
				try {
					const r = inst._zod.run({
						value,
						issues: []
					}, ctx);
					if (!(r instanceof Promise)) return toStandardResult(r, ctx);
				} catch (_) {}
				return validateAsync(inst, value);
			},
			vendor: "zod",
			version: 1
		};
	}
	var $ZodString = $constructor("$ZodString", (inst, def) => {
		$ZodType.init(inst, def);
		inst._zod.pattern = def.pattern ?? anyString;
		inst._zod.parse = (payload, _) => {
			if (def.coerce) try {
				payload.value = String(payload.value);
			} catch (_) {}
			if (typeof payload.value === "string") return payload;
			payload.issues.push({
				expected: "string",
				code: "invalid_type",
				input: payload.value,
				inst
			});
			return payload;
		};
	});
	var $ZodStringFormat = $constructor("$ZodStringFormat", (inst, def) => {
		$ZodCheckStringFormat.init(inst, def);
		$ZodString.init(inst, def);
	});
	var $ZodUUID = $constructor("$ZodUUID", (inst, def) => {
		if (def.version) {
			const v = {
				v1: 1,
				v2: 2,
				v3: 3,
				v4: 4,
				v5: 5,
				v6: 6,
				v7: 7,
				v8: 8
			}[def.version];
			if (v === void 0) throw new Error(`Invalid UUID version: "${def.version}"`);
			def.pattern ?? (def.pattern = uuid$1(v));
		} else def.pattern ?? (def.pattern = uuid$1());
		$ZodStringFormat.init(inst, def);
	});
	function handlePropertyResult(result, final, key, input, optin, optout) {
		const isPresent = key in input;
		const isOptionalOut = optout === "optional";
		if (!isPresent && isOptionalOut && optin === "optional") return;
		if (result.issues.length) {
			if (optin !== void 0 && isOptionalOut && !isPresent) return;
			final.issues.push(...prefixIssues(key, result.issues));
		}
		if (!isPresent && optin === void 0) {
			if (!result.issues.length) final.issues.push({
				code: "invalid_type",
				expected: "nonoptional",
				input: void 0,
				path: [key]
			});
			return;
		}
		if (result.value === void 0) {
			if (isPresent || optin === "defaulted" && !isOptionalOut) final.value[key] = void 0;
		} else final.value[key] = result.value;
	}
	var NO_SYMBOL_KEYS = [];
	function normalizeDef(def) {
		const keys = Object.keys(def.shape);
		const ownSymbols = Object.getOwnPropertySymbols(def.shape);
		const symbolKeys = ownSymbols.length ? ownSymbols : NO_SYMBOL_KEYS;
		const allKeys = symbolKeys.length ? [...keys, ...symbolKeys] : keys;
		for (const k of allKeys) if (!def.shape?.[k]?._zod?.traits?.has("$ZodType")) throw new Error(`Invalid element at key "${String(k)}": expected a Zod schema`);
		const okeys = optionalKeys(def.shape);
		return {
			...def,
			allKeys,
			symbolKeys,
			keySet: new Set(keys),
			numKeys: keys.length,
			optionalKeys: new Set(okeys)
		};
	}
	function handleCatchall(proms, input, payload, ctx, def, inst, abortEarly) {
		const unrecognized = [];
		const keySet = def.keySet;
		const _catchall = def.catchall._zod;
		const t = _catchall.def.type;
		const optin = _catchall.optin;
		const optout = _catchall.optout;
		let seen = 0;
		for (const key in input) {
			if (abortEarly && payload.issues.length !== seen) {
				if (aborted(payload, seen)) break;
				seen = payload.issues.length;
			}
			if (keySet.has(key)) continue;
			if (key === "__proto__") {
				if (t === "never") unrecognized.push(key);
				continue;
			}
			if (t === "never") {
				unrecognized.push(key);
				continue;
			}
			const r = _catchall.run({
				value: input[key],
				issues: []
			}, ctx);
			if (r instanceof Promise) proms.push(r.then((r) => handlePropertyResult(r, payload, key, input, optin, optout)));
			else handlePropertyResult(r, payload, key, input, optin, optout);
		}
		if (unrecognized.length) payload.issues.push({
			code: "unrecognized_keys",
			keys: unrecognized,
			input,
			inst,
			continue: true
		});
		if (!proms.length) return payload;
		return Promise.all(proms).then(() => {
			return payload;
		});
	}
	var $ZodObject = $constructor("$ZodObject", (inst, def) => {
		$ZodType.init(inst, def);
		const desc = Object.getOwnPropertyDescriptor(def, "shape");
		const sh = desc?.get ? desc.get.raw : def.shape ?? {};
		if (sh) {
			const get = () => {
				const newSh = { ...sh };
				Object.defineProperty(def, "shape", { value: newSh });
				get.raw = newSh;
				return newSh;
			};
			get.raw = sh;
			Object.defineProperty(def, "shape", { get });
		}
		const _normalized = cached(() => normalizeDef(def));
		defineLazyInternal(inst, "propValues", (zod) => {
			const shape = zod.def.shape;
			const propValues = {};
			for (const key in shape) {
				const field = shape[key]._zod;
				if (field.values) {
					if (!Object.prototype.hasOwnProperty.call(propValues, key)) assignProp(propValues, key, new Set());
					for (const v of field.values) propValues[key].add(v);
					if (field.optin !== void 0) propValues[key].add(void 0);
				}
			}
			return propValues;
		});
		const isObject$2 = isObject;
		const catchall = def.catchall;
		let value;
		const memo = globalConfig.memoizer;
		memo?.attach(inst);
		inst._zod.parse = (payload, ctx) => {
			value ?? (value = _normalized.value);
			const input = payload.value;
			if (!isObject$2(input)) {
				payload.issues.push({
					expected: "object",
					code: "invalid_type",
					input,
					inst
				});
				return payload;
			}
			payload.value = memo ? memo.alloc(inst, payload, {}, ctx) : {};
			const proms = [];
			const shape = value.shape;
			const abortEarly = ctx?.abortEarly;
			let seen = payload.issues.length;
			for (const key of value.allKeys) {
				if (abortEarly && payload.issues.length !== seen) {
					if (aborted(payload, seen)) break;
					seen = payload.issues.length;
				}
				if (key === "__proto__") continue;
				const el = shape[key];
				const optin = el._zod.optin;
				const optout = el._zod.optout;
				const r = el._zod.run({
					value: input[key],
					issues: []
				}, ctx);
				if (r instanceof Promise) proms.push(r.then((r) => handlePropertyResult(r, payload, key, input, optin, optout)));
				else handlePropertyResult(r, payload, key, input, optin, optout);
			}
			if (!catchall) return proms.length ? Promise.all(proms).then(() => payload) : payload;
			return handleCatchall(proms, input, payload, ctx, _normalized.value, inst, abortEarly === true);
		};
	});
	function snapshotChecks(def) {
		if (def.checks) def.checks = [...def.checks];
		return def;
	}
	function _string(Class, params) {
		return new Class(snapshotChecks({
			type: "string",
			...normalizeParams(params)
		}));
	}
	function _uuid(Class, params) {
		return new Class({
			type: "string",
			format: "uuid",
			check: "string_format",
			abort: false,
			...normalizeParams(params)
		});
	}
	var _installedErrorProtos = new WeakSet([Object.prototype, Error.prototype]);
	function _lazyMethod(proto, key, make) {
		Object.defineProperty(proto, key, {
			configurable: true,
			enumerable: false,
			get() {
				const value = make(this);
				Object.defineProperty(this, key, {
					value,
					configurable: true,
					writable: true
				});
				return value;
			},
			set(value) {
				Object.defineProperty(this, key, {
					value,
					configurable: true,
					writable: true
				});
			}
		});
	}
	var initializer = (inst, issues) => {
		$ZodError.init(inst, issues);
		inst.name = "ZodError";
		const proto = Object.getPrototypeOf(inst);
		if (_installedErrorProtos.has(proto)) return;
		_installedErrorProtos.add(proto);
		_lazyMethod(proto, "format", (self) => (mapper) => formatError(self, mapper));
		_lazyMethod(proto, "flatten", (self) => (mapper) => flattenError(self, mapper));
		_lazyMethod(proto, "addIssue", (self) => (issue) => {
			self.issues.push(issue);
			self.message = JSON.stringify(self.issues, jsonStringifyReplacer, 2);
		});
		_lazyMethod(proto, "addIssues", (self) => (issues) => {
			self.issues.push(...issues);
			self.message = JSON.stringify(self.issues, jsonStringifyReplacer, 2);
		});
		Object.defineProperty(proto, "isEmpty", {
			configurable: true,
			enumerable: false,
			get() {
				return this.issues.length === 0;
			}
		});
	};
	var ZodError = $constructor("ZodError", initializer);
	var ZodMiniType = $constructor("ZodMiniType", (inst, def) => {
		if (!inst._zod) throw new Error("Uninitialized schema in ZodMiniType.");
		$ZodType.init(inst, def);
		inst.def = def;
		inst.type = def.type;
	}, {
		get with() {
			return this.check;
		},
		set with(value) {
			own(this, "with", value);
		},
		parse(data, params) {
			return parse(this, data, params, { callee: this.parse });
		},
		parseAsync(data, params) {
			return parseAsync(this, data, params, { callee: this.parseAsync });
		},
		safeParse(data, params) {
			return safeParse(this, data, params);
		},
		safeParseAsync(data, params) {
			return safeParseAsync(this, data, params);
		},
		check(...checks) {
			const def = this.def;
			return this.clone({
				...def,
				checks: [...def.checks ?? [], ...checks.map((ch) => typeof ch === "function" ? { _zod: {
					check: ch,
					def: { check: "custom" },
					onattach: []
				} } : ch)]
			}, { parent: true });
		},
		clone(_def, params) {
			return clone(this, _def, params);
		},
		brand() {
			return this;
		},
		register(reg, meta) {
			reg.add(this, meta);
			return this;
		},
		apply(fn, ...args) {
			return args.length === 0 ? fn(this) : fn(this, ...args);
		}
	});
	var ZodMiniString = $constructor("ZodMiniString", (inst, def) => {
		$ZodString.init(inst, def);
		ZodMiniType.init(inst, def);
	});
	function string(params) {
		return _string(ZodMiniString, params);
	}
	var ZodMiniStringFormat = $constructor("ZodMiniStringFormat", (inst, def) => {
		$ZodStringFormat.init(inst, def);
		ZodMiniString.init(inst, def);
	});
	var ZodMiniUUID = $constructor("ZodMiniUUID", (inst, def) => {
		$ZodUUID.init(inst, def);
		ZodMiniStringFormat.init(inst, def);
	});
	function uuid(params) {
		return _uuid(ZodMiniUUID, params);
	}
	var ZodMiniObject = $constructor("ZodMiniObject", (inst, def) => {
		$ZodObject.init(inst, def);
		ZodMiniType.init(inst, def);
		installLazyProp(inst, "shape", (self) => self._zod.def.shape, false);
	});
	function object(shape, params) {
		return new ZodMiniObject({
			type: "object",
			shape: shape ?? {},
			...normalizeParams(params)
		});
	}
	var NetworkError = class extends Error {};
	var ParsingError = class extends Error {
		constructor(message, options) {
			super(message ?? "Error occurred during parsing.", options);
		}
	};
	var UnlistedError = class extends Error {
		constructor(title) {
			super(title ? `This book was unlisted from the store: ${title}` : "The book was unlisted from the store.");
		}
	};
	var LIBRARY_BOOKS = ".item-wrapper.book";
	var BOOK_ACTIONS_LIST = ".library-actions-list";
	var COVER_IMAGE = "img.cover-image";
	var LIBRARY_PAGINATION = ".pagination";
	var LIBRARY_FIRST_PAGE = `${LIBRARY_PAGINATION} .page-link.first`;
	var LIBRARY_NEXT_PAGE = `${LIBRARY_PAGINATION} .next`;
	var LIBRARY_LAST_PAGE = `${LIBRARY_PAGINATION} .page-link.final`;
	var TrackInfo = object({
		productId: uuid(),
		title: string()
	});
	var GizmoConfig = object({
		id: uuid(),
		productId: uuid(),
		title: string(),
		author: string(),
		imageUrl: string()
	});
	function getBookFromElement(element) {
		const isPreOrder = isPreOrderBook(element);
		if (isPreOrder) try {
			if (!(element instanceof HTMLElement)) throw new ParsingError("Invalid item wrapper element.");
			const info = TrackInfo.parse(JSON.parse(element.dataset.trackInfo ?? "{}"));
			const storeUrl = getStoreUrl(element);
			return {
				...info,
				id: info.productId,
				author: "",
				storeUrl,
				isPreOrder,
				isPreview: false
			};
		} catch (error) {
			if (error instanceof SyntaxError || error instanceof ZodError) throw new ParsingError("Malformed track info", { cause: error });
			throw error;
		}
		const action = element.querySelector(".library-action:is(.mark-as-finished, .remove-from-library, .remove-from-archive)");
		if (!(action instanceof HTMLElement)) throw new ParsingError("Library action element not found.");
		try {
			const { imageUrl, ...book } = GizmoConfig.parse(JSON.parse(action.dataset.koboGizmoConfig ?? "{}"));
			const storeUrl = getStoreUrl(element, imageUrl);
			return {
				...book,
				storeUrl,
				isPreOrder,
				isPreview: isPreviewBook(element)
			};
		} catch (error) {
			if (error instanceof SyntaxError || error instanceof ZodError) throw new ParsingError("Malformed Kobo Gizmo config", { cause: error });
			throw error;
		}
	}
	function isPreOrderBook(element) {
		return element.classList.contains("pre-order");
	}
	function isPreviewBook(element) {
		return element instanceof HTMLElement && element.dataset.koboGizmo === "PreviewLibraryItem";
	}
	function isAudiobook(element) {
		return (element.querySelector(".image-container .product-type-icon")?.childElementCount ?? 0) > 0;
	}
	function getStoreUrl(element, imageUrl) {
		const titleUrl = element.querySelector(".product-field.title a")?.href;
		if (titleUrl?.startsWith("https://www.kobo.com/")) return titleUrl;
		if (!imageUrl) {
			const coverImage = element.querySelector(COVER_IMAGE);
			if (!(coverImage instanceof HTMLElement)) throw new ParsingError("imageUrl must be provided when cover image element does not found.");
			imageUrl = coverImage.src;
		}
		return `${location.href.substring(0, location.href.indexOf("/library"))}/${isAudiobook(element) ? "audiobook" : "ebook"}/${imageUrl.substring(imageUrl.lastIndexOf("/") + 1, imageUrl.lastIndexOf("."))}`;
	}
	function getBooksFromDocument(document = window.document) {
		return Array.from(document.querySelectorAll(LIBRARY_BOOKS)).map(getBookFromElement);
	}
	function getElementByBook(book) {
		const { id } = book;
		return document.querySelector(`${LIBRARY_BOOKS}[data-track-info*="${CSS.escape(id)}"]`);
	}
	function getPageFromDocument(document = window.document) {
		const first = document.querySelector(LIBRARY_FIRST_PAGE);
		const last = document.querySelector(LIBRARY_LAST_PAGE);
		const next = document.querySelector(LIBRARY_NEXT_PAGE);
		if (!(first instanceof HTMLAnchorElement) || !(last instanceof HTMLElement) || !next) throw new ParsingError("Failed to parse the document");
		return {
			total: Number.parseInt(last.innerText),
			first: first.href,
			next: next instanceof HTMLAnchorElement ? next.href : null,
			document
		};
	}
	async function fetchPageFromUrl(url, signal) {
		const response = await fetch(url, {
			signal,
			credentials: "same-origin"
		});
		if (!response.ok) throw new NetworkError(response.statusText);
		const html = await response.text();
		return getPageFromDocument(new DOMParser().parseFromString(html, "text/html"));
	}
	var has = Object.prototype.hasOwnProperty;
	var QueueEvent = class extends Event {
		constructor(name, detail) {
			super(name);
			this.detail = detail;
		}
	};
	var Queue = class extends EventTarget {
		constructor(options = {}) {
			super();
			const { concurrency = Infinity, timeout = 0, autostart = false, results = null } = options;
			this.concurrency = concurrency;
			this.timeout = timeout;
			this.autostart = autostart;
			this.results = results;
			this.pending = 0;
			this.session = 0;
			this.running = false;
			this.jobs = [];
			this.timers = [];
			this.addEventListener("error", this._errorHandler);
		}
		_errorHandler(evt) {
			this.end(evt.detail.error);
		}
		pop() {
			return this.jobs.pop();
		}
		shift() {
			return this.jobs.shift();
		}
		indexOf(searchElement, fromIndex) {
			return this.jobs.indexOf(searchElement, fromIndex);
		}
		lastIndexOf(searchElement, fromIndex) {
			if (fromIndex !== void 0) return this.jobs.lastIndexOf(searchElement, fromIndex);
			return this.jobs.lastIndexOf(searchElement);
		}
		slice(start, end) {
			this.jobs = this.jobs.slice(start, end);
			return this;
		}
		reverse() {
			this.jobs.reverse();
			return this;
		}
		push(...workers) {
			const methodResult = this.jobs.push(...workers);
			if (this.autostart) this._start();
			return methodResult;
		}
		unshift(...workers) {
			const methodResult = this.jobs.unshift(...workers);
			if (this.autostart) this._start();
			return methodResult;
		}
		splice(start, deleteCount, ...workers) {
			this.jobs.splice(start, deleteCount, ...workers);
			if (this.autostart) this._start();
			return this;
		}
		get length() {
			return this.pending + this.jobs.length;
		}
		start(callback) {
			if (this.running) throw new Error("already started");
			let awaiter;
			if (callback) this._addCallbackToEndEvent(callback);
			else awaiter = this._createPromiseToEndEvent();
			this._start();
			return awaiter;
		}
		_start() {
			this.running = true;
			if (this.pending >= this.concurrency) return;
			if (this.jobs.length === 0) {
				if (this.pending === 0) this.done();
				return;
			}
			const job = this.jobs.shift();
			const session = this.session;
			const timeout = job !== void 0 && has.call(job, "timeout") ? job.timeout : this.timeout;
			let once = true;
			let timeoutId = null;
			let didTimeout = false;
			let resultIndex = null;
			const next = (error, ...result) => {
				if (once && this.session === session) {
					once = false;
					this.pending--;
					if (timeoutId !== null) {
						this.timers = this.timers.filter((tID) => tID !== timeoutId);
						clearTimeout(timeoutId);
					}
					if (error) this.dispatchEvent(new QueueEvent("error", {
						error,
						job
					}));
					else if (!didTimeout) {
						if (resultIndex !== null && this.results !== null) this.results[resultIndex] = [...result];
						this.dispatchEvent(new QueueEvent("success", {
							result: [...result],
							job
						}));
					}
					if (this.session === session) {
						if (this.pending === 0 && this.jobs.length === 0) this.done();
						else if (this.running) this._start();
					}
				}
			};
			if (timeout) {
				timeoutId = setTimeout(() => {
					didTimeout = true;
					this.dispatchEvent(new QueueEvent("timeout", {
						next,
						job
					}));
					next();
				}, timeout);
				this.timers.push(timeoutId);
			}
			if (this.results != null) {
				resultIndex = this.results.length;
				this.results[resultIndex] = null;
			}
			this.pending++;
			this.dispatchEvent(new QueueEvent("start", { job }));
			job.promise = job(next);
			if (job.promise !== void 0 && typeof job.promise.then === "function") job.promise.then(function(result) {
				return next(void 0, result);
			}).catch(function(err) {
				return next(err || true);
			});
			if (this.running && this.jobs.length > 0) this._start();
		}
		stop() {
			this.running = false;
		}
		end(error) {
			this.clearTimers();
			this.jobs.length = 0;
			this.pending = 0;
			this.done(error);
		}
		clearTimers() {
			this.timers.forEach((timer) => {
				clearTimeout(timer);
			});
			this.timers = [];
		}
		_addCallbackToEndEvent(cb) {
			const onend = (evt) => {
				this.removeEventListener("end", onend);
				cb(evt.detail.error, this.results);
			};
			this.addEventListener("end", onend);
		}
		_createPromiseToEndEvent() {
			return new Promise((resolve, reject) => {
				this._addCallbackToEndEvent((error, results) => {
					if (error) reject(error);
					else resolve(results);
				});
			});
		}
		done(error) {
			this.session++;
			this.running = false;
			this.dispatchEvent(new QueueEvent("end", { error }));
		}
	};
	var statuses = new Map();
	var listeners$3 = new Set();
	function subscribe$3(listener) {
		listeners$3.add(listener);
		return () => listeners$3.delete(listener);
	}
	function getSnapshot$3() {
		return statuses;
	}
	function emit$3() {
		for (const listener of listeners$3) listener();
	}
	function useBookStatuses() {
		return C(subscribe$3, getSnapshot$3);
	}
	function getBookStatusById(id) {
		return statuses.get(id) ?? { type: "pending" };
	}
	function setBookStatusById(id, status) {
		statuses = new Map(statuses);
		statuses.set(id, status);
		emit$3();
	}
	var modals = [];
	var listeners$2 = new Set();
	function subscribe$2(listener) {
		listeners$2.add(listener);
		return () => listeners$2.delete(listener);
	}
	function getSnapshot$2() {
		return modals;
	}
	function emit$2() {
		for (const listener of listeners$2) listener();
	}
	function openModal(init) {
		const id = init.id ?? crypto.randomUUID();
		const title = init.title ?? LL.modals.titles.message();
		const dismissible = init.dismissible ?? true;
		const actions = init.actions ?? null;
		modals = [...modals, {
			...init,
			id,
			title,
			dismissible,
			actions
		}], emit$2();
		return id;
	}
	function closeModal(id) {
		let closingModals;
		if (!id) {
			closingModals = modals.slice(-1);
			modals = modals.slice(0, -1);
		} else {
			closingModals = modals.filter((modal) => modal.id === id);
			modals = modals.filter((modal) => modal.id !== id);
		}
		closingModals.forEach((modal) => modal.onClose?.());
		emit$2();
	}
	function useModals() {
		return C(subscribe$2, getSnapshot$2);
	}
	var item_status_module_default = {
		outdated: "_outdated_kltd7_1",
		skipped: "_skipped_kltd7_5",
		failed: "_failed_kltd7_9"
	};
	var f = 0;
	Array.isArray;
	function u(e, t, n, o, i, u) {
		t || (t = {});
		var a, c, p = t;
		if ("ref" in p) for (c in p = {}, t) "ref" == c ? a = t[c] : p[c] = t[c];
		var l = {
			type: e,
			props: p,
			key: n,
			ref: a,
			__k: null,
			__: null,
			__b: 0,
			__e: null,
			__c: null,
			constructor: void 0,
			__v: --f,
			__i: -1,
			__u: 0,
			__source: i,
			__self: u
		};
		if ("function" == typeof e && (a = e.defaultProps)) for (c in a) void 0 === p[c] && (p[c] = a[c]);
		return preact.options.vnode && preact.options.vnode(l), l;
	}
	var containersCache = new WeakSet();
	function ItemStatus(props) {
		const { book } = props;
		const { type, message, error } = useBookStatuses().get(book.id) ?? { type: "pending" };
		if (type !== "failed") return u("span", {
			class: (0, clsx.clsx)(item_status_module_default[type]),
			children: LL.status[type]()
		});
		function openMessageModal() {
			const id = openModal({
				content: u("p", { children: message }),
				actions: u("button", {
					onClick: () => closeModal(id),
					children: LL.modals.actions.gotIt()
				})
			});
		}
		return u("a", {
			class: (0, clsx.clsx)(item_status_module_default[type]),
			onClick: openMessageModal,
			children: LL.status[type]()
		});
	}
	function setupItemStatus(book) {
		const element = getElementByBook(book);
		if (!element) throw new Error("Unable to find the element for the book");
		const container = element.querySelector(".item-status");
		if (!container) throw new Error("Unable to find the element for item status");
		if (!containersCache.has(container)) {
			containersCache.add(container);
			container.classList.remove("buy-now");
			container.replaceChildren();
		}
		(0, preact.render)(u(ItemStatus, { book }), container);
	}
	var NEXT_PUSH_PATTERN = /self\.__next_f\.push\(\s*\[\s*1\s*,\s*("(?:\\.|[^"\\])*")\s*\]\s*\)/g;
	var GizmoConfigOrItemDetails = object({
		productId: uuid(),
		productType: string()
	});
	async function fetchProductFromUrl(url, signal) {
		const response = await fetch(url, {
			signal,
			credentials: "omit"
		});
		if (!response.ok) {
			if (response.status === 404) throw new UnlistedError();
			throw new NetworkError(response.statusText);
		}
		const html = await response.text();
		return getProductFromDocument(new DOMParser().parseFromString(html, "text/html"));
	}
	function getProductFromDocument(document) {
		const detail = document.querySelector(".item-detail");
		if (detail instanceof HTMLElement) try {
			const { productId, productType } = GizmoConfigOrItemDetails.parse(JSON.parse(detail.dataset.koboGizmoConfig));
			return {
				productId,
				productType
			};
		} catch (error) {
			if (error instanceof SyntaxError || error instanceof ZodError) throw new ParsingError("Malformed Kobo Gizmo config", { cause: error });
			throw error;
		}
		const chunks = [];
		for (const script of document.scripts) for (const match of script.textContent.matchAll(NEXT_PUSH_PATTERN)) chunks.push(JSON.parse(match[1]));
		for (const row of chunks.join("").split("\n")) {
			const separatorIndex = row.indexOf(":");
			if (separatorIndex < 1) continue;
			try {
				const itemDetails = findItemDetails(JSON.parse(row.slice(separatorIndex + 1)));
				if (itemDetails) {
					const { productId, productType } = GizmoConfigOrItemDetails.parse(itemDetails);
					return {
						productId,
						productType
					};
				}
			} catch (error) {
				if (error instanceof SyntaxError) continue;
				if (error instanceof ZodError) throw new ParsingError("Malformed item details received from hydrated data", { cause: error });
			}
		}
		throw new ParsingError("Product details not found.");
	}
	function findItemDetails(value) {
		if (!value || typeof value !== "object") return null;
		if (Reflect.has(value, "itemDetails")) {
			const itemDetails = Reflect.get(value, "itemDetails");
			if (!itemDetails || typeof itemDetails !== "object") return null;
			return itemDetails;
		}
		for (const child of Object.values(value)) {
			const result = findItemDetails(child);
			if (result) return result;
		}
		return null;
	}
	var CACHED_STATUSES = new Set([
		"latest",
		"outdated",
		"preview",
		"preOrder"
	]);
	var queue = new Queue({ concurrency: 5 });
	async function checkUpdate(book, signal) {
		const status = getBookStatusById(book.id);
		if (CACHED_STATUSES.has(status.type)) {
			incrementCheckedBooks();
			return;
		}
		if (book.isPreOrder || book.isPreview) {
			setBookStatusById(book.id, { type: book.isPreOrder ? "preOrder" : "preview" });
			incrementCheckedBooks();
			return;
		}
		setBookStatusById(book.id, { type: "checking" });
		try {
			if ((await fetchProductFromUrl(book.storeUrl, signal)).productId === book.productId) setBookStatusById(book.id, { type: "latest" });
			else setBookStatusById(book.id, { type: "outdated" });
		} catch (error) {
			if (error instanceof UnlistedError) setBookStatusById(book.id, {
				type: "failed",
				message: LL.error.unlisted()
			});
			else if (error instanceof ParsingError) setBookStatusById(book.id, {
				type: "failed",
				message: LL.error.parsing(),
				error: String(error.cause)
			});
			else if (error instanceof NetworkError) setBookStatusById(book.id, {
				type: "failed",
				message: LL.error.unknown(),
				error: String(error.message)
			});
			else if (error instanceof DOMException && error.name === "AbortError") setBookStatusById(book.id, { type: "skipped" });
			else {
				console.error(error);
				setBookStatusById(book.id, {
					type: "failed",
					message: LL.error.unknown(),
					error: String(error)
				});
			}
		} finally {
			incrementCheckedBooks();
		}
	}
	function runBatchCheck(books, scope, signal) {
		if (books.length === 0) return Promise.resolve(new Map());
		setCheckScope(scope, books.length);
		if (scope === "page") books.forEach(setupItemStatus);
		for (const book of books) queue.push(async () => checkUpdate(book, signal));
		const promise = new Promise((resolve) => {
			queue.addEventListener("end", () => {
				resolve(books.reduce((groups, book) => {
					const status = getBookStatusById(book.id).type;
					const statusBooks = groups.get(status) ?? [];
					statusBooks.push(book);
					groups.set(status, statusBooks);
					return groups;
				}, new Map()));
				resetCheckStates();
			}, { once: true });
		});
		queue.start();
		return promise;
	}
	var progress_module_default = {
		progress: "_progress_by2as_1",
		indeterminate: "_indeterminate_by2as_21",
		"no-transition": "_no-transition_by2as_26"
	};
	function Progress(props) {
		const { class: classNames, value, max = 1, style = {}, children, ...others } = props;
		const isIndeterminate = typeof value !== "number";
		const progress = isIndeterminate ? 0 : clamp(value, 0, max);
		return u("div", {
			...others,
			class: (0, clsx.default)(progress_module_default.progress, isIndeterminate && progress_module_default.indeterminate, classNames),
			role: "progressbar",
			"aria-valuenow": isIndeterminate ? void 0 : progress,
			"aria-valuemin": 0,
			"aria-valuemax": max,
			style: {
				...style,
				"--progress": isIndeterminate ? null : `${(progress / max * 100).toFixed(2)}%`
			},
			children
		});
	}
	var _GM = (() => typeof GM != "undefined" ? GM : void 0)();
	function exportReport(options) {
		const timestamp = Date.now();
		const report = `<!DOCTYPE html>${(0, preact_render_to_string.renderToString)(u(Report, {
			timestamp,
			...options
		}))}`;
		const reportUrl = URL.createObjectURL(new Blob([report], { type: "text/html" }));
		_GM.download({
			name: `Kobo Update Report ${timestamp}.html`,
			url: reportUrl,
			saveAs: true,
			onload: () => URL.revokeObjectURL(reportUrl),
			onerror: async ({ error, details }) => {
				const tab = await _GM.openInTab(reportUrl, { active: true });
				tab.onclose = () => URL.revokeObjectURL(reportUrl);
				const id = openModal({
					title: LL.modals.titles.error(),
					content: u(preact.Fragment, { children: [u("p", { children: [LL.error.download[error](), details && LL.modals.contents.downloadErrorDetails(details)] }), u("p", { children: LL.modals.contents.reportOpenedInTab() })] }),
					actions: u("button", {
						onClick: () => closeModal(id),
						children: LL.modals.actions.gotIt()
					})
				});
			}
		});
	}
	var REPORT_ORDER = [
		"latest",
		"outdated",
		"preview",
		"preOrder",
		"skipped",
		"failed"
	];
	function Report(props) {
		const { timestamp, totalChecked, results } = props;
		return u("html", {
			lang: locale,
			children: [u("head", { children: [u("title", { children: LL.report.title() }), u("meta", { charset: "utf-8" })] }), u("body", { children: [
				u("h1", { children: LL.report.title() }),
				u("p", { children: LL.report.summary({
					timestamp,
					totalChecked
				}) }),
				REPORT_ORDER.map((status) => {
					const books = results.get(status);
					if (!books || books.length === 0) return null;
					return u(preact.Fragment, { children: [u("h2", { children: LL.report.sections[status](books.length) }), u("ul", { children: books.map((book) => u("li", { children: book.title })) })] });
				})
			] })]
		});
	}
	var controller = new AbortController();
	var listeners$1 = new Set();
	function subscribe$1(listener) {
		listeners$1.add(listener);
		return () => listeners$1.delete(listener);
	}
	function getSnapshot$1() {
		return controller;
	}
	function emit$1() {
		for (const listener of listeners$1) listener();
	}
	function useAbortController() {
		return C(subscribe$1, getSnapshot$1);
	}
	function setAbortController(nextController) {
		controller = nextController;
		emit$1();
	}
	var states = {
		isFetched: false,
		totalPages: 0,
		fetchedPages: 0,
		fetchedBooks: []
	};
	var listeners = new Set();
	function subscribe(listener) {
		listeners.add(listener);
		return () => listeners.delete(listener);
	}
	function getSnapshot() {
		return states;
	}
	function emit() {
		for (const listener of listeners) listener();
	}
	function useFetchStates() {
		return C(subscribe, getSnapshot);
	}
	function setTotalPages(totalPages) {
		states = {
			...states,
			totalPages
		};
		emit();
	}
	function incrementFetchedPages() {
		states = {
			...states,
			fetchedPages: states.fetchedPages + 1
		};
		if (states.fetchedPages === states.totalPages) states.isFetched = true;
		emit();
	}
	function getFetchedBooks() {
		return states.fetchedBooks;
	}
	function pushFetchedBooks(books) {
		states = {
			...states,
			fetchedBooks: [...states.fetchedBooks, ...books]
		};
		emit();
	}
	function resetFetchStates() {
		states = {
			isFetched: false,
			totalPages: 0,
			fetchedPages: 0,
			fetchedBooks: []
		};
		emit();
	}
	var check_actions_module_default = {
		step: "_step_16esp_1",
		message: "_message_16esp_18",
		details: "_details_16esp_23"
	};
	var SUMMARY_ORDER = [
		"latest",
		"outdated",
		"preview",
		"preOrder",
		"skipped",
		"failed"
	];
	var COLLATOR = Intl.Collator(locale, { numeric: true });
	function LibraryCheckingProgress() {
		const fetchHeaderId = (0, preact_hooks.useId)();
		const checkHeaderId = (0, preact_hooks.useId)();
		const { isFetched, totalPages, fetchedPages } = useFetchStates();
		const { totalBooks, checkedBooks } = useCheckStates();
		return u(preact.Fragment, { children: [u("section", {
			class: check_actions_module_default.step,
			children: [
				u("h3", {
					id: fetchHeaderId,
					children: LL.modals.contents.fetchLibrary()
				}),
				u(Progress, {
					value: (totalPages || false) && fetchedPages,
					max: totalPages,
					style: {
						width: "100%",
						color: "#bf0000"
					},
					"aria-labelledby": fetchHeaderId
				}),
				u("p", { children: LL.modals.contents.fetchLibraryProgress({
					totalPages,
					fetchedPages
				}) })
			]
		}), u("section", {
			class: check_actions_module_default.step,
			children: [
				u("h3", {
					id: checkHeaderId,
					children: LL.modals.contents.checkUpdate()
				}),
				u(Progress, {
					value: isFetched && checkedBooks,
					max: totalBooks,
					style: {
						width: "100%",
						color: "#bf0000"
					},
					"aria-labelledby": checkHeaderId
				}),
				u("p", { children: LL.modals.contents.checkUpdateProgress({
					totalBooks,
					checkedBooks
				}) })
			]
		})] });
	}
	function useCheckActions() {
		const { isFetched } = useFetchStates();
		const { isChecking } = useCheckStates();
		const controller = useAbortController();
		function showResultModal(results, scope) {
			const totalChecked = Array.from(results).map(([_, books]) => books.length).reduce((a, b) => a + b);
			const id = openModal({
				title: LL.modals.titles.checkCompleted(),
				dismissible: false,
				content: u(preact.Fragment, { children: [u("p", {
					class: check_actions_module_default.message,
					children: scope === "page" ? LL.modals.contents.finishCheckingPage(totalChecked) : LL.modals.contents.finishCheckingLibrary(totalChecked)
				}), SUMMARY_ORDER.map((status) => {
					const books = results.get(status);
					if (!books || books.length === 0) return null;
					return u("details", {
						class: check_actions_module_default.details,
						children: [u("summary", { children: LL.modals.contents.statusSummaries[status](books.length) }), u("ul", { children: books.map((book) => u("li", { children: book.title })) })]
					});
				})] }),
				actions: u(preact.Fragment, { children: [u("button", {
					class: "primary",
					onClick: () => exportReport({
						results,
						totalChecked
					}),
					children: LL.modals.actions.saveReport()
				}), u("button", {
					onClick: () => closeModal(id),
					children: LL.modals.actions.gotIt()
				})] }),
				onClose: resetCheckStates
			});
		}
		async function checkSingleBook(book) {
			if (isChecking) return;
			setCheckScope("single", 1);
			setupItemStatus(book);
			await checkUpdate(book, controller.signal);
			resetCheckStates();
		}
		async function checkWholePage() {
			if (isChecking) return;
			const books = getBooksFromDocument();
			books.sort((a, b) => COLLATOR.compare(a.title, b.title));
			showResultModal(await runBatchCheck(books, "page", controller.signal), "page");
		}
		async function loadLibraryBooks() {
			resetFetchStates();
			try {
				let page = await fetchPageFromUrl(getPageFromDocument(document).first, controller.signal);
				setTotalPages(page.total);
				pushFetchedBooks(getBooksFromDocument(page.document));
				incrementFetchedPages();
				while (page.next !== null) {
					page = await fetchPageFromUrl(page.next, controller.signal);
					const books = getBooksFromDocument(page.document);
					pushFetchedBooks(books);
					incrementFetchedPages();
					incrementTotalBooks(books.length);
				}
			} catch (error) {
				if (!(error instanceof DOMException) || error.name !== "AbortError") throw error;
			}
		}
		async function checkWholeLibrary() {
			if (isChecking) return;
			if (!document.querySelector(".pagination")) return checkWholePage();
			if (!await new Promise((resolve) => {
				function onConfirm() {
					resolve(true);
					closeModal(id);
				}
				const id = openModal({
					title: LL.modals.titles.warning(),
					content: u("p", { children: LL.modals.contents.confirmCheckLibrary() }),
					actions: u(preact.Fragment, { children: [u("button", {
						class: "primary",
						onClick: onConfirm,
						children: LL.modals.actions.startChecking()
					}), u("button", {
						onClick: () => closeModal(id),
						children: LL.modals.actions.cancel()
					})] }),
					onClose: () => resolve(false)
				});
			})) return;
			setCheckScope("library");
			let bypassReloading = false;
			if (isFetched) bypassReloading = await new Promise((resolve) => {
				function onBypassClicked() {
					resolve(true);
					closeModal(id);
				}
				const id = openModal({
					title: LL.modals.titles.warning(),
					dismissible: false,
					content: u("p", { children: LL.modals.contents.confirmReloadLibrary() }),
					actions: u(preact.Fragment, { children: [u("button", {
						class: "primary",
						onClick: () => closeModal(id),
						children: LL.modals.actions.reloadLibrary()
					}), u("button", {
						onClick: onBypassClicked,
						children: LL.modals.actions.bypassReloading()
					})] }),
					onClose: () => resolve(false)
				});
			});
			const id = openModal({
				title: LL.modals.titles.checkingInProgress(),
				dismissible: false,
				content: u(LibraryCheckingProgress, {}),
				actions: u("button", {
					onClick: () => controller.abort(),
					children: LL.modals.actions.cancel()
				})
			});
			if (!bypassReloading) await loadLibraryBooks();
			const results = await runBatchCheck(getFetchedBooks().toSorted((a, b) => COLLATOR.compare(a.title, b.title)), "library", controller.signal);
			closeModal(id);
			setAbortController(new AbortController());
			showResultModal(results, "library");
		}
		return {
			checkSingleBook,
			checkWholePage,
			checkWholeLibrary
		};
	}
	var secondary_controls_module_default = {
		container: "_container_1p8xn_10",
		controls: "_controls_1p8xn_25"
	};
	function SecondaryControls() {
		const { isChecking, checkScope } = useCheckStates();
		const { checkWholePage, checkWholeLibrary } = useCheckActions();
		return u("div", {
			class: secondary_controls_module_default.controls,
			children: u("ul", { children: [u("li", { children: u("button", {
				class: secondary_controls_module_default.button,
				disabled: isChecking,
				onClick: () => checkWholePage(),
				children: isChecking && checkScope === "page" ? LL.secondaryControls.checkPageInProgress() : LL.secondaryControls.checkPage()
			}) }), u("li", { children: u("button", {
				disabled: isChecking,
				onClick: () => checkWholeLibrary(),
				children: LL.secondaryControls.checkLibrary()
			}) })] })
		});
	}
	function setupSecondaryControls() {
		const grid = document.querySelector(".secondary-controls");
		if (!grid) throw new Error("Unable to find the container for secondary controls");
		const container = document.createElement("div");
		container.classList.add(secondary_controls_module_default.container);
		grid.insertBefore(container, grid.querySelector(".sort-by-container"));
		(0, preact.render)(u(SecondaryControls, {}), container);
	}
	var library_action_module_default = { action: "_action_1lh30_1" };
	function LibraryActions({ book }) {
		const { isChecking } = useCheckStates();
		const { checkSingleBook } = useCheckActions();
		return u("li", {
			class: "library-actions-list-item",
			children: u("button", {
				class: (0, clsx.default)("library-action", library_action_module_default.action),
				disabled: isChecking,
				onClick: () => checkSingleBook(book),
				children: LL.libraryActions.checkUpdate()
			})
		});
	}
	function setupLibraryActions() {
		const elements = document.querySelectorAll(LIBRARY_BOOKS);
		for (const element of elements) {
			const book = getBookFromElement(element);
			const lists = element.querySelectorAll(BOOK_ACTIONS_LIST);
			if (lists.length === 0) {
				console.warn("Unable to find action lists for %o", element);
				continue;
			}
			for (const list of lists) {
				const container = document.createElement("div");
				list.append(container);
				(0, preact.render)(u(LibraryActions, { book }), container);
			}
		}
	}
	var modal_host_module_default = {
		dialog: "_dialog_1cuj5_6",
		close: "_close_1cuj5_35"
	};
	function Dialog(props) {
		const { modal, closeModal } = props;
		const ref = (0, compat_module_exports.useRef)(null);
		(0, compat_module_exports.useEffect)(() => {
			const dialog = ref.current;
			if (!dialog) return;
			if (!dialog.open) dialog.showModal();
			function onKeyDown(event) {
				if (event.key === "Escape" && dialog?.open && !modal.dismissible) event.preventDefault();
			}
			function onCancel(event) {
				event.preventDefault();
				if (modal.dismissible) closeModal(modal.id);
			}
			function onClose() {
				closeModal(modal.id);
			}
			dialog.addEventListener("keydown", onKeyDown);
			dialog.addEventListener("cancel", onCancel);
			dialog.addEventListener("close", onClose);
			return (() => {
				dialog.removeEventListener("keydown", onKeyDown);
				dialog.removeEventListener("cancel", onCancel);
				dialog.removeEventListener("close", onClose);
				if (dialog.open) dialog.close();
			});
		}, [
			modal.id,
			modal.dismissible,
			closeModal
		]);
		return u("dialog", {
			ref,
			class: modal_host_module_default.dialog,
			children: [
				modal.dismissible && u("button", {
					class: modal_host_module_default.close,
					onClick: () => closeModal(modal.id)
				}),
				u("header", { children: u("h2", { children: modal.title }) }),
				modal.content,
				modal.actions && u("footer", { children: modal.actions })
			]
		});
	}
	function ModalHost() {
		const modals = useModals();
		if (modals.length === 0) return null;
		return $(u(preact.Fragment, { children: modals.map((modal, i) => u(Dialog, {
			modal,
			index: i,
			closeModal
		}, modal.id)) }), setupOverlayContainer());
	}
	function Root() {
		return u(preact.Fragment, { children: u(ModalHost, {}) });
	}
	var rootContainer = null;
	function setupRootContainer() {
		if (rootContainer && document.body.contains(rootContainer)) return rootContainer;
		rootContainer = document.createElement("div");
		document.body.appendChild(rootContainer);
		return rootContainer;
	}
	var overlayContainer = null;
	function setupOverlayContainer() {
		if (overlayContainer && document.body.contains(overlayContainer)) return overlayContainer;
		overlayContainer = document.createElement("div");
		document.body.appendChild(overlayContainer);
		return overlayContainer;
	}
	var setupIslands = debounce(() => {
		setupSecondaryControls();
		setupLibraryActions();
	}, 200);
	function startObserver() {
		const observer = new MutationObserver(setupIslands);
		observer.observe(document.getElementById("library-grid"), { childList: true });
		return observer;
	}
	(0, preact.render)(u(Root, {}), setupRootContainer());
	setupIslands();
	startObserver();
})(preact, typesafeI18n, preactHooks, clsx, preactRenderToString);
