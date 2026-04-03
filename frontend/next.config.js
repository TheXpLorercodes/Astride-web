/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'apod.nasa.gov' },
      { protocol: 'https', hostname: 'upload.wikimedia.org' },
      { protocol: 'https', hostname: '**.nasa.gov' },
      { protocol: 'https', hostname: 'www.nasa.gov' },
      { protocol: 'https', hostname: 'images-assets.nasa.gov' },
    ],
  },
  // Ensure NASA key never ends up in the client bundle
  // (Only NEXT_PUBLIC_ vars are exposed to the browser)
};

module.exports = nextConfig;
