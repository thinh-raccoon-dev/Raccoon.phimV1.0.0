/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'img.ophim.live' },
      { protocol: 'https', hostname: 'ophim.live' },
      { protocol: 'https', hostname: 'placehold.co' }
    ]
  }
};

export default nextConfig;
