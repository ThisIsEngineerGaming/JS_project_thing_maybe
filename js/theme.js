const root   = document.documentElement;
const toggle = document.getElementById("themeToggle");

// Sets a browser cookie with the given name, value, and lifetime in days (default 365)
function setCookie(name, value, days = 365) {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);

  document.cookie =
    `${name}=${value};expires=${date.toUTCString()};path=/`;
}

// Returns the value of a cookie by name, or null if it doesn't exist
function getCookie(name) {
  const cookies = document.cookie.split(";");

  for (let cookie of cookies) {
    cookie = cookie.trim();

    if (cookie.startsWith(name + "=")) {
      return cookie.substring(name.length + 1);
    }
  }

  return null;
}

// Applies the given theme ("light" or "dark") to the root element and updates the toggle button label
function applyTheme(theme) {
  root.setAttribute("data-theme", theme);

  if (toggle) {
    toggle.textContent = theme === "light" ? "Dark" : "Light";
  }
}

// Load the saved theme from cookie on page load, falling back to "dark"
const savedTheme = getCookie("theme") || "dark";
applyTheme(savedTheme);

// Switches between dark/light on button click and persists the choice to a cookie
if (toggle) {
  toggle.addEventListener("click", () => {
    const current = root.getAttribute("data-theme") || "dark";

    const next =
      current === "dark"
        ? "light"
        : "dark";

    applyTheme(next);
    setCookie("theme", next);
  });
}
