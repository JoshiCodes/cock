// Themes are random; rendering on the server would roll a different one than the browser.
// The page also reads its theme from the query string, which prerendering cannot see.
export const ssr = false;
export const prerender = false;
