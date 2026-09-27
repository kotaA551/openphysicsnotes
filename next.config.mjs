import path from 'path';
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Long, equation-heavy chapters need a bounded build concurrency.
  experimental: { cpus: 2, staticGenerationMaxConcurrency: 2 },
  staticPageGenerationTimeout: 180,
  webpack: config => { config.resolve.alias['@'] = path.resolve(process.cwd()); return config; },
};
export default nextConfig;
