import api from './axios';
import { getApiConfig } from '../config/api-config';

interface HealthInsuranceResponse {
  employeeCost: {
    careCost: number;
    healthCostWithNoCare: number;
    incomeTax: number;
  };
  employerCost: {
    careCost: number;
    healthCostWithNoCare: number;
    incomeTax: number;
  };
}

interface EmploymentInsuranceResponse {
  employeeCost: {
    employmentInsurance: number;
  };
  employerCost: {
    employmentInsurance: number | null;
  };
}

interface PensionInsuranceResponse {
  employeeCost: {
    pension: number;
  };
  employerCost: {
    pension: number;
  };
}

export interface EmployeeCost {
  careCost: number;
  employmentInsurance: number | null;
  healthCostWithNoCare: number;
  incomeTax: number | null;
  pension: number;
}

export interface EmployerCost {
  careCost: number;
  employmentInsurance: number | null;
  healthCostWithNoCare: number;
  incomeTax: number | null;
  pension: number;
}

export interface SocialInsuranceDTO {
  employeeCost: EmployeeCost;
  employerCost: EmployerCost;
}

export class ApiClient {
  /**
   * 获取健康保险数据
   */
  private static async getHealthInsurance(monthlySalary: number, age: number): Promise<HealthInsuranceResponse> {
    const config = getApiConfig();
    const url = `${config.healthInsuranceUrl}/health-insurance/calculate`;
    console.log('请求URL:', url);
    console.log('请求参数:', { monthlySalary, age });
    
    try {
      const response = await api.get<HealthInsuranceResponse>(
        url,
        { 
          params: { 
            monthlySalary: Math.round(monthlySalary), 
            age: Math.round(age) 
          } 
        }
      );
      console.log('响应数据:', response.data);
      return response.data;
    } catch (error) {
      console.error('获取健康保险数据失败:', error);
      if (error instanceof Error) {
        console.error('错误详情:', error.message);
        console.error('错误堆栈:', error.stack);
      }
      throw error;
    }
  }

  /**
   * 获取雇佣保险数据
   */
  private static async getEmploymentInsurance(monthlySalary: number): Promise<EmploymentInsuranceResponse> {
    const config = getApiConfig();
    try {
      const response = await api.get<EmploymentInsuranceResponse>(
        `${config.employmentInsuranceUrl}/employment-insurance/calculate`,
        { params: { monthlySalary } }
      );
      return response.data;
    } catch (error) {
      console.error('获取雇佣保险数据失败:', error);
      throw error;
    }
  }

  /**
   * 获取厚生年金数据
   */
  private static async getPensionInsurance(monthlySalary: number): Promise<PensionInsuranceResponse> {
    const config = getApiConfig();
    try {
      const response = await api.get<PensionInsuranceResponse>(
        `${config.pensionInsuranceUrl}/pension-insurance/calculate`,
        { params: { monthlySalary } }
      );
      return response.data;
    } catch (error) {
      console.error('获取厚生年金数据失败:', error);
      throw error;
    }
  }

  /**
   * 获取所有社会保险数据
   * @param monthlySalary 月薪
   * @param age 年龄
   * @returns 合并后的社会保险数据
   */
  static async getSocialInsurance(monthlySalary: number, age: number): Promise<SocialInsuranceDTO> {
    try {
      console.log('开始获取社会保险数据...');
      
      // 第一步：获取健康保险数据
      console.log('正在获取健康保险数据...');
      const healthData = await this.getHealthInsurance(monthlySalary, age);
      console.log('健康保险数据获取成功:', healthData);
      
      // 第二步：获取雇佣保险数据
      console.log('正在获取雇佣保险数据...');
      const employmentData = await this.getEmploymentInsurance(monthlySalary);
      console.log('雇佣保险数据获取成功:', employmentData);
      
      // 第三步：获取厚生年金数据
      console.log('正在获取厚生年金数据...');
      const pensionData = await this.getPensionInsurance(monthlySalary);
      console.log('厚生年金数据获取成功:', pensionData);
      
      // 所有数据获取成功，开始组合
      console.log('开始组合所有数据...');
      const result = {
        employeeCost: {
          careCost: healthData.employeeCost.careCost,
          healthCostWithNoCare: healthData.employeeCost.healthCostWithNoCare,
          employmentInsurance: employmentData.employeeCost.employmentInsurance,
          pension: pensionData.employeeCost.pension,
          incomeTax: healthData.employeeCost.incomeTax
        },
        employerCost: {
          careCost: healthData.employerCost.careCost,
          healthCostWithNoCare: healthData.employerCost.healthCostWithNoCare,
          employmentInsurance: employmentData.employerCost.employmentInsurance ?? null,
          pension: pensionData.employerCost.pension,
          incomeTax: healthData.employerCost.incomeTax
        }
      };
      
      console.log('数据组合完成:', result);
      return result;
    } catch (error) {
      console.error('获取社会保险数据失败:', error);
      throw error;
    }
  }
}
