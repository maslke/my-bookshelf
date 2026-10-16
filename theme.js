(() => {
  "use strict";

  const storageKey = "bookshelf-site-theme";
  const root = document.documentElement;
  const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");
  const preferences = ["system", "light", "dark"];
  const isEnglish = root.lang === "en";
  const labels = isEnglish
    ? { system: "System", light: "Light", dark: "Dark" }
    : { system: "跟随系统", light: "浅色", dark: "深色" };
  const validPreference = (value) =>
    preferences.includes(value) ? value : "system";
  let preference = "system";

  // Local file previews and private browsing may deny access to storage.
  try {
    preference = validPreference(window.localStorage.getItem(storageKey));
  } catch {
    // Switching still works for the current page when storage is unavailable.
  }

  function applyTheme() {
    const theme =
      preference === "system"
        ? systemTheme.matches
          ? "dark"
          : "light"
        : preference;
    root.dataset.theme = theme;
    root.dataset.themePreference = preference;
    const themeColor = document.querySelector('meta[name="theme-color"]');
    if (themeColor) {
      themeColor.content = theme === "dark" ? "#191f1a" : "#f8f5f0";
    }
    const toggle = document.getElementById("theme-toggle");
    if (toggle) {
      const next = preferences[(preferences.indexOf(preference) + 1) % 3];
      const label = isEnglish
        ? `Theme: ${labels[preference]}; switch to ${labels[next]}`
        : `主题：${labels[preference]}；点击切换为${labels[next]}主题`;
      toggle.title = label;
      toggle.setAttribute("aria-label", label);
    }
  }

  applyTheme();

  function initializeControls() {
    const toggle = document.getElementById("theme-toggle");
    if (toggle) {
      toggle.hidden = false;
      applyTheme();
      toggle.addEventListener("click", () => {
        preference = preferences[(preferences.indexOf(preference) + 1) % 3];
        applyTheme();
        try {
          window.localStorage.setItem(storageKey, preference);
        } catch {
          // Retain the user's selection in memory without blocking the page.
        }
      });
    }

    const languageSwitcher = document.querySelector(".language-switcher");
    if (!languageSwitcher) return;
    const languageButton = languageSwitcher.querySelector("summary");
    document.addEventListener("click", (event) => {
      if (!languageSwitcher.contains(event.target))
        languageSwitcher.open = false;
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && languageSwitcher.open) {
        languageSwitcher.open = false;
        languageButton.focus();
      }
    });
    // Keep readers in the same section when changing languages, including file previews.
    const updateLanguageLinks = () => {
      for (const link of languageSwitcher.querySelectorAll("a")) {
        const url = new URL(link.href);
        url.hash = window.location.hash;
        link.href = url.href;
      }
    };
    updateLanguageLinks();
    window.addEventListener("hashchange", updateLanguageLinks);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeControls, {
      once: true,
    });
  } else {
    initializeControls();
  }

  const onSystemChange = () => {
    if (preference === "system") applyTheme();
  };
  if (systemTheme.addEventListener) {
    systemTheme.addEventListener("change", onSystemChange);
  } else {
    systemTheme.addListener(onSystemChange);
  }

  window.addEventListener("storage", (event) => {
    if (event.key === storageKey || event.key === null) {
      preference = validPreference(event.newValue);
      applyTheme();
    }
  });
})();
