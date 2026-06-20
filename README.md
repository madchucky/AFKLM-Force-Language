# AFKLM Force Language

A Tampermonkey userscript to force a specific language on all AFKLM group websites (Air France, KLM, Transavia, Flying Blue, etc.).

## Features

- Forces `Accept-Language` header to the user's chosen language for all requests to AFKLM domains.
- Redirects any language path (e.g., `/fr/`, `/de/`, `/es/`) to the chosen language path (e.g., `/en/`).
- Removes all language-related cookies (e.g., `lang`, `language`, `locale`, `country`).
- Allows the user to **change the language dynamically** via the Tampermonkey menu.
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
   - Delete the default content and paste the content of [`afklm-force-language.user.js`](afklm-force-language.user.js).
   - Save the script (`Ctrl+S` or `Cmd+S`).

3. **Change the Language (Optional)**:
   - Click the Tampermonkey icon in your browser.
   - Select the script "AFKLM Force Language".
   - Choose your preferred language from the menu:
     - Set Language to English
     - Set Language to French
     - Set Language to German
     - Set Language to Spanish
     - Set Language to Dutch
   - The script will automatically update and apply the new language.

## How It Works

1. **HTTP Headers**: The script overrides the `fetch` and `XMLHttpRequest` functions to force the `Accept-Language` header to the user's chosen language for all requests to AFKLM domains.

2. **URL Redirection**: If the URL path contains a 2-letter language code (e.g., `/fr/`, `/de/`), it redirects to the equivalent path in the chosen language (e.g., `/en/`).

3. **Cookie Cleanup**: The script removes all cookies related to language preferences (e.g., `lang`, `language`, `locale`, `country`).

4. **User Configuration**: The script uses Tampermonkey's `GM_setValue` and `GM_getValue` to save the user's language preference.

## Testing

| Input URL | Forced Language | Expected Result |
|-----------|------------------|-----------------|
| `airfrance.fr/fr/accueil` | English | Redirects to `airfrance.fr/en/accueil` |
| `klm.com/de/angebote` | French | Redirects to `klm.com/fr/angebote` |
| `transavia.nl/nl/vluchten` | Spanish | Redirects to `transavia.nl/es/vluchten` |
| `flyingblue.com/it/offerte` | German | Redirects to `flyingblue.com/de/offerte` |
| `airfrance.fr/en/home` | Dutch | No redirection (already matches forced language) |

## Default Language

The default language is set to **English** (`en-US,en;q=0.9`). You can change it at any time using the Tampermonkey menu.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
