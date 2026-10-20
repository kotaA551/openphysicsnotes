import { spawnSync } from 'node:child_process';
const env = { ...process.env, OPN_STATIC_EXPORT: '1' };
delete env.OPN_COMPARE_SAMPLE;
delete env.NEXT_BUILD_DIR;
const result = spawnSync(process.execPath, ['node_modules/next/dist/bin/next', 'build'], { env, stdio: 'inherit' });
if (result.error) throw result.error;
process.exit(result.status ?? 1);
