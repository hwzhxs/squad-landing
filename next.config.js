/** @type {import('next').NextConfig} */
const isProd = process.env.NEXT_PUBLIC_BASE_PATH === '/squad-landing';

const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  basePath: isProd ? '/squad-landing' : '',
  assetPrefix: isProd ? '/squad-landing/' : '',
};

module.exports = nextConfig;
