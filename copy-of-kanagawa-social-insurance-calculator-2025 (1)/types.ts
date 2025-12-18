export interface InsuranceTableRow {
  grade: number;
  pensionGrade?: number;
  standardMonthlyRemuneration: number;
  rangeMin: number;
  rangeMax: number;
}

export interface InsuranceCost {
  total: number;
  employee: number;
  rate: number;
}

export interface CalculationResult {
  salaryInput: number;
  standardRemuneration: number;
  standardRemunerationPension: number;
  healthInsurance: InsuranceCost;
  pensionInsurance: InsuranceCost;
  nursingCareInsurance: InsuranceCost;
  employmentInsurance: InsuranceCost;
  incomeTax: InsuranceCost;
  totalDeduction: number;
  netPaymentBeforeTax: number;
  ageCategory: 'under40' | '40to64' | 'over64';
}

export enum InsuranceRates {
  HEALTH_UNDER_40 = 0.0992,
  HEALTH_40_TO_64 = 0.1151,
  PENSION = 0.18300,
}

// Redux State Types
export interface CalculatorState {
  salary: number | '';
  age: number | '';
  result: CalculationResult | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error?: string;
}