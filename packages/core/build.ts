import * as esbuild from 'esbuild';
import { dtsPlugin } from 'esbuild-plugin-d.ts';

const tasks: Array<esbuild.BuildOptions> = [
  {
    entryPoints: ['src/main.ts'],
    outfile: 'dist/main.cjs',
    platform: 'node',
  },
  {
    entryPoints: ['src/main.ts'],
    outfile: 'dist/main.mjs',
    platform: 'browser',
  },
];

Promise.all(
  tasks.map((task) => {
    return esbuild.build({
      ...task,
      external: ['axios'],
      bundle: true,
      minify: true,
      target: 'es2017',
      sourcemap: true,
      plugins: [dtsPlugin()],
    });
  }),
).catch((e) => {
  console.error(e);
  process.exit(1);
});
