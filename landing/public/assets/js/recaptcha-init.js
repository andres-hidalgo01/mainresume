(function () {
    "use strict";

    // Guardamos el widgetId para obtener/resetear token de forma confiable
    let widgetId = null;

    // Google llama esta función cuando termina de cargar api.js (por el ?onload=...)
    window.onRecaptchaLoad = function () {
        const el = document.getElementById("recaptcha");
        if (!el || !window.grecaptcha) return;

        // Evita doble render si recargas o si Astro rehidrata algo raro
        if (widgetId !== null) return;

        widgetId = window.grecaptcha.render(el, {
            sitekey: el.getAttribute("data-sitekey"),
        });
    };

    // Helpers para el submit handler
    window.__recaptchaGetToken = function () {
        if (!window.grecaptcha || widgetId === null) return "";
        return window.grecaptcha.getResponse(widgetId) || "";
    };

    window.__recaptchaReset = function () {
        if (!window.grecaptcha || widgetId === null) return;
        window.grecaptcha.reset(widgetId);
    };
})();