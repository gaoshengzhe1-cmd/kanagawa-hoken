// Cloud Run 配置服务示例
// 这个文件应该部署在你的 Cloud Run 服务中

/**
 * Cloud Run 配置端点示例
 * GET /api/config
 */
app.get('/api/config', (req, res) => {
  // 从 Cloud Run 环境变量获取配置
  const config = {
    healthInsuranceUrl: process.env.HEALTH_INSURANCE_URL,
    employmentInsuranceUrl: process.env.EMPLOYMENT_INSURANCE_URL,
    pensionInsuranceUrl: process.env.PENSION_INSURANCE_URL
  };
  
  res.json(config);
});

// 或者使用 Cloud Run 的配置管理
app.get('/api/config', async (req, res) => {
  try {
    // 从 Cloud Run 配置服务或 Secret Manager 获取
    const config = await fetchFromCloudConfig();
    res.json(config);
  } catch (error) {
    res.status(500).json({ error: '配置获取失败' });
  }
});
