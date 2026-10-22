# Security Policy

## Supported Versions

Security fixes are provided for the latest published release of Kobo e-Books Update Checker. Older releases, forks, and modified copies are not covered by this support policy. Update to the latest release before reporting an issue when possible.


## Reporting a Vulnerability

Please report suspected vulnerabilities using GitHub’s private vulnerability reporting feature for this repository. Do not report security vulnerabilities through public GitHub issues.

Include the affected version, browser and userscript manager, a description of the potential impact, and steps to reproduce the issue. Please do not include passwords, session cookies, or unnecessary Kobo account data in your report.

Reports will be acknowledged and investigated on a best-effort basis. There is no fixed acknowledgement or resolution timeline. Please allow time for investigation and coordinated remediation before publicly disclosing a vulnerability. The maintainer will work with the reporter on an appropriate disclosure plan where possible.


## Scope and Data Handling

The userscript runs on Kobo library and archive pages. It fetches library pages from Kobo using the browser’s same-origin session and fetches Kobo product pages without session credentials. It parses those pages to check book product information.

Reports are generated locally in the browser. Saving a report uses `GM.download`; if that fails, the report is opened in a new tab with `GM.openInTab`. This happens after the user clicks the <kbd><samp>Save Report</samp></kbd> button. The script does not send library data or report contents to this project’s servers.

The userscript loads runtime dependencies from `unpkg.com`, a third-party service. Security concerns involving those dependencies or other third-party services should also be reported to their respective maintainers.

This policy covers this repository and its official releases. It does not cover Kobo’s services, userscript managers, third-party libraries, or unofficial copies; report issues in those systems to their respective maintainers.
