# AFKLM Force Language

A Tampermonkey userscript to force **any language** on all AFKLM group websites (Air France, KLM, Transavia, Flying Blue, etc.). The user can input any language code (e.g., `en-US`, `fr-FR`, `de-DE`, `ja-JP`, `zh-CN`, etc.) to override the default language.

## Features

- Forces the `Accept-Language` header to the user's chosen language for all requests to AFKLM domains.
- Redirects any language path (e.g., `/fr/`, `/de/`, `/es/`) to the chosen language path (e.g., `/en/`).
- Removes all language-related cookies (e.g., `lang`, `language`, `locale`, `country`).
- Allows the user to **input any language code** via a prompt.
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

3. **Set Your Language**:
   - Click the Tampermonkey icon in your browser.
   - Select the script "AFKLM Force Language".
   - Choose "Set Custom Language".
   - Enter your desired language code (e.g., `en-US`, `fr-FR`, `de-DE`, `ja-JP`, `zh-CN`).
   - The script will automatically apply the new language.

## How It Works

1. **HTTP Headers**: The script overrides the `fetch` and `XMLHttpRequest` functions to force the `Accept-Language` header to the user's chosen language for all requests to AFKLM domains.

2. **URL Redirection**: If the URL path contains a 2-letter language code (e.g., `/fr/`, `/de/`), it redirects to the equivalent path in the chosen language (e.g., `/en/`).

3. **Cookie Cleanup**: The script removes all cookies related to language preferences (e.g., `lang`, `language`, `locale`, `country`).

4. **User Input**: The script uses Tampermonkey's `GM_prompt` to let the user input any language code. The code is then formatted for the `Accept-Language` header (e.g., `en-US` becomes `en-US,en;q=0.9`).

## Examples of Language Codes

Here are some common language codes you can use:

| Language       | Code       |
|----------------|------------|
| English        | `en-US`    |
| French         | `fr-FR`    |
| German         | `de-DE`    |
| Spanish        | `es-ES`    |
| Dutch          | `nl-NL`    |
| Italian        | `it-IT`    |
| Japanese       | `ja-JP`    |
| Chinese        | `zh-CN`    |
| Korean         | `ko-KR`    |
| Portuguese     | `pt-PT`    |
| Russian        | `ru-RU`    |
| Arabic         | `ar-SA`    |

## Testing

| Input URL | Forced Language | Expected Result |
|-----------|------------------|-----------------|
| `airfrance.fr/fr/accueil` | `en-US` | Redirects to `airfrance.fr/en/accueil` |
| `klm.com/de/angebote` | `fr-FR` | Redirects to `klm.com/fr/angebote` |
| `transavia.nl/nl/vluchten` | `ja-JP` | Redirects to `transavia.nl/ja/vluchten` |
| `flyingblue.com/it/offerte` | `zh-CN` | Redirects to `flyingblue.com/zh/offerte` |

## Default Language

The default language is set to **English** (`en-US,en;q=0.9`). You can change it at any time using the Tampermonkey menu.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
