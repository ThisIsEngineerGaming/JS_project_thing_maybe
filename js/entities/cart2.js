function setCookie(name, value, days) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

function getCookie(name) {
  return document.cookie.split('; ').reduce((r, v) => {
    const [key, ...val] = v.split('=');
    return key === name ? decodeURIComponent(val.join('=')) : r;
  }, '');
}

function deleteCookie(name) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
}

function setCookie(name, value, days) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

function getCookie(name) {
  return document.cookie.split('; ').reduce((r, v) => {
    const [key, ...val] = v.split('=');
    return key === name ? decodeURIComponent(val.join('=')) : r;
  }, '');
}

function deleteCookie(name) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
}
