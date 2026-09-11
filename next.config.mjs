import withPWA from 'next-pwa';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  env: {
    API_URL: process.env.API_URL,
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            // API responses can contain user-specific or authenticated data.
            key: 'Cache-Control',
            value: 'private, no-store, max-age=0, must-revalidate',
          },
        ],
      },
    ];
  },
  webpack: (config, { isServer }) => {
    config.devtool = 'source-map';
    if (!isServer) {
      config.resolve.fallback = {
        net: false,
        tls: false,
      };
    }
    return config;
  },
};

export const pwaConfig = {
  dest: 'public',
  register: false,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  // Cache only static assets; auth, API, and protected pages stay network-only.
  runtimeCaching: [
    {
      urlPattern: /\.(png|jpg|jpeg|svg|gif|webp)$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'image-cache',
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        },
      },
    },
    {
      urlPattern: /\.(js|css|woff|woff2|ttf|eot)$/,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'static-resources',
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
        },
      },
    },
  ],
  // Exclude Next internals that are unavailable from their emitted public URLs.
  buildExcludes: [/middleware-manifest\.json$/, /app-build-manifest\.json$/],
  maximumFileSizeToCacheInBytes: 5000000, // 5MB
};

const config = withPWA(pwaConfig)(nextConfig);

export default config;
