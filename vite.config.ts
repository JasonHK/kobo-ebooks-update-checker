import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import monkey, { cdn } from "vite-plugin-monkey";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const preactVersion: string = require("preact/package.json").version;

function preactCdn(exportVarName: string, pathname: string): ReturnType<typeof cdn.unpkg>
{
    return [
        exportVarName,
        () => `https://unpkg.com/preact@${preactVersion}/${pathname}`,
    ];
}

export default defineConfig(
    {
        plugins: [
            preact(),
            monkey(
                {
                    entry: "src/index.tsx",
                    userscript: {
                        "name": {
                            "": "Kobo e-Books Update Checker",
                            "ja": "Kobo 電子書籍更新チェッカー",
                            "zh-TW": "Kobo 電子書更新檢查器",
                        },
                        "description": {
                            "": "Checks if updates were available for the e-books you own.",
                            "ja": "所有している電子書籍に更新があるかを確認します。",
                            "zh-TW": "檢查你購買的電子書是否有更新檔提供。",
                        },
                        "icon": "https://icons.duckduckgo.com/ip3/www.kobo.com.ico",
                        "namespace": "https://jasonhk.dev/",
                        "match": [
                            "https://www.kobo.com/*/*/library/books",
                            "https://www.kobo.com/*/*/library/books?*",
                            "https://www.kobo.com/*/*/library/Books",
                            "https://www.kobo.com/*/*/library/Books?*",
                            "https://www.kobo.com/*/*/library/archive",
                            "https://www.kobo.com/*/*/library/archive?*",
                        ],
                        "run-at": "document-end",
                    },
                    build: {
                        metaFileName: true,
                        externalGlobals: {
                            "clsx": cdn.unpkg("clsx", "dist/clsx.min.js"),
                            "preact": cdn.unpkg("preact", "dist/preact.min.umd.js"),
                            "preact/hooks": preactCdn("preactHooks", "hooks/dist/hooks.umd.js"),
                            // "preact/hooks": cdn.unpkg("preactHooks", "hooks/dist/hooks.umd.js"),
                            "preact-render-to-string": cdn.unpkg("preactRenderToString", "dist/index.umd.js"),
                            "typesafe-i18n": cdn.unpkg("typesafeI18n", "dist/i18n.all.min.js"),
                        },
                    },
                }),
        ],
    });
