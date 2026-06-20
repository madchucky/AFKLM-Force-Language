// ==UserScript==
// @name         AFKLM Force Language
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Force a specific language on all AFKLM websites (Air France, KLM, Transavia, Flying Blue, etc.)
// @author       madchucky
// @match        *://*.airfrance.*/*
// @match        *://*.klm.*/*
// @match        *://*.transavia.*/*
// @match        *://*.flyingblue.*/*
// @match        *://*.afklm.*/*
// @match        *://*.hop.*/*
// @match        *://*.joon.*/*
// @match        *://*.servair.*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// ==/UserScript==

(function() {
    'use strict';

    // --- User Configuration ---
    // Default language to force (can be changed via Tampermonkey menu)
    const DEFAULT_LANGUAGE = 'en-US,en;q=0.9';

    // --- 1. Allow user to change the language via Tampermonkey menu ---
    // Add a menu command to change the language
    GM_registerMenuCommand('Set Language to English', () => setLanguage('en-US,en;q=0.9'));
    GM_registerMenuCommand('Set Language to French', () => setLanguage('fr-FR,fr;q=0.9'));
    GM_registerMenuCommand('Set Language to German', () => setLanguage('de-DE,de;q=0.9'));
    GM_registerMenuCommand('Set Language to Spanish', () => setLanguage('es-ES,es;q=0.9'));
    GM_registerMenuCommand('Set Language to Dutch', () => setLanguage('nl-NL,nl;q=0.9'));

    // Load saved language or use default
    let FORCED_LANGUAGE = GM_getValue('forcedLanguage', DEFAULT_LANGUAGE);

    // Function to update the forced language
    function setLanguage(language) {
        FORCED_LANGUAGE = language;
        GM_setValue('forcedLanguage', language);
        alert(`Language set to: ${language.split(',')[0]}`);
    }

    // --- 2. Override the global fetch function to force Accept-Language header for AFKLM domains ---
    // This ensures that all HTTP requests to AFKLM domains include the Accept-Language header set to the user's choice.
    const originalFetch = window.fetch;
    window.fetch = async function(resource, init) {
        // Check if the request URL matches any AFKLM domain
        if (typeof resource === 'string' && /(airfrance|klm|transavia|flyingblue|afklm|hop|joon|servair)/i.test(resource)) {
            // Create a new Headers object from the existing headers (or empty if none)
            const headers = new Headers(init?.headers || {});
            // Force Accept-Language to the user's chosen language
            headers.set('Accept-Language', FORCED_LANGUAGE);
            // Update the init object with the new headers
            init = { ...init, headers };
        }
        // Call the original fetch function with the modified request
        return originalFetch.call(this, resource, init);
    };

    // --- 3. Override XMLHttpRequest to force Accept-Language header for AFKLM domains ---
    // This ensures that older AJAX requests (using XMLHttpRequest) also include the Accept-Language header.
    const originalXHROpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
        // Check if the request URL matches any AFKLM domain
        if (/(airfrance|klm|transavia|flyingblue|afklm|hop|joon|servair)/i.test(url)) {
            // Force Accept-Language to the user's chosen language
            this.setRequestHeader('Accept-Language', FORCED_LANGUAGE);
        }
        // Call the original open method
        originalXHROpen.apply(this, arguments);
    };

    // --- 4. Redirect any language path to the forced language ---
    // This checks the current URL and redirects if a language code is detected in the path.
    if (/(airfrance|klm|transavia|flyingblue|afklm|hop|joon|servair)/i.test(window.location.hostname)) {
        // Split the pathname into parts (e.g., ["", "fr", "accueil"] for "/fr/accueil")
        const pathParts = window.location.pathname.split('/');
        // Check if the first part of the path is a 2-letter language code (ISO 639-1)
        if (pathParts.length > 1) {
            const firstPathPart = pathParts[1];
            // Extract the language code from FORCED_LANGUAGE (e.g., 'en' from 'en-US,en;q=0.9')
            const forcedLangCode = FORCED_LANGUAGE.split(',')[0].split('-')[0].toLowerCase();
            // Redirect if the first part is a 2-letter code and not the forced language
            if (/^[a-z]{2}$/i.test(firstPathPart) && firstPathPart !== forcedLangCode) {
                window.location.pathname = window.location.pathname.replace(`/${firstPathPart}/`, `/${forcedLangCode}/`);
            }
        }

        // --- 5. Remove all language-related cookies ---
        // This ensures that any existing language preference cookies are deleted.
        document.cookie.split(';').forEach(cookie => {
            const [name] = cookie.trim().split('=');
            // Check if the cookie name matches language-related patterns
            if (/lang|language|locale|country/i.test(name)) {
                // Delete the cookie by setting its expiration date to the past
                document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname}`;
            }
        });
    }
})();
