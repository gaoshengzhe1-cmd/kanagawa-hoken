interface ApiConfig {
  healthInsuranceUrl: string;
  employmentInsuranceUrl: string;
  pensionInsuranceUrl: string;
}

export const getApiConfig = (): ApiConfig => ({
  healthInsuranceUrl: import.meta.env.VITE_HEALTH_INSURANCE_URL || 'https://your-cloudrun-health-service-xxxx.a.run.app',
  employmentInsuranceUrl: import.meta.env.VITE_EMPLOYMENT_INSURANCE_URL || 'https://your-cloudrun-employment-service-xxxx.a.run.app',
  pensionInsuranceUrl: import.meta.env.VITE_PENSION_INSURANCE_URL || 'https://your-cloudrun-pension-service-xxxx.a.run.app'
});
