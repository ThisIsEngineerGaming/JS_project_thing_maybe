const root   = document.documentElement;
const toggle = document.getElementById("themeToggle");

// set a cookie with an expire date
function setCookie(name, value, days = 365) {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);

  document.cookie =
    `${name}=${value};expires=${date.toUTCString()};path=/`;
}

// grab a cookie value by name
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

// apply the theme to the root element and update the button text
function applyTheme(theme) {
  root.setAttribute("data-theme", theme);

  if (toggle) {
    toggle.textContent = theme === "light" ? "Dark" : "Light";
  }
}

// load saved theme from cookie
const savedTheme = getCookie("theme") || "dark";
applyTheme(savedTheme);

// toggle theme on button click and save the choice using cookies
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
