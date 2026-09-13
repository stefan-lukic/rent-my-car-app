import Script from 'next/script';

const GOOGLE_PLACES_CONFIG_ID = 'rentmycar-google-places-config';

export default function GooglePlacesScript() {
  const apiKey = process.env.NEXT_GOOGLE_MAPS_PLACES_API_KEY?.trim();

  return (
    <>
      {/* Read the Google key on the server before rendering the browser script. */}
      <span
        id={GOOGLE_PLACES_CONFIG_ID}
        data-enabled={Boolean(apiKey)}
        hidden
      />
      {apiKey ? (
        <Script
          id="rentmycar-google-places-script"
          src={`https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&loading=async&libraries=places&v=weekly`}
          strategy="afterInteractive"
        />
      ) : null}
    </>
  );
}
