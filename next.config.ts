/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true, // هذا سيتجاوز فحص الأمان ومعالجة الصور في بيئة التطوير
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
        pathname: '/storage/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/storage/**',
      },
    ],
  },
};

export default nextConfig;
import('@opennextjs/cloudflare').then(m => m.initOpenNextCloudflareForDev());
