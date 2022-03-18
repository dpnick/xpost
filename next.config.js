// eslint-disable-next-line @typescript-eslint/no-var-requires
const withPWA = require('next-pwa');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'res.cloudinary.com',
      'avatars.githubusercontent.com',
      'localhost',
    ],
  },
  compiler: {
    styledComponents: true,
  },
  pwa: {
    dest: 'public',
    disable: process.env.NODE_ENV === 'development',
    register: true,
    skipWaiting: true,
  },
};

module.exports = withPWA(nextConfig);
