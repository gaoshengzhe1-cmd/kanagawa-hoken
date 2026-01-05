/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_HEALTH_INSURANCE_URL: string
  readonly VITE_EMPLOYMENT_INSURANCE_URL: string
  readonly VITE_PENSION_INSURANCE_URL: string
  // 在这里添加更多的环境变量类型...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
