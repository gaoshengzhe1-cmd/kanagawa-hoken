import api from './axios';

interface HealthInsuranceResponse {
  employeeCost: {
    careCost: number;
    healthCostWithNoCare: number;
    pension: number;
    employmentInsurance: number;
    incomeTax: number;
  };
  employerCost: {
    careCost: number;
    healthCostWithNoCare: number;
    pension: number;
    employmentInsurance: number | null;
    incomeTax: number | null;
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
  private static readonly HEALTH_INSURANCE_URL = import.meta.env.VITE_HEALTH_INSURANCE_URL || '';
  private static readonly EMPLOYMENT_INSURANCE_URL = import.meta.env.VITE_EMPLOYMENT_INSURANCE_URL || '';
  private static readonly PENSION_INSURANCE_URL = import.meta.env.VITE_PENSION_INSURANCE_URL || '';

  /**
   * 获取健康保险数据
   */
  private static async getHealthInsurance(monthlySalary: number, age: number): Promise<HealthInsuranceResponse> {
    try {
      const response = await api.get<HealthInsuranceResponse>(
        `${this.HEALTH_INSURANCE_URL}/health-insurance/calculate`,
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
    try {
      const response = await api.get<EmploymentInsuranceResponse>(
        `${this.EMPLOYMENT_INSURANCE_URL}/employment-insurance/calculate`,
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
    try {
      const response = await api.get<PensionInsuranceResponse>(
        `${this.PENSION_INSURANCE_URL}/pension-insurance/calculate`,
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

      // 合并数据 - 健康保险服务现在返回所有数据
      return {
        employeeCost: {
          careCost: healthData.employeeCost.careCost,
          healthCostWithNoCare: healthData.employeeCost.healthCostWithNoCare,
          employmentInsurance: healthData.employeeCost.employmentInsurance,
          pension: healthData.employeeCost.pension,
          incomeTax: healthData.employeeCost.incomeTax
        },
        employerCost: {
          careCost: healthData.employerCost.careCost,
          healthCostWithNoCare: healthData.employerCost.healthCostWithNoCare,
          employmentInsurance: healthData.employerCost.employmentInsurance,
          pension: healthData.employerCost.pension,
          incomeTax: healthData.employerCost.incomeTax
        }
      };
    } catch (error) {
      console.error('获取社会保险数据失败:', error);
      throw error;
    }
  }
}
