import axios from 'axios';

const api = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10秒超时
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    console.log('发送请求:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('请求拦截器错误:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    console.log('收到响应:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('响应拦截器错误:', error);
    
    // 详细检查CORS错误
    if (error.message.includes('CORS')) {
      console.error('CORS错误 - 跨域请求被阻止');
    }
    
    if (error.message.includes('Network Error')) {
      console.error('网络错误 - 可能是CORS或服务不可达');
    }
    
    if (error.code === 'ECONNABORTED') {
      console.error('请求超时');
    }
    
    // 打印完整的错误对象
    console.error('完整错误信息:', JSON.stringify(error, null, 2));
    
    return Promise.reject(error);
  }
);

export default api;
