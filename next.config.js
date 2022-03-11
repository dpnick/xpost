// eslint-disable-next-line @typescript-eslint/no-var-requires
const withPWA = require('next-pwa');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { withSentryConfig } = require('@sentry/nextjs');

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

const sentryWebpackPluginOptions = {
  silent: true, // Suppresses all logs
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options.
};
module.exports = withSentryConfig(
  withPWA(nextConfig),
  sentryWebpackPluginOptions
);
