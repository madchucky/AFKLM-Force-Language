// ==UserScript==
// @name         AFKLM Force English (Universal)
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Force English language on all AFKLM websites by modifying HTTP headers, redirecting language paths, and removing language cookies.
// @author       madchucky
// @match        *://*.airfrance.*/*
// @match        *://*.klm.*/*
// @match        *://*.transavia.*/*
// @match        *://*.flyingblue.*/*
// @match        *://*.afklm.*/*
// @match        *://*.hop.*/*
// @match        *://*.joon.*/*
// @match        *://*.servair.*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // --- 1. Override the global fetch function to force Accept-Language header for AFKLM domains ---
    // This ensures that all HTTP requests to AFKLM domains include the Accept-Language header set to English.
    const originalFetch = window.fetch;
    window.fetch = async function(resource, init) {
        // Check if the request URL matches any AFKLM domain
        if (typeof resource === 'string' && /(airfrance|klm|transavia|flyingblue|afklm|hop|joon|servair)/i.test(resource)) {
            // Create a new Headers object from the existing headers (or empty if none)
            const headers = new Headers(init?.headers || {});
            // Force Accept-Language to English (US)
            headers.set('Accept-Language', 'en-US,en;q=0.9');
            // Update the init object with the new headers
            init = { ...init, headers };
        }
        // Call the original fetch function with the modified request
        return originalFetch.call(this, resource, init);
    };

    // --- 2. Override XMLHttpRequest to force Accept-Language header for AFKLM domains ---
    // This ensures that older AJAX requests (using XMLHttpRequest) also include the Accept-Language header.
    const originalXHROpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
        // Check if the request URL matches any AFKLM domain
        if (/(airfrance|klm|transavia|flyingblue|afklm|hop|joon|servair)/i.test(url)) {
            // Force Accept-Language to English (US)
            this.setRequestHeader('Accept-Language', 'en-US,en;q=0.9');
        }
        // Call the original open method
        originalXHROpen.apply(this, arguments);
    };

    // --- 3. Redirect any non-English language path to /en/ ---
    // This checks the current URL and redirects if a language code is detected in the path.
    if (/(airfrance|klm|transavia|flyingblue|afklm|hop|joon|servair)/i.test(window.location.hostname)) {
        // Split the pathname into parts (e.g., ["", "fr", "accueil"] for "/fr/accueil")
        const pathParts = window.location.pathname.split('/');
        // Check if the first part of the path is a 2-letter language code (ISO 639-1)
        if (pathParts.length > 1) {
            const firstPathPart = pathParts[1];
            // Redirect if the first part is a 2-letter code and not 'en' (English)
            if (/^[a-z]{2}$/i.test(firstPathPart) && firstPathPart !== 'en') {
                window.location.pathname = window.location.pathname.replace(`/${firstPathPart}/`, '/en/');
            }
        }

        // --- 4. Remove all language-related cookies ---
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
