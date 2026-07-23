/** @type {import('next').NextConfig} */
const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const apiHost = new URL(apiUrl);

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: apiHost.protocol.replace(':', ''),
        hostname: apiHost.hostname,
        port: apiHost.port || '',
      },
    ],
  },
};

module.exports = nextConfig;
