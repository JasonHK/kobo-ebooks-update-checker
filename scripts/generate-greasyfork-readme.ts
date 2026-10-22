import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { globSync } from "glob";
import { Marked } from "marked";
import { baseUrl } from "marked-base-url";
import alert from "marked-alert";

const marked = new Marked()
    .use(baseUrl("https://github.com/JasonHK/kobo-ebooks-update-checker/blob/master/"))
    .use(alert(
        {
            variants: [
                {
                    type: "note",
                    icon: "📝 ",
                },
                {
                    type: "tip",
                    icon: "💡 ",
                },
                {
                    type: "important",
                    icon: "📌 ",
                },
                {
                    type: "warning",
                    icon: "⚠️ ",
                },
                {
                    type: "caution",
                    icon: "🚨 ",
                },
            ],
        }));

for (const name of globSync(["README.md", "README.*.md"]))
{
    const html = await marked.parse(readFileSync(name, "utf-8"));
    writeFileSync(path.join("docs/greasyfork", name.replace(".md", ".html")), html, "utf-8");
}
