window.addEventListener("load", () => {
    const form = document.getElementById("contactForm");
    if (!form) return;

    const loading = form.querySelector(".loading");
    const errorBox = form.querySelector(".error-message");
    const successBox = form.querySelector(".sent-message");
    const submitBtn = form.querySelector('button[type="submit"]');

    const show = (el) => el && (el.style.display = "block");
    const hide = (el) => el && (el.style.display = "none");

    hide(loading);
    hide(errorBox);
    hide(successBox);

    // si el usuario empieza a escribir otra vez, ocultamos mensajes
    form.addEventListener("input", () => {
        hide(errorBox);
        hide(successBox);
    });

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        // 🔒 anti doble submit
        if (form.dataset.submitting === "true") return;
        form.dataset.submitting = "true";

        hide(errorBox);
        hide(successBox);
        show(loading);
        if (submitBtn) submitBtn.disabled = true;

        // ✅ token confiable desde widget explícito
        const token = window.__recaptchaGetToken ? window.__recaptchaGetToken().trim() : "";
        if (!token) {
            hide(loading);
            show(errorBox);
            errorBox.textContent = "Please complete the CAPTCHA and try again.";
            if (window.__recaptchaReset) window.__recaptchaReset();
            if (submitBtn) submitBtn.disabled = false;
            form.dataset.submitting = "false";
            return;
        }

        try {
            const formData = new FormData(form);

            const res = await fetch(form.action, {
                method: "POST",
                body: formData,
                headers: { Accept: "application/json" },
            });

            hide(loading);

            if (res.ok) {
                show(successBox);
                form.reset();
                if (window.__recaptchaReset) window.__recaptchaReset();

                // ✅ auto-hide banner
                setTimeout(() => hide(successBox), 3500);
                return;
            }

            const data = await res.json().catch(() => ({}));
            const msg =
                data?.errors?.[0]?.message ||
                data?.error ||
                `Form submission failed (${res.status}).`;

            // ✅ reCAPTCHA expiró o se reusó
            if (String(msg).includes("timeout-or-duplicate")) {
                show(errorBox);
                errorBox.textContent =
                    "CAPTCHA expired. Please complete 'I’m not a robot' again and resend.";
                if (window.__recaptchaReset) window.__recaptchaReset();
                return;
            }

            show(errorBox);
            errorBox.textContent = msg;
            if (window.__recaptchaReset) window.__recaptchaReset();
        } catch (err) {
            hide(loading);
            show(errorBox);
            errorBox.textContent = "Network error. Please try again.";
            if (window.__recaptchaReset) window.__recaptchaReset();
        } finally {
            if (submitBtn) submitBtn.disabled = false;
            form.dataset.submitting = "false";
        }
    });
});