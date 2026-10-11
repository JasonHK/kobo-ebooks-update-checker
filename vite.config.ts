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
                            "zh-TW": "Kobo 電子書更新檢查器",
                        },
                        "description": {
                            "": "Checks whether updates are available for your Kobo e-books.",
                            "zh-TW": "檢查你擁有的 Kobo 電子書是否有可用更新。",
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
                        "updateURL": "https://github.com/JasonHK/kobo-ebooks-update-checker/releases/latest/download/kobo-ebooks-update-checker.meta.js",
                        "downloadURL": "https://github.com/JasonHK/kobo-ebooks-update-checker/releases/latest/download/kobo-ebooks-update-checker.user.js",
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
