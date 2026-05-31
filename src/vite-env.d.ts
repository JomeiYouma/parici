/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Désactive l'UI de recherche IA si "false". */
  readonly VITE_AI_ENABLED?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
