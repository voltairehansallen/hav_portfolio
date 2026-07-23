/** @type {import('next').NextConfig} */
const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const apiUrl = /^https?:\/\//i.test(rawApiUrl) ? rawApiUrl : `https://${rawApiUrl}`;

let apiHost;
try {
  apiHost = new URL(apiUrl);
} catch {
  console.warn(
    `⚠️  NEXT_PUBLIC_API_URL="${rawApiUrl}" n'est pas une URL valide — vérifie cette variable d'environnement. Repli sur localhost.`
  );
  apiHost = new URL('http://localhost:5000/api');
}

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
