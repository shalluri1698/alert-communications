export const SITE_URL = "https://www.alertcommunications.com";
/** Absolute URL with a trailing slash, matching the WordPress URL format. */
export const abs = (path: string) => SITE_URL + (path === "" || path === "/" ? "/" : path.endsWith("/") ? path : path + "/");
