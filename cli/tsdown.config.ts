import { defineConfig } from 'tsdown'
import pkg from "./package.json" assert {type: 'json'};

const moduleName = pkg.name.replace(/^@.*\//, "");
const author = pkg.author;

export default defineConfig({
  entry: 'src/cli.ts',
  format: 'cjs',
  outDir: 'lib',
  clean: true,
  sourcemap: true,
  external: ['blessed', 'commander', 'inquirer', 'node-fetch'],
  banner: {
    js: `#!/usr/bin/env node

/**
 * @license
 * author: ${author.name}
 * ${moduleName}.js v${pkg.version}
 * Released under the ${pkg.license} license.
 */
`
  }
})