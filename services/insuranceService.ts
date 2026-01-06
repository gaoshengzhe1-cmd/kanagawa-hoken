
import { ApiClient } from '../src/api/ApiClient';
import { EmploymentType, CalculationOptions, CalculationResult } from '../types';

export const calculateInsurance = async (
  salary: number, 
  age: number,
  employmentType: EmploymentType,
  dependents: number,
  options: CalculationOptions
): Promise<CalculationResult> => {
  try {
    // 1. 先获取社保数据
    const socialInsuranceData = await ApiClient.getSocialInsurance(salary, age);
    const { employeeCost } = socialInsuranceData;
    
    // 2. 计算社保等扣除项总额（不包括税）
    const socialInsuranceDeductions = 
      (options.enableSocial ? (employeeCost.healthCostWithNoCare + (employeeCost.careCost || 0) + employeeCost.pension) : 0) +
      (options.enableEmployment ? (employeeCost.employmentInsurance || 0) : 0);
    
    // 3. 计算扣除社保后的金额
    const afterSocialInsurance = salary - socialInsuranceDeductions;
    
    // 4. 用扣除社保后的金额去查询源泉所得税
    let taxAmount = 0;
    if (options.enableTax) {
      try {
        // Call the API to get the tax for the taxable income
        const taxData = await ApiClient.getSocialInsurance(afterSocialInsurance, age);
        taxAmount = taxData.employeeCost.incomeTax || 0;
        
        // Apply dependent adjustment if applicable
        if (dependents > 7) {
          taxAmount = Math.max(0, taxAmount - ((dependents - 7) * 1610));
        }
      } catch (error) {
        console.error('Failed to calculate withholding tax:', error);
        // Fallback to original calculation if API call fails
        taxAmount = employeeCost.incomeTax !== null 
          ? employeeCost.incomeTax - (dependents > 7 ? (dependents - 7) * 1610 : 0) 
          : 0;
      }
    }
    
    const healthInsurance = {
      total: employeeCost.healthCostWithNoCare + (employeeCost.careCost || 0),
      employee: employeeCost.healthCostWithNoCare + (employeeCost.careCost || 0),
      rate: 0
    };

    const pensionInsurance = {
      total: employeeCost.pension * 2,
      employee: employeeCost.pension,
      rate: 0
    };

    // Calculate total deductions based on enabled options
    const totalDeduction = 
      (options.enableSocial ? (healthInsurance.employee + pensionInsurance.employee) : 0) +
      (options.enableEmployment ? employeeCost.employmentInsurance || 0 : 0) +
      (options.enableTax ? Math.max(0, taxAmount) : 0);

    return {
      salaryInput: salary,
      standardRemuneration: 0,
      standardRemunerationPension: 0,
      healthInsurance,
      pensionInsurance,
      employmentInsurance: {
        employee: employeeCost.employmentInsurance || 0,
        rate: 0 // Rate not provided by API
      },
      incomeTax: {
        amount: taxAmount
      },
      totalDeduction,
      netPayment: salary - totalDeduction,
      ageCategory: age < 40 ? 'under40' : (age < 65 ? '40to64' : 'over64'),
      options
    };
  } catch (error) {
    console.error('Failed to calculate insurance:', error);
    throw new Error('保険料の計算に失敗しました。後でもう一度お試しください。');
  }
};
