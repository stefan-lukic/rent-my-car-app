import { headers } from 'next/headers'; 

// Vraća osnovni URL (npr. http://localhost:3000) koji se koristi za pozivanje našeg API-ja iz serverskog koda
export function getBaseUrl() {
  // Da li se izvršava na serveru? (veb pregledač ima "window", server nema)
  if (typeof window === 'undefined') {
    const requestHeaders = headers(); // Zaglavlja dolaznog zahteva (sadrže host)
    const siteAddress = requestHeaders.get('host'); // Adresa koju je korisnik otvorio, npr. localhost:3000
    const protocol = requestHeaders.get('x-forwarded-proto') ?? 'http'; // http ili https (podrazumevano je http)
    if (siteAddress) return `${protocol}://${siteAddress}`; // Kompletan osnovni URL, npr. http://localhost:3000
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'; // Rezervna opcija ako host nedostaje
  }
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'; // U veb pregledaču, koristi URL iz .env datoteke
}



