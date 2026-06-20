// ==UserScript==
// @name         AFKLM Force Language
// @namespace    http://tampermonkey.net/
// @version      3.6
// @description  Force any language on AFKLM websites
// @author       madchucky
// @match        *://*.airfrance.*/*
// @match        *://airfrance.*/*
// @match        *://wwws.airfrance.fr/*
// @match        *://*.klm.*/*
// @match        *://klm.*/*
// @match        *://*.transavia.*/*
// @match        *://transavia.*/*
// @match        *://*.flyingblue.*/*
// @match        *://flyingblue.*/*
// @match        *://*.afklm.*/*
// @match        *://afklm.*/*
// @match        *://*.hop.*/*
// @match        *://hop.*/*
// @match        *://*.joon.*/*
// @match        *://joon.*/*
// @match        *://*.servair.*/*
// @match        *://servair.*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_notification
// ==/UserScript==

(function() {
    'use strict';

    // Debug: Log that the script is running
    console.log("AFKLM Force Language script is running on:", window.location.hostname);

    // --- User Configuration ---
    const DEFAULT_LANGUAGE = 'en-US,en;q=0.9';
    let FORCED_LANGUAGE = GM_getValue('forcedLanguage', DEFAULT_LANGUAGE);

    // --- 1. Remove language-related cookies immediately ---
    function removeLanguageCookies() {
        if (/(airfrance|klm|transavia|flyingblue|afklm|hop|joon|servair)/i.test(window.location.hostname)) {
            document.cookie.split(';').forEach(cookie => {
                const [name] = cookie.trim().split('=');
                if (/lang|language|locale|country/i.test(name)) {
                    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname.replace(/^www\d*\./, '')};`;
                }
            });
        }
    }

    // Remove cookies on script start
    removeLanguageCookies();

    // --- 2. Allow user to input any language code ---
    function promptForLanguage() {
        const newLanguage = prompt(
            'Enter Language Code',
            'Enter the language code (e.g., en-US, fr-FR, de-DE, ja-JP, zh-CN):',
            FORCED_LANGUAGE.split(',')[0]
        );
        if (newLanguage) {
            const formattedLanguage = formatLanguageCode(newLanguage);
            setLanguage(formattedLanguage);
        }
    }

    function formatLanguageCode(languageCode) {
        const primaryLang = languageCode.split('-')[0].toLowerCase();
        return `${languageCode},${primaryLang};q=0.9`;
    }

    function setLanguage(language) {
        FORCED_LANGUAGE = language;
        GM_setValue('forcedLanguage', language);
        GM_notification({
            title: 'Language Updated',
            text: `Language set to: ${language.split(',')[0]}`,
            timeout: 2000
        });
        // Re-remove cookies after language change
        removeLanguageCookies();
        // Force reload to apply new language
        window.location.reload();
    }

    GM_registerMenuCommand('Set Custom Language', promptForLanguage);

    // --- 3. Force redirect to the forced language path ---
    function checkAndRedirect() {
        if (/(airfrance|klm|transavia|flyingblue|afklm|hop|joon|servair)/i.test(window.location.hostname)) {
            const forcedLangCode = FORCED_LANGUAGE.split(',')[0].split('-')[0].toLowerCase();
            const currentPath = window.location.pathname;

            // If the path does not start with a language code, redirect to /forcedLangCode/
            if (!/^\/(en|fr|de|es|nl|it|ja|zh|ko|pt|ru|ar|pl|dk|se|no|fi)\//i.test(currentPath)) {
                window.location.href = `${window.location.origin}/${forcedLangCode}/${currentPath.replace(/^\//, '')}`;
            }
            // If the path starts with a different language code, redirect to the forced language
            else if (!currentPath.startsWith(`/${forcedLangCode}/`)) {
                window.location.href = `${window.location.origin}/${forcedLangCode}/${currentPath.replace(/^\//, '')}`;
            }
        }
    }

    // Run redirect check
    checkAndRedirect();

    // --- 4. Override the global fetch function ---
    const originalFetch = window.fetch;
    window.fetch = async function(resource, init) {
        if (typeof resource === 'string' && /(airfrance|klm|transavia|flyingblue|afklm|hop|joon|servair)/i.test(resource)) {
            const headers = new Headers(init?.headers || {});
            headers.set('Accept-Language', FORCED_LANGUAGE);
            init = { ...init, headers };
        }
        return originalFetch.call(this, resource, init);
    };

    // --- 5. Override XMLHttpRequest ---
    const originalXHROpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
        if (/(airfrance|klm|transavia|flyingblue|afklm|hop|joon|servair)/i.test(url)) {
            this.setRequestHeader('Accept-Language', FORCED_LANGUAGE);
        }
        originalXHROpen.apply(this, arguments);
    };

    // --- 6. Periodically check and remove cookies ---
    setInterval(removeLanguageCookies, 1000);
})();
