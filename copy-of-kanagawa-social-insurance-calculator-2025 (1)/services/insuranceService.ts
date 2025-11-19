import { CalculationResult, InsuranceRates } from '../types';
import { INSURANCE_TABLE, MAX_PENSION_STANDARD, MIN_PENSION_STANDARD } from './constants';

/**
 * Special rounding logic for Japanese Social Insurance.
 * "Fraction <= 0.50 round down, > 0.50 round up"
 * This equates to: 
 * 0.50 -> 0
 * 0.51 -> 1
 */
const roundSpecial = (amount: number): number => {
  const integerPart = Math.floor(amount);
  const fraction = amount - integerPart;
  
  // Using a small epsilon for float comparison stability
  if (fraction > 0.50000001) {
    return Math.ceil(amount);
  }
  return Math.floor(amount);
};

export const calculateInsurance = (
  salary: number, 
  age: number
): CalculationResult => {
  
  // Determine Age Category
  let ageCategory: 'under40' | '40to64' | 'over64';
  if (age < 40) {
    ageCategory = 'under40';
  } else if (age >= 40 && age < 65) {
    ageCategory = '40to64';
  } else {
    ageCategory = 'over64';
  }

  // 1. Find Health Standard Remuneration
  let row = INSURANCE_TABLE.find(r => salary >= r.rangeMin && salary < r.rangeMax);
  
  // Handle upper bound (Grade 50)
  if (!row && salary >= 1355000) {
    row = INSURANCE_TABLE[INSURANCE_TABLE.length - 1];
  }
  
  // Handle lower bound (Grade 1)
  if (!row && salary < 63000) {
    row = INSURANCE_TABLE[0];
  }

  if (!row) {
    row = INSURANCE_TABLE[INSURANCE_TABLE.length - 1];
  }

  const healthStandard = row.standardMonthlyRemuneration;
  
  // 2. Determine Pension Standard Remuneration
  // Pension has a floor of 88,000 (Grade 1 Pension) and Cap of 650,000 (Grade 32 Pension)
  // If health standard is below 88,000, Pension is usually stuck at 88,000.
  let pensionStandard = healthStandard;
  if (pensionStandard < MIN_PENSION_STANDARD) {
    pensionStandard = MIN_PENSION_STANDARD;
  }
  if (pensionStandard > MAX_PENSION_STANDARD) {
    pensionStandard = MAX_PENSION_STANDARD;
  }

  // 3. Determine Rates
  let healthRate = InsuranceRates.HEALTH_UNDER_40;
  if (ageCategory === '40to64') {
    healthRate = InsuranceRates.HEALTH_40_TO_64;
  }
  // Over 64 typically follows Under 40 (No nursing care deduction from salary usually)
  // But strictly, if they are "Secondary Insured" (40-64), they pay. 
  // If 65+, nursing care is deducted from pension. 
  // So we use the "No Nursing Care" rate for over 64 in this context.

  // 4. Calculate Amounts
  // The rate is the TOTAL rate. The employee pays HALF.
  // Formula: RoundSpecial(Standard * Rate / 2)
  
  // Health
  const totalHealth = healthStandard * healthRate;
  // The split calculation:
  const employeeHealth = roundSpecial(healthStandard * healthRate / 2);
  
  // Pension
  const totalPension = pensionStandard * InsuranceRates.PENSION;
  const employeePension = roundSpecial(pensionStandard * InsuranceRates.PENSION / 2);

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
    totalDeduction: employeeHealth + employeePension,
    netPaymentBeforeTax: salary - (employeeHealth + employeePension),
    ageCategory
  };
};