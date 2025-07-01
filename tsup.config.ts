import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  outDir: 'bin',
  format: 'esm',
  platform: 'node',
  target: 'node16',

  clean: true,
  treeshake: true,
  sourcemap: false,
  minify: 'terser',
  terserOptions: { compress: { drop_console: true, drop_debugger: true } },
  ignoreWatch: ['bin', 'package*.json', 'types'],
  external: ['chalk', 'ora', 'inquirer'],
});
