
import { CalculationResult, InsuranceRates, EmploymentType, CalculationOptions } from '../types';
import { INSURANCE_TABLE, MAX_PENSION_STANDARD, MIN_PENSION_STANDARD, EMPLOYMENT_RATES } from './constants';
import { getTaxFromTable } from './taxData';

const roundSpecial = (amount: number): number => {
  const integerPart = Math.floor(amount);
  const fraction = amount - integerPart;
  if (fraction > 0.50000001) {
    return Math.ceil(amount);
  }
  return Math.floor(amount);
};

export const calculateInsurance = (
  salary: number, 
  age: number,
  employmentType: EmploymentType,
  dependents: number,
  options: CalculationOptions
): CalculationResult => {
  
  // 1. Determine Age Category
  let ageCategory: 'under40' | '40to64' | 'over64';
  if (age < 40) {
    ageCategory = 'under40';
  } else if (age >= 40 && age < 65) {
    ageCategory = '40to64';
  } else {
    ageCategory = 'over64';
  }

  // 2. Find Health Standard Remuneration
  let row = INSURANCE_TABLE.find(r => salary >= r.rangeMin && salary < r.rangeMax);
  if (!row && salary >= 1355000) {
    row = INSURANCE_TABLE[INSURANCE_TABLE.length - 1];
  }
  if (!row && salary < 63000) {
    row = INSURANCE_TABLE[0];
  }
  if (!row) {
    row = INSURANCE_TABLE[INSURANCE_TABLE.length - 1];
  }

  const healthStandard = row.standardMonthlyRemuneration;
  
  // 3. Determine Pension Standard Remuneration
  let pensionStandard = healthStandard;
  if (pensionStandard < MIN_PENSION_STANDARD) {
    pensionStandard = MIN_PENSION_STANDARD;
  }
  if (pensionStandard > MAX_PENSION_STANDARD) {
    pensionStandard = MAX_PENSION_STANDARD;
  }

  // 4. Social Insurance Calculations
  let healthRate = InsuranceRates.HEALTH_UNDER_40;
  if (ageCategory === '40to64') {
    healthRate = InsuranceRates.HEALTH_40_TO_64;
  }

  let totalHealth = 0;
  let employeeHealth = 0;
  let totalPension = 0;
  let employeePension = 0;

  if (options.enableSocial) {
    totalHealth = healthStandard * healthRate;
    employeeHealth = roundSpecial(healthStandard * healthRate / 2);
    
    totalPension = pensionStandard * InsuranceRates.PENSION;
    employeePension = roundSpecial(pensionStandard * InsuranceRates.PENSION / 2);
  }

  // 5. Employment Insurance Calculation
  const empRate = EMPLOYMENT_RATES[employmentType];
  let employeeEmployment = 0;

  if (options.enableEmployment) {
    // Rate depends on business type. Rounding: 0.50 down, 0.51 up (same as roundSpecial).
    employeeEmployment = roundSpecial(salary * empRate);
  }

  // 6. Withholding Income Tax Calculation
  // Taxable Base = Salary - (Health + Pension + Employment)
  let taxAmount = 0;
  
  if (options.enableTax) {
    const socialInsuranceTotal = employeeHealth + employeePension + employeeEmployment;
    const taxableIncomeForTax = Math.max(0, salary - socialInsuranceTotal);
    
    // Lookup Tax
    taxAmount = getTaxFromTable(taxableIncomeForTax, dependents);
    
    // Logic for dependents > 7 (Page 7 of PDF)
    // "Subtract 1610 yen per person exceeding 7"
    if (dependents > 7) {
      const extraDependents = dependents - 7;
      taxAmount = Math.max(0, taxAmount - (extraDependents * 1610));
    }
  }

  const totalDeduction = employeeHealth + employeePension + employeeEmployment + taxAmount;

  return {
    salaryInput: salary,
    standardRemuneration: healthStandard,
    standardRemunerationPension: pensionStandard,
    healthInsurance: {
      total: totalHealth,
      employee: employeeHealth,
      rate: healthRate
    },
    pensionInsurance: {
      total: totalPension,
      employee: employeePension,
      rate: InsuranceRates.PENSION
    },
    employmentInsurance: {
      employee: employeeEmployment,
      rate: empRate
    },
    incomeTax: {
      amount: taxAmount
    },
    totalDeduction: totalDeduction,
    netPayment: salary - totalDeduction,
    ageCategory,
    options
  };
};
