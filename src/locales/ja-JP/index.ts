import type { Translation } from "../i18n-types";

const ja_JP: Translation = {
	secondaryControls: {
		checkPage: "このページの更新を確認",
		checkPageInProgress: "更新を確認中……",
		checkLibrary: "ライブラリ全体の更新を確認",
		copyOutdated: "更新がある本をコピー",
	},
	libraryActions: {
		checkUpdate: "更新を確認",
	},
	status: {
		pending: "待機中……",
		checking: "確認中……",
		latest: "最新",
		outdated: "更新あり",
		preview: "プレビュー",
		skipped: "スキップ",
		failed: "失敗",
	},
	modals: {
		titles: {
			message: "メッセージ",
			warning: "警告",
			checkingInProgress: "確認中",
			checkCompleted: "確認完了",
		},
		contents: {
			confirmCheckLibrary: "ライブラリ全体の更新確認には時間がかかり、多数のリクエストが送信される場合があります。続行しますか？",
			confirmReloadLibrary: "既存のライブラリキャッシュが見つかりました。サーバーからライブラリを再読み込みしますか？以前に確認済みで、成功した結果の本は保持されます。",
			fetchLibrary: "ライブラリを取得",
			fetchLibraryProgress: "{fetchedPages}／{totalPages} ページ",
			checkUpdate: "更新を確認",
			checkUpdateProgress: "{checkedBooks}／{totalBooks} 冊",
			finishCheckingPage: "ページの確認が完了しました。合計 {0} 冊を確認しました。",
			finishCheckingLibrary: "ライブラリの確認が完了しました。合計 {0} 冊を確認しました。",
			statusSummaries: {
				// Unused, kept for typing purposes.
				pending: "待機中：{0} 冊",
				checking: "確認中：{0} 冊",

				latest: "最新：{0} 冊",
				outdated: "更新あり：{0} 冊",
				preview: "プレビュー：{0} 冊",
				skipped: "スキップ：{0} 冊",
				failed: "失敗：{0} 冊",
			},
		},
		actions: {
			startChecking: "確認を開始",
			reloadLibrary: "ライブラリを再読み込み",
			bypassReloading: "再読み込みをスキップ",
			saveReport: "レポートを保存",
			gotIt: "わかりました",
			cancel: "キャンセル",
		},
	},
	report: {
		title: "Kobo 電子書籍更新レポート",
		summary: "{timestamp|date} {timestamp|time} に作成されたレポートです。合計 {totalChecked} 冊を確認しました。",
		sections: {
			// Unused, kept for typing purposes.
			pending: "待機中（{0} 冊）",
			checking: "確認中（{0} 冊）",

			latest: "最新（{0} 冊）",
			outdated: "更新あり（{0} 冊）",
			preview: "プレビュー（{0} 冊）",
			skipped: "スキップ（{0} 冊）",
			failed: "失敗（{0} 冊）",
		},
	},
	error: {
		unlisted: "この本は販売終了のため、現時点ではこの種類の本の更新を確認できません。",
		parsing: "最新の商品IDを解析できませんでした。詳しい調査のため、開発者にお問い合わせください。",
		unknown: "不明なエラーです。詳しい調査のため、開発者にお問い合わせください。",
	},
};

export default ja_JP;
