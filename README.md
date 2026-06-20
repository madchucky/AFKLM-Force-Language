# AFKLM Force English

A Tampermonkey userscript to force English language on all AFKLM group websites (Air France, KLM, Transavia, Flying Blue, etc.).

## Features

- Forces `Accept-Language: en-US,en;q=0.9` header for all requests to AFKLM domains.
- Redirects any language path (e.g., `/fr/`, `/de/`, `/es/`) to `/en/`.
- Removes all language-related cookies (e.g., `lang`, `language`, `locale`, `country`).
- Works on all AFKLM domains:
  - Air France (`airfrance.fr`, `airfrance.com`, etc.)
  - KLM (`klm.com`, `klm.nl`, etc.)
  - Transavia (`transavia.com`, `transavia.fr`, etc.)
  - Flying Blue (`flyingblue.com`, etc.)
  - Other AFKLM domains (`afklm.com`, `hop.fr`, `joon.com`, `servair.com`, etc.)

## Installation

1. **Install Tampermonkey**:
   - [Firefox](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/)
   - [Chrome](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)

2. **Add the Script**:
   - Click the Tampermonkey icon in your browser.
   - Select "Create a new script".
   - Delete the default content and paste the content of [`afklm-force-english.user.js`](afklm-force-english.user.js).
   - Save the script (`Ctrl+S` or `Cmd+S`).

3. **Test the Script**:
   - Visit any AFKLM website (e.g., [airfrance.fr](https://www.airfrance.fr), [klm.com](https://www.klm.com)).
   - The site should automatically display in English.

## How It Works

1. **HTTP Headers**: The script overrides the `fetch` and `XMLHttpRequest` functions to force the `Accept-Language: en-US,en;q=0.9` header for all requests to AFKLM domains.

2. **URL Redirection**: If the URL path contains a 2-letter language code (e.g., `/fr/`, `/de/`), it redirects to the equivalent `/en/` path.

3. **Cookie Cleanup**: The script removes all cookies related to language preferences (e.g., `lang`, `language`, `locale`, `country`).

## Testing

| Input URL | Expected Result |
|-----------|-----------------|
| `airfrance.fr/fr/accueil` | Redirects to `airfrance.fr/en/accueil` |
| `klm.com/de/angebote` | Redirects to `klm.com/en/angebote` |
| `transavia.nl/nl/vluchten` | Redirects to `transavia.nl/en/vluchten` |
| `flyingblue.com/it/offerte` | Redirects to `flyingblue.com/en/offerte` |
| `airfrance.fr/en/home` | No redirection (already in English) |

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
