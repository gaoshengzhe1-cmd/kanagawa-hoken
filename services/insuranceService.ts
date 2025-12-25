
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
    const socialInsuranceData = await ApiClient.getSocialInsurance(salary, age);
    const { employeeCost } = socialInsuranceData;
    
    // Apply dependent adjustment to income tax if enabled
    let taxAmount = options.enableTax && employeeCost.incomeTax !== null 
      ? employeeCost.incomeTax - (dependents > 7 ? (dependents - 7) * 1610 : 0)
      : 0;
    
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
