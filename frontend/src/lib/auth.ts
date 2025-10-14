export function getAccessToken() {
  if (typeof window !== "undefined") {
    return localStorage.getItem("access_token");
  }
  return null;
}

export function isAuthenticated() {
  return !!getAccessToken();
}
