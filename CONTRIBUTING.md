# Contributing

Thank you for helping improve Kobo e-Books Update Checker. Contributions can include bug reports, code changes, documentation, and UI translations.


## Development Setup

Install Node.js 24.x and pnpm 12.x, then install the locked dependencies:

```sh
pnpm install --frozen-lockfile
```

Run the Vite development server with `pnpm run dev`. To validate and build the userscript, run:

```sh
pnpm run build
```

The build regenerates the localization helpers, runs the TypeScript compiler, and bundles the userscript into `dist/`.


## Translating the UI

The UI and generated reports use the locale selected from the Kobo page's HTML `lang` attribute. Only add translations for locales supported by Kobo.


### Update an Existing Locale

1. Edit the source dictionary for the locale, such as `src/locales/zh-TW/index.ts`. The `en-US` dictionary in `src/locales/en-US/index.ts` defines the source keys and message structure.
1. Keep every key and interpolation placeholder consistent with the English source. Preserve placeholder names, types, and pluralization syntax; translate the surrounding text naturally for the target locale.
1. Regenerate the localization helpers and validate the result:

   ```sh
   pnpm run locales --no-watch
   pnpm run build
   ```


### Propose a New Locale

1. Confirm that Kobo supports the locale and that its locale identifier matches the value used in Kobo's page `lang` attribute.
1. Add a source dictionary under `src/locales/<locale>/index.ts`, following the structure of an existing locale and implementing the generated `Translation` type.
1. Run `pnpm run locales --no-watch` to regenerate the locale types and helpers, then run `pnpm run build`.
1. Review the generated changes and, when possible, verify the UI on a Kobo page using that locale.

Do not edit generated files such as `i18n-types.ts` or `i18n-util*.ts` by hand. The generator may overwrite manual changes.


## Filing a Bug Report

Before opening an issue, check whether the problem has already been reported. If it has, add relevant details to the existing issue rather than creating a duplicate.

When filing a new bug report, include:

- Clear steps to reproduce the problem, including the affected Kobo page or action.
- What you expected to happen and what happened instead.
- Your browser and version, userscript manager and version, and the userscript version if available.
- Screenshots or error messages when they help explain the problem. Review them first and remove account details or other sensitive information.

Do not post passwords, session data, or other private account information. Report security vulnerabilities using the process in [SECURITY.md](SECURITY.md), not in a public issue.


## Changes and Pull Requests

- Keep changes focused and include documentation updates when behavior or contributor workflows change.
- For pull requests, explain the change and its motivation, summarize the validation performed, and include screenshots for user-facing UI changes when useful.
- Commit messages and pull request titles are recommended to follow the [Conventional Commits v1.0.0](https://www.conventionalcommits.org/en/v1.0.0/) format; this is a recommendation, not a requirement.
- You do not need to open an issue before submitting a pull request.

There is no dedicated test script in the repository at this time. Run `pnpm run build` for automated validation. Changes to the UI or localization should also be checked in the relevant Kobo page when practical.


## License

This project is licensed under the GNU General Public License v3.0. Contributions are made for distribution under that license; see [LICENSE](LICENSE) for its terms.
