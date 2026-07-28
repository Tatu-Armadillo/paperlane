/// <reference types="vite/client" />

// Tipagem mínima para as variáveis do Vite usadas no frontend.
// Mantém `VITE_API_URL`/`VITE_APP_NAME` opcionais para evitar erros quando não estiverem definidas.
interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  readonly VITE_APP_NAME?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}