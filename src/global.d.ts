// src/global.d.ts
declare module 'leaflet/dist/leaflet.css'

interface ImportMetaEnv {
  readonly VITE_GEMINI_API_KEY?: string
  readonly VITE_GEMINI_MODEL?: string
  readonly VITE_GEOAPIFY_API_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
