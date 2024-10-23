import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  outDir: 'bin',
  format: 'esm',
  platform: 'node',
  target: 'node16',

  clean: true,
  minify: true,
  treeshake: true,
  sourcemap: false,
  ignoreWatch: ['bin', 'package*.json', 'types'],
  external: ['chalk', 'ora', 'inquirer'],
});
