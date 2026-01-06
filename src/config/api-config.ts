interface ApiConfig {
  healthInsuranceUrl: string;
  employmentInsuranceUrl: string;
  pensionInsuranceUrl: string;
}

// 运行时从 Cloud Run 配置服务获取
export const getApiConfig = async (): Promise<ApiConfig> => {
  try {
    // 1. 优先从 Cloud Run 配置服务获取
    const configResponse = await fetch('/api/config');
    if (configResponse.ok) {
      const config = await configResponse.json();
      return config;
    }
  } catch (error) {
    console.warn('无法从远程获取配置，使用默认配置:', error);
  }

  // 2. 回退到环境变量或默认值
  return {
    healthInsuranceUrl: import.meta.env.VITE_HEALTH_INSURANCE_URL || 'http://localhost:3001',
    employmentInsuranceUrl: import.meta.env.VITE_EMPLOYMENT_INSURANCE_URL || 'http://localhost:3002',
    pensionInsuranceUrl: import.meta.env.VITE_PENSION_INSURANCE_URL || 'http://localhost:3003'
  };
};

// 缓存配置避免重复请求
let cachedConfig: ApiConfig | null = null;

export const getCachedApiConfig = async (): Promise<ApiConfig> => {
  if (cachedConfig) {
    return cachedConfig;
  }
  cachedConfig = await getApiConfig();
  return cachedConfig;
};
