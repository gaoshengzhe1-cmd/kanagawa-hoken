import api from './axios';
import { getCachedApiConfig } from '../config/api-config';

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
    const config = await getCachedApiConfig();
    try {
      const response = await api.get<HealthInsuranceResponse>(
        `${config.healthInsuranceUrl}/health-insurance/calculate`,
        { params: { monthlySalary, age } }
      );
      return response.data;
    } catch (error) {
      console.error('获取健康保险数据失败:', error);
      throw error;
    }
  }

  /**
   * 获取雇佣保险数据
   */
  private static async getEmploymentInsurance(monthlySalary: number): Promise<EmploymentInsuranceResponse> {
    const config = await getCachedApiConfig();
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
    const config = await getCachedApiConfig();
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
      // 并行调用所有服务
      const [healthData, employmentData, pensionData] = await Promise.all([
        this.getHealthInsurance(monthlySalary, age),
        this.getEmploymentInsurance(monthlySalary),
        this.getPensionInsurance(monthlySalary)
      ]);

      // 合并数据 - 从各个服务获取对应数据
      return {
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
    } catch (error) {
      console.error('获取社会保险数据失败:', error);
      throw error;
    }
  }
}
