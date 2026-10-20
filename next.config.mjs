import path from 'path';
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optional local static-export evaluation; normal Next builds stay available.
  ...(process.env.OPN_STATIC_EXPORT === '1'
    ? { output: 'export', images: { unoptimized: true } }
    : {}),
  // Isolate checks/previews from an already running development server.
  distDir: process.env.NEXT_BUILD_DIR || '.next',
  // Long, equation-heavy chapters need a bounded build concurrency.
  experimental: { cpus: 2, staticGenerationMaxConcurrency: 2 },
  staticPageGenerationTimeout: 180,
  webpack: config => { config.resolve.alias['@'] = path.resolve(process.cwd()); return config; },
};
export default nextConfig;
