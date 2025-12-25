import api from './axios';

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
   * 获取社会保险数据
   * @param monthlySalary 月薪
   * @param age 年龄
   * @returns 社会保险数据
   */
  static async getSocialInsurance(monthlySalary: number, age: number): Promise<SocialInsuranceDTO> {
    try {
      const response = await api.get<SocialInsuranceDTO>('/socialInsuranceQuery', {
        params: {
          monthlySalary,
          age
        }
      });
      return response.data;
    } catch (error) {
      console.error('获取社会保险数据失败:', error);
      throw error;
    }
  }
}
