export function getBaseUrl() {
  // Check if we're running on the server side
  if (typeof window === 'undefined') {
    // Server-side: use the environment variable or fallback
    const vercelUrl = process.env.VERCEL_URL;
    if (vercelUrl) {
      return `https://${vercelUrl}`;
    }
    return process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  }

  // Client-side: use the window location
  const protocol = window.location.protocol;
  const host = window.location.host;
  return `${protocol}//${host}`;
}
