(() => {
  "use strict";

  const storageKey = "bookshelf-site-theme";
  const root = document.documentElement;
  const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");
  const validPreference = (value) =>
    value === "light" || value === "dark" ? value : "system";
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
    const themeColor = document.querySelector('meta[name="theme-color"]');
    if (themeColor) {
      themeColor.content = theme === "dark" ? "#191f1a" : "#f8f5f0";
    }
    const select = document.getElementById("theme-select");
    if (select) select.value = preference;
  }

  applyTheme();

  function initializeControl() {
    const select = document.getElementById("theme-select");
    if (!select) return;
    select.value = preference;
    select.closest(".theme-switcher").hidden = false;
    select.addEventListener("change", () => {
      preference = validPreference(select.value);
      applyTheme();
      try {
        window.localStorage.setItem(storageKey, preference);
      } catch {
        // Retain the user's selection in memory without blocking the page.
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeControl, {
      once: true,
    });
  } else {
    initializeControl();
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
