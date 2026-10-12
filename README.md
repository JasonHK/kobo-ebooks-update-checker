# Kobo e-Books Update Checker

**Other Languages:** [正體中文](README.zh-TW.md)

[![Greasy Fork Version](https://img.shields.io/greasyfork/v/482410?style=flat-square)][greasyfork]
[![GitHub License](https://img.shields.io/github/license/JasonHK/kobo-ebooks-update-checker?style=flat-square)](LICENSE)
[![Greasy Fork Downloads](https://img.shields.io/greasyfork/dt/482410?style=flat-square)][greasyfork-stats]
[![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/JasonHK/kobo-ebooks-update-checker/nightly.yml?branch=master&style=flat-square)][workflow-nightly]
![Vite](https://img.shields.io/badge/vite-9135ff?style=flat-square&logo=vite&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%233178c6?style=flat-square&logo=typescript&logoColor=white)
![Preact](https://img.shields.io/badge/preact-673ab8?style=flat-square&logo=data%3Aimage%2Fsvg%2Bxml%3Bbase64%2CPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9IiNmZmYiIHZpZXdCb3g9IjAgMCAyNCAyNCI%2BPHBhdGggZD0iTTEyIDEwLjRhMS42IDEuNiAwIDAgMC0xLjYgMS42IDEuNiAxLjYgMCAwIDAgMS42IDEuNiAxLjYgMS42IDAgMCAwIDEuNi0xLjYgMS42IDEuNiAwIDAgMC0xLjYtMS42bTUuNS00LjNoLjZsLjUuMi4zLjIuMi40djFsLS4yLjgtLjUgMS0uOCAxLjItLjUuNS0uNy0uNy0yLTEuOC0uMi4zLjItLjMtLjUuNiAyIDEuOC43LjctLjMuMy0uMy4zLjYuNi4zLS40LjItLjIuMi4yIDEgMS4zLjUgMSAuMy44VjE3bC0uMS40LS4zLjItLjQuMi0uNi4xaC0uOHEtLjYgMC0xLS4zbC0xLjUtLjUtMS43LS44IDEuNy0xLjItLjItLjMuMi4zLS41LS42LTIuMSAxLjUtMS45IDEtMS40LjUtMS4xLjMtLjkuMWgtLjZsLS41LS4yLS4zLS4yLS4yLS40di0xbC4yLS44LjUtMUw3IDEyLjZsLjcuNyAyIDEuOC41LS42LTItMS43LS43LS44LjMtLjMuMy0uMy0uNS0uNi0uNC40LS4yLjItLjItLjJMNS4yIDkgNSA4LjFWN2wuMS0uNC4zLS4yLjQtLjIuNi0uMWguOGwxIC4zIDEuNS41IDEuNy44TDkuNiA5bC41LjZhMjMgMjMgMCAwIDEgNS40LTNsMS4xLS4zem0wLS44LTEgLjEtMS4zLjQtMS41LjYtMS43LjlhMTUgMTUgMCAwIDAtMy42LTEuN2wtMi4xLS4zLS44LjEtLjYuM2EyIDIgMCAwIDAtLjggMXYuOGwuMS44LjMgMSAuNyAxIDEgMS40LjIuM0w1IDE0bC0uNiAxLS4zIDF2LjdsLjEuN2EyIDIgMCAwIDAgLjggMWwuNy4yaDEuOGwxLjItLjNhMTQgMTQgMCAwIDAgMy4zLTEuNmwuNC4yIDEuNyAxIDEuNS41IDEuMi4yaDEuN2wuNi0uM2EyIDIgMCAwIDAgLjgtMXYtLjhsLS4xLS44LS4zLTFhMTAgMTAgMCAwIDAtMS42LTIuNGwtLjMtLjMgMS40LTIgLjYtMSAuMy0xdi0uN2wtLjEtLjdhMiAyIDAgMCAwLS44LTFsLS43LS4yek0xMiAwbDEwLjQgNnYxMkwxMiAyNCAxLjYgMThWNloiLz48L3N2Zz4%3D)


A userscript that checks whether updates are available for your Kobo e-books.


## Installation

1. Install one of the supported userscript manager ([Violentmonkey][violentmonkey] or [Tampermonkey][tampermonkey]), **Greasemonkey is NOT SUPPORTED**.
1. Grant the permission to the userscript manager for executing userscripts. ([Guide][tampermonkey-permissions])
1. Install the userscript from [Greasy Fork][greasyfork] or [GitHub releases][releases].


## Usage

To check update for the e-books in your Kobo library, first navigate to your library. You can choose to either check for [a single book](#check-for-a-single-book), [the current page](#check-for-the-current-page), or [the whole library](#check-for-the-whole-library).

Check result for a book will be cached if the final status for it is either “Latest”, “Outdated”, “Preview” or “Pre-order”. In those cases the book won’t be checked again to save on data usage.

> [!NOTE]
>
> The cache is persisted until page reloaded or navigated away from library.


### Check for a Single Book

1. Click the <kbd><samp>⋯</samp></kbd> actions button on the library item.
1. In the menu, click the <kbd><samp>Check Update</samp></kbd> action.
1. Review the live-updating [indicator for the book status](#status-indicators-for-single-book-or-current-page).

![Check update for a single book](images/en/check-single-book.png)


### Check for the Current Page

1. Click the <kbd><samp>Check Update for Page</samp></kbd> button at the top of the page.
1. Review the live-updating [indicators for the book statuses](#status-indicators-for-single-book-or-current-page) and the [results summary dialog](#results-summary-for-current-page-or-whole-library) when the checks finished.

![Check update for the current page](images/en/check-current-page.png)


### Check for the Whole Library

1. Click the <kbd><samp>Check Update for Library</samp></kbd> button at the top of the page.
1. Confirm you want to check the whole library by clicking the <kbd><samp>Start Checking</samp></kbd> button.
1. When you previously checked the library, you’ll be asked if you want to reload the cached library. Click the <kbd><samp>Reload Library</samp></kbd> button when the filter criteria (e.g. search keyword, genre, item type) changed. Otherwise you can click the <kbd><samp>Bypass Reloading</samp></kbd> button to save time on reloading the library.
1. A progress dialog will then shows up for you to monitor the checking progress. You can cancel checking at any time.
1. Review the [results summary dialog](#results-summary-for-current-page-or-whole-library) when the checks finished.

> [!NOTE]
>
> The cache is persisted until page reloaded or navigated away from library.

![Check update for the whole library](images/en/check-whole-library.png)

![Confirm to check the whole library](images/en/confirm-check-whole-library.png)

![Prompt asking for reload the library](images/en/reload-library.png)

![Checking in progress](images/en/checking-in-progress.png)


### Status Indicators (for Single Book or Current Page)

The status indicator is a live-updating text which reflect the current status of a particular library item. For “Failed” status, you can view the detailed failure message by clicking on the indicator.

![Status indicators](images/en/status-indicators.png)

![Message shown on failed status](images/en/failed-message.png)

#### Appendix: All Possible Statuses

<table>
    <tr>
        <th scope="col" width="12.5%">Pending</th>
        <th scope="col" width="12.5%">Checking</th>
        <th scope="col" width="12.5%">Latest</th>
        <th scope="col" width="12.5%">Outdated</th>
        <th scope="col" width="12.5%">Preview</th>
        <th scope="col" width="12.5%">Pre-order</th>
        <th scope="col" width="12.5%">Skipped</th>
        <th scope="col" width="12.5%">Failed</th>
    </tr>
    <tr>
        <td>
            <img src="images/en/status-pending.png" alt="Pending" />
        </td>
        <td>
            <img src="images/en/status-checking.png" alt="Checking" />
        </td>
        <td>
            <img src="images/en/status-latest.png" alt="Latest" />
        </td>
        <td>
            <img src="images/en/status-outdated.png" alt="Outdated" />
        </td>
        <td>
            <img src="images/en/status-preview.png" alt="Preview" />
        </td>
        <td>
            <img src="images/en/status-preorder.png" alt="Pre-order" />
        </td>
        <td>
            <img src="images/en/status-skipped.png" alt="Skipped" />
        </td>
        <td>
            <img src="images/en/status-failed.png" alt="Failed" />
        </td>
    </tr>
</table>


### Results Summary (for Current Page or Whole Library)

At the results summary dialog, you can either:

1. Review the summary by toggling each of the status section; or
1. Save the [report](#report-for-current-page-or-whole-library) locally for future reference.

![Results summary](images/en/results-summary.png)

![Results summary opened](images/en/results-summary-opened.png)


### Report (for Current Page or Whole Library)

The report is a HTML-based document, listing all of the checked books ordered in a locale-aware manner, grouped by the books’ status. You can contact the customer support to request for updating the outdated books based on the report.

![Report](images/en/report.png)


## Bug Reports

Found a problem? Check [existing issues](https://github.com/JasonHK/kobo-ebooks-update-checker/issues) first, then [open a bug report](https://github.com/JasonHK/kobo-ebooks-update-checker/issues/new) with steps to reproduce, the expected and actual behavior, and your browser and userscript-manager details. Do not include account credentials or other sensitive information. For security vulnerabilities, follow the process in [SECURITY.md](SECURITY.md) instead.


## Development

Development requires Node.js 24.x and pnpm 12.x.

```sh
pnpm install --frozen-lockfile
pnpm run dev
pnpm run build
```

The build regenerates the localization helpers, checks TypeScript, and bundles the userscript. To translate the UI, edit the locale source dictionaries under [src/locales](src/locales), then run `pnpm run locales --no-watch`. Do not edit generated localization files directly. See [CONTRIBUTING.md](CONTRIBUTING.md) for setup, translation, and contribution details.


## Security Considerations

Userscripts run in your browser and can use the permissions granted by your userscript manager. Install this script only from the official repository or a release you have reviewed; avoid modified copies from untrusted sources.

Saving a report uses `GM.download`. If the download fails, `GM.openInTab` opens the report in a new tab. This flow starts only when you click the <kbd><samp>Save Report</samp></kbd> button. The script also loads dependencies from [unpkg.com](https://unpkg.com/).

The script fetches library pages from Kobo using your existing session and product pages without session credentials. Reports are generated locally and are not sent to this project.

See [SECURITY.md](SECURITY.md) for the security policy and vulnerability-reporting process.


## License

This project is licensed under the GNU General Public License v3.0. See the [LICENSE](LICENSE) file for the full license text.


[releases]: https://github.com/JasonHK/kobo-ebooks-update-checker/releases/latest
[workflow-nightly]: https://github.com/JasonHK/kobo-ebooks-update-checker/actions/workflows/nightly.yml
[greasyfork]: https://greasyfork.org/scripts/482410
[greasyfork-stats]: https://greasyfork.org/scripts/482410/stats
[violentmonkey]: https://violentmonkey.github.io/
[tampermonkey]: https://www.tampermonkey.net/
[tampermonkey-permissions]: https://www.tampermonkey.net/faq.php?q=Q209
