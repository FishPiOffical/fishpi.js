import { defineConfig } from 'tsdown'

export default defineConfig([
  {
    entry: ['src/index.ts'],
    format: ['esm', 'cjs'],
    dts: true,
    outDir: 'lib',
    clean: true,
    sourcemap: true,
    external: ['form-data', 'js-md5', 'reconnecting-websocket', 'tslib', 'ws', 'blessed', 'commander', 'inquirer', 'node-fetch']
  },
  {
    entry: 'src/index.ts',
    format: 'iife',
    outDir: 'lib',
    clean: false,
    minify: true,
    sourcemap: false,
    globalName: 'FishPi'
  }
])