/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ENV_MOCK_APIS: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
