const securityHeaders = {
  //'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload', // Disabled for development
  'Content-Security-Policy': "default-src 'self' 'unsafe-inline'; img-src *",  // Don't load content from other hosts (XSS protection)
  'X-Frame-Options': 'DENY',                        // Don't load our content in iframes (clickjacking protection)
  'Cross-Origin-Embedder-Policy': 'credentialless', // Don't pass our cookies to CORS requests
  'Cross-Origin-Opener-Policy': 'same-origin',      // Ensure our top-level document does not share a browsing context group with cross-origin document
  'X-XSS-Protection': '1; mode=block',              // Prevents pages from loading when they detect reflected XSS attacks (depreciated in favor of CSP)
  //'X-Content-Type-Options': 'nosniff',              // Prevents browsers from trying to guess ("sniff") the MIME type of content //TODO: check if this breaks app
};
/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {


  // Security Headers
  const response = await resolve(event);
  Object.entries(securityHeaders).forEach(([header, value]) => response.headers.set(header, value));

  return response;
}
