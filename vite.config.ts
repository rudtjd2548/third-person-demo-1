import { defineConfig, loadEnv, splitVendorChunkPlugin } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import viteCompression from 'vite-plugin-compression'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isProd = mode === 'github-actions-prod' || mode === 'github-actions-build'
  const { base, baseAssets } = getBasename(mode)
  process.env = {
    ...process.env,
    ...loadEnv(mode, process.cwd(), ''),
    BASE_URL: base,
    VITE_BASE_URL: base,
    VITE_BASE_ASSETS_URL: baseAssets,
  }

  return {
    base: baseAssets,
    server: {
      host: '0.0.0.0',
      port: 8081,
    },
    plugins: [
      react(),
      tsconfigPaths(),
      isProd && splitVendorChunkPlugin(),
      isProd && viteCompression(),
      isProd &&
        visualizer({
          filename: './dist/report.html',
          open: true,
          brotliSize: true,
        }),
    ],
    assetsInclude: ['**/*.glb', '**/*.usdz', '**/*.hdr', '**/*.exr', '**/*.ktx2'],
    build: {
      outDir: 'build',
      rollupOptions: {
        output: {
          entryFileNames: 'static/js/[name]-[hash].js',
          chunkFileNames: 'static/js/[name]-[hash].js',
          assetFileNames: (assetInfo) => {
            let extType = assetInfo.name.split('.').pop()
            if (/png|svg|jpe?g|ico|gif|hdr|exr|ktx2/i.test(extType)) {
              extType = 'media/images'
            } else if (/glb|usdz/i.test(extType)) {
              extType = 'media/models'
            } else if (/mp3|wav/i.test(extType)) {
              extType = 'media/sounds'
            } else if (/mov|mp4|webm/i.test(extType)) {
              extType = 'media/videos'
            } else if (/woff|woff2|eot|ttf|otf/i.test(extType)) {
              extType = 'media/fonts'
            } else if (/json/i.test(extType)) {
              extType = 'media/json'
            } else if (/tflite/i.test(extType)) {
              extType = 'media/tflite'
            }
            return `static/${extType}/[name]-[hash][extname]`
          },
        },
      },
    },
  }
})

// 개발 모드에 따라 basename 을 리턴
function getBasename(mode) {
  switch (mode) {
    case 'demo':
      return {
        base: '/react/tonttu/',
        baseAssets: '/react/tonttu/',
      }
    case 'github-actions-build':
      return {
        base: '/',
        baseAssets: '/',
      }
    case 'github-actions-prod':
      return {
        base: '/',
        baseAssets: '/',
      }
    default:
      return {
        base: '/',
        baseAssets: '/',
      }
  }
}
