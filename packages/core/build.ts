import * as esbuild from 'esbuild';

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
      bundle: true,
      minify: true,
      target: 'es2017',
      sourcemap: true,
    });
  }),
).catch((e) => {
  console.error(e);
  process.exit(1);
});
