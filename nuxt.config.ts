/// <reference types="@vite-pwa/nuxt" />
/* eslint-disable */
import { defineNuxtConfig } from 'nuxt/config'

// Sube una vez para limpiar caches runtime si está pegado
const CACHE_VER = 'v13'

// Revisión única por build (cambia sola en cada build)
const BUILD_REV = String(Date.now())

export default defineNuxtConfig({
  ssr: false,

  app: {
    head: {
      title: 'Notas Rápidas',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#facc15' },
        { name: 'description', content: 'Tus notas rápidas siempre a mano, incluso sin conexión.' },
        // marcador del build para herramientas/puentes de update
        { name: 'x-build', content: BUILD_REV }
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/icon-192.png' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' }
      ]
    }
  },

  css: ['@/assets/css/main.css'],
  postcss: { plugins: { tailwindcss: {}, autoprefixer: {} } },

  modules: ['@pinia/nuxt', '@vite-pwa/nuxt'],
  devtools: { enabled: true },

  pwa: {
    registerType: 'autoUpdate',

    manifest: {
      name: 'Notas Rápidas',
      short_name: 'Notas',
      description: 'Toma notas rápidas incluso sin conexión.',
      theme_color: '#facc15',
      background_color: '#ffffff',
      display: 'standalone',
      scope: '/',
      // 👇 clave para iOS: cambiamos la URL de arranque en cada build
      start_url: '/?v=' + BUILD_REV,
      icons: [
        { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
        { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
        { src: '/maskable-192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
        { src: '/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        { src: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
      ]
    },

    workbox: {
      clientsClaim: true,
      skipWaiting: true,
      cleanupOutdatedCaches: true,

      // Precacha HTML + assets (incluye woff2) para cold start offline
      globPatterns: ['**/*.{html,js,css,png,svg,ico,json,woff2}'],

      // 👇 Precarga explícita del shell en ambas URLs
      additionalManifestEntries: [
        { url: '/', revision: BUILD_REV },
        { url: '/index.html', revision: BUILD_REV },
        { url: '/?v=' + BUILD_REV, revision: BUILD_REV }
      ],

      // iOS tratará el start_url con ?v=..., y el SW debe ignorar ese parámetro al resolver caché
      // para que navigateFallback y el precache funcionen igual
      ignoreURLParametersMatching: [/^v$/, /^__check_build__$/],

      runtimeCaching: [
        // Navegaciones HTML → NetworkFirst con fallback a cache
        {
          urlPattern: ({ request }: { request: Request }) => request.mode === 'navigate',
          handler: 'NetworkFirst',
          options: {
            cacheName: `html-cache-${CACHE_VER}`,
            networkTimeoutSeconds: 3,
            matchOptions: { ignoreSearch: true }
          }
        },
        // Meta de builds de Nuxt (detectar builds nuevos)
        {
          urlPattern: /\/_nuxt\/builds\/meta\/.*\.json$/,
          handler: 'StaleWhileRevalidate',
          options: { cacheName: `nuxt-meta-${CACHE_VER}` }
        },
        // Bundles/CSS de Nuxt → NetworkFirst (agarra lo nuevo si hay red)
        {
          urlPattern: /\/_nuxt\/.*\.(?:js|css|json)$/,
          handler: 'NetworkFirst',
          options: {
            cacheName: `assets-cache-${CACHE_VER}`,
            networkTimeoutSeconds: 3
          }
        },
        // Iconos
        {
          urlPattern: /\/(icon-(192|512)|maskable-(192|512)|apple-touch-icon)\.png$/,
          handler: 'CacheFirst',
          options: { cacheName: `icons-cache-${CACHE_VER}` }
        },
        // Fuentes locales
        {
          urlPattern: /\/fonts\/.*\.(?:woff2)$/,
          handler: 'CacheFirst',
          options: {
            cacheName: `font-cache-${CACHE_VER}`,
            expiration: { maxEntries: 16, maxAgeSeconds: 60 * 60 * 24 * 365 },
            cacheableResponse: { statuses: [0, 200] }
          }
        }
      ],

      // Fallback para SPA
      navigateFallback: '/'
    },

    devOptions: { enabled: false },
    client: { installPrompt: true }
  },

  typescript: { strict: true },
  nitro: { preset: 'node-server' }
})

