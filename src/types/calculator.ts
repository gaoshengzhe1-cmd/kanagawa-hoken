export type EmploymentType = 'regular' | 'contractor' | 'part_time' | 'executive';

export interface RangeValue {
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
    amount: number;
    rate: number;
  };
  welfarePension: {
    amount: number;
    rate: number;
  };
  employmentInsurance: {
    amount: number;
    rate: number;
  };
  incomeTax: number;
  residentTax: number;
  totalDeductions: number;
  netSalary: number;
  takeHomePay: number;
  takeHomeRate: number;
  calculationDate: string;
}

export interface CalculatorState {
  salary: number | '';
  age: number | '';
  employmentType: EmploymentType;
  dependents: number;
  options: CalculationOptions;
  result: CalculationResult | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}
