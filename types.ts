
export interface InsuranceTableRow {
  grade: number;
  pensionGrade?: number;
  standardMonthlyRemuneration: number;
  rangeMin: number;
  rangeMax: number;
}

export interface CalculationOptions {
  enableSocial: boolean;     // Health & Pension
  enableEmployment: boolean; // Employment Insurance
  enableTax: boolean;        // Income Tax
}

export interface CalculationResult {
  salaryInput: number;
  standardRemuneration: number;
  standardRemunerationPension: number;
  healthInsurance: {
    total: number;
    employee: number;
    rate: number;
  };
  pensionInsurance: {
    total: number;
    employee: number;
    rate: number;
  };
  employmentInsurance: {
    employee: number;
    rate: number;
  };
  incomeTax: {
    amount: number;
  };
  totalDeduction: number;
  netPayment: number; // Final take-home pay
  ageCategory: 'under40' | '40to64' | 'over64';
  options: CalculationOptions; // Store which options were used for this result
}

export enum InsuranceRates {
  HEALTH_UNDER_40 = 0.0992,
  HEALTH_40_TO_64 = 0.1151,
  PENSION = 0.18300,
}

export enum EmploymentType {
  GENERAL = 'general',      // 一般の事業 (5.5/1000)
  AGRICULTURE = 'agriculture', // 農林水産・清酒製造 (6.5/1000)
  CONSTRUCTION = 'construction' // 建設の事業 (6.5/1000)
}

// Redux State Types
export interface CalculatorState {
  salary: number | '';
  age: number | '';
  employmentType: EmploymentType;
  dependents: number;
  options: CalculationOptions;
  result: CalculationResult | null;
}
