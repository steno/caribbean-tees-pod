/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images-api.printify.com',
      },
    ],
  },
}

module.exports = nextConfig

