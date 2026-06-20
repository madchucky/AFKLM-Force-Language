// ==UserScript==
// @name         AFKLM Force Language
// @namespace    http://tampermonkey.net/
// @version      3.3
// @description  Force any language on AFKLM websites by letting the user input a language code (e.g., en-US, fr-FR, de-DE, ja-JP, etc.)
// @author       madchucky
// @match        *://*.airfrance.*/*
// @match        *://*.klm.*/*
// @match        *://*.transavia.*/*
// @match        *://*.flyingblue.*/*
// @match        *://*.afklm.*/*
// @match        *://*.hop.*/*
// @match        *://*.joon.*/*
// @match        *://*.servair.*/*
// @match        *://airfrance.*/*
// @match        *://klm.*/*
// @match        *://transavia.*/*
// @match        *://flyingblue.*/*
// @match        *://afklm.*/*
// @match        *://hop.*/*
// @match        *://joon.*/*
// @match        *://servair.*/*
// @run-at       document-start
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_prompt
// ==/UserScript==

(function() {
    'use strict';

    // Debug: Log that the script is running
    console.log("AFKLM Force Language script is running on:", window.location.hostname);

    // --- User Configuration ---
    // Default language to force (can be changed via Tampermonkey menu)
    const DEFAULT_LANGUAGE = 'en-US,en;q=0.9';

    // Load saved language or use default
    let FORCED_LANGUAGE = GM_getValue('forcedLanguage', DEFAULT_LANGUAGE);

    // --- 1. Remove language-related cookies immediately ---
    // This ensures that any existing language preference cookies are deleted before the page loads
    if (/(airfrance|klm|transavia|flyingblue|afklm|hop|joon|servair)/i.test(window.location.hostname)) {
        document.cookie.split(';').forEach(cookie => {
            const [name] = cookie.trim().split('=');
            if (/lang|language|locale|country/i.test(name)) {
                // Delete the cookie for all subdomains (e.g., .airfrance.fr)
                document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname.replace(/^www\d*\./, '')};`;
            }
        });
    }

    // --- 2. Allow user to input any language code via Tampermonkey menu ---
    function promptForLanguage() {
        const newLanguage = GM_prompt(
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
        alert(`Language set to: ${language.split(',')[0]}`);
    }

    GM_registerMenuCommand('Set Custom Language', promptForLanguage);

    // --- 3. Force redirect to the forced language path ---
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

    // --- 4. Override the global fetch function to force Accept-Language header for AFKLM domains ---
    const originalFetch = window.fetch;
    window.fetch = async function(resource, init) {
        if (typeof resource === 'string' && /(airfrance|klm|transavia|flyingblue|afklm|hop|joon|servair)/i.test(resource)) {
            const headers = new Headers(init?.headers || {});
            headers.set('Accept-Language', FORCED_LANGUAGE);
            init = { ...init, headers };
        }
        return originalFetch.call(this, resource, init);
    };

    // --- 5. Override XMLHttpRequest to force Accept-Language header for AFKLM domains ---
    const originalXHROpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
        if (/(airfrance|klm|transavia|flyingblue|afklm|hop|joon|servair)/i.test(url)) {
            this.setRequestHeader('Accept-Language', FORCED_LANGUAGE);
        }
        originalXHROpen.apply(this, arguments);
    };

    // --- 6. Remove language-related cookies again (in case they were set after page load) ---
    if (/(airfrance|klm|transavia|flyingblue|afklm|hop|joon|servair)/i.test(window.location.hostname)) {
        document.cookie.split(';').forEach(cookie => {
            const [name] = cookie.trim().split('=');
            if (/lang|language|locale|country/i.test(name)) {
                document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname.replace(/^www\d*\./, '')};`;
            }
        });
    }
})();
