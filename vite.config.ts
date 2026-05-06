import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import monkey, { cdn } from "vite-plugin-monkey";

export default defineConfig(
    {
        resolve: {
            alias: {
                "react": "preact/compat",
                "react-dom": "preact/compat",
                "react/jsx-runtime": "preact/jsx-runtime",
            },
        },
        plugins: [
            preact(),
            monkey(
                {
                    entry: "src/index.ts",
                    userscript: {
                        "name": {
                            "": "Kobo e-Books Update Checker",
                            "zh-TW": "Kobo 電子書更新檢查器",
                        },
                        "description": {
                            "": "Checks if updates were available for the e-books you own.",
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
                        "grant": [
                            "GM.setClipboard",
                        ],
                    },
                    build: {
                        metaFileName: true,
                        externalGlobals: {
                            "preact": cdn.unpkg("preact", "dist/preact.min.js"),
                        },
                    },
                }),
        ],
    });
