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
};

module.exports = nextConfig;
