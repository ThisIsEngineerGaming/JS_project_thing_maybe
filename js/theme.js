const root = document.documentElement;
const toggle = document.getElementById("themeToggle");

function setCookie(name, value, days = 365) {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);

  document.cookie =
    `${name}=${value};expires=${date.toUTCString()};path=/`;
}

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

function applyTheme(theme) {
  root.setAttribute("data-theme", theme);

  if (toggle) {
    toggle.textContent = theme === "light" ? "Dark" : "Light";
  }
}

const savedTheme = getCookie("theme") || "dark";
applyTheme(savedTheme);

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
