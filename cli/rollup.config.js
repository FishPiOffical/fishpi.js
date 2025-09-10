import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import pkg from "./package.json" assert {type: 'json'};

const moduleName = pkg.name.replace(/^@.*\//, "");
const fileName = "src/cli.ts";
const author = pkg.author;
const banner = `
/**
 * @license
 * author: ${author.name}
 * ${moduleName}.js v${pkg.version}
 * Released under the ${pkg.license} license.
 */
`;


export default [
  {
    input: fileName,
    output: [
      {
        file: pkg.bin.fishpi,
        format: 'cjs',
        sourcemap: true,
        banner: `#!/usr/bin/env node
${banner}`,
        exports: 'named'
      }
    ],
    plugins: [
      json(),
      resolve(),
      commonjs(),
      typescript({ tsconfig: './tsconfig.json' })
    ],
    external: [
      ...Object.keys(pkg.dependencies || {}),
    ]
  },
];