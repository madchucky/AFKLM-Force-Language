// ==UserScript==
// @name         AFKLM Force Language
// @namespace    http://tampermonkey.net/
// @version      3.2
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
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_prompt
// ==/UserScript==

(function() {
    'use strict';

    // --- User Configuration ---
    // Default language to force (can be changed via Tampermonkey menu)
    const DEFAULT_LANGUAGE = 'en-US,en;q=0.9';

    // Load saved language or use default
    let FORCED_LANGUAGE = GM_getValue('forcedLanguage', DEFAULT_LANGUAGE);

    // --- 1. Allow user to input any language code via Tampermonkey menu ---
    // Function to prompt the user for a language code
    function promptForLanguage() {
        const newLanguage = GM_prompt(
            'Enter Language Code',
            'Enter the language code (e.g., en-US, fr-FR, de-DE, ja-JP, zh-CN):',
            FORCED_LANGUAGE.split(',')[0] // Show current primary language code
        );
        if (newLanguage) {
            // Format the language code for Accept-Language header (e.g., en-US -> en-US,en;q=0.9)
            const formattedLanguage = formatLanguageCode(newLanguage);
            setLanguage(formattedLanguage);
        }
    }

    // Function to format the language code for Accept-Language header
    function formatLanguageCode(languageCode) {
        // Extract the primary language code (e.g., en-US -> en)
        const primaryLang = languageCode.split('-')[0].toLowerCase();
        // Format as "languageCode,primaryLang;q=0.9" (e.g., en-US,en;q=0.9)
        return `${languageCode},${primaryLang};q=0.9`;
    }

    // Function to update the forced language
    function setLanguage(language) {
        FORCED_LANGUAGE = language;
        GM_setValue('forcedLanguage', language);
        alert(`Language set to: ${language.split(',')[0]}`);
    }

    // Register menu command to prompt for language
    GM_registerMenuCommand('Set Custom Language', promptForLanguage);

    // --- 2. Override the global fetch function to force Accept-Language header for AFKLM domains ---
    // This ensures that all HTTP requests to AFKLM domains include the Accept-Language header set to the user's choice.
    const originalFetch = window.fetch;
    window.fetch = async function(resource, init) {
        // Check if the request URL matches any AFKLM domain (including all subdomains like wwws.airfrance.fr)
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
        // Check if the request URL matches any AFKLM domain (including all subdomains)
        if (/(airfrance|klm|transavia|flyingblue|afklm|hop|joon|servair)/i.test(url)) {
            // Force Accept-Language to the user's chosen language
            this.setRequestHeader('Accept-Language', FORCED_LANGUAGE);
        }
        // Call the original open method
        originalXHROpen.apply(this, arguments);
    };

    // --- 4. Redirect to the forced language path ---
    // This checks the current URL and redirects if a language code is missing or incorrect.
    if (/(airfrance|klm|transavia|flyingblue|afklm|hop|joon|servair)/i.test(window.location.hostname)) {
        const pathParts = window.location.pathname.split('/');
        const forcedLangCode = FORCED_LANGUAGE.split(',')[0].split('-')[0].toLowerCase();

        // Check if the path already contains a language code (e.g., /fr/, /en/)
        const hasLanguagePath = pathParts.length > 1 && /^[a-z]{2}$/i.test(pathParts[1]);

        // If no language code is present in the path, redirect to /forcedLangCode/
        if (!hasLanguagePath) {
            // Remove leading slash if present
            const cleanPath = window.location.pathname.replace(/^\//, '');
            window.location.pathname = `/${forcedLangCode}/${cleanPath}`;
        }
        // If a language code is present but not the forced one, redirect to the forced language
        else if (pathParts[1] !== forcedLangCode) {
            window.location.pathname = window.location.pathname.replace(`/${pathParts[1]}/`, `/${forcedLangCode}/`);
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
