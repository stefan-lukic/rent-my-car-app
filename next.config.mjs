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
    webpack: (config, { isServer }) => {
      config.devtool = 'source-map';
      return config;
    },
  }

export default nextConfig