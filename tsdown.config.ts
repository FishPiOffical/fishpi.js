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
    platform: 'browser',
    clean: false,
    minify: true,
    sourcemap: false,
    globalName: 'FishPi',
    noExternal: ['js-md5', 'reconnecting-websocket']
  },
  {
    entry: 'src/index.ts',
    format: 'esm',
    outDir: 'lib/browser',
    platform: 'browser',
    clean: false,
    define: {
      __BROWSER__: 'true'
    },
    external: ['js-md5', 'reconnecting-websocket']
  }
])