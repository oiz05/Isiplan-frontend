// src/global.d.ts
declare module 'leaflet/dist/leaflet.css'

interface ImportMetaEnv {
  readonly VITE_GEOAPIFY_API_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
