import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import ts from 'typescript';

// Evaluate our small server-only TypeScript modules in memory, without a build,
// emitted files, a Next server or an additional test runner dependency.
export function typescriptLoader(root = process.cwd()) {
  const cache = new Map();
  function load(relative) {
    let filename = path.resolve(root, relative);
    if (!path.extname(filename)) filename += '.ts';
    if (cache.has(filename)) return cache.get(filename).exports;
    const module = { exports: {} };
    cache.set(filename, module);
    const nativeRequire = createRequire(filename);
    const require = specifier => {
      if (specifier.startsWith('@/')) return load(specifier.slice(2));
      if (specifier.startsWith('.') && !path.extname(specifier)) return load(path.resolve(path.dirname(filename), specifier));
      return nativeRequire(specifier);
    };
    const { outputText } = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
      fileName: filename,
    });
    new Function('require', 'module', 'exports', outputText)(require, module, module.exports);
    return module.exports;
  }
  return load;
}
