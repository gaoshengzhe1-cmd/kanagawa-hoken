interface ApiConfig {
  healthInsuranceUrl: string;
  employmentInsuranceUrl: string;
  pensionInsuranceUrl: string;
}

export const getApiConfig = (): ApiConfig => ({
  healthInsuranceUrl: import.meta.env.VITE_HEALTH_INSURANCE_URL || 'https://social-insurance-service-519997578960.asia-northeast1.run.app',
  employmentInsuranceUrl: import.meta.env.VITE_EMPLOYMENT_INSURANCE_URL || 'https://employment-insurance-service-519997578960.asia-northeast1.run.app',
  pensionInsuranceUrl: import.meta.env.VITE_PENSION_INSURANCE_URL || 'https://pension-insurance-service-519997578960.asia-northeast1.run.app'
});
