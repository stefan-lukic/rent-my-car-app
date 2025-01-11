export function getBaseUrl() {
  if (typeof window !== 'undefined') {
    // Client-side
    return ''; // Use relative URLs on client side
  }
  // Server-side
  return process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
}
