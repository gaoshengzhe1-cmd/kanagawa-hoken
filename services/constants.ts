
import { EmploymentType } from '../types';

// Employment Insurance Rates (Worker Share) for Reiwa 7 (2025)
// Source: MHLW Reiwa 7 Rates
export const EMPLOYMENT_RATES = {
  [EmploymentType.GENERAL]: 0.0055,      // 5.5/1000
  [EmploymentType.AGRICULTURE]: 0.0065,  // 6.5/1000
  [EmploymentType.CONSTRUCTION]: 0.0065, // 6.5/1000
};
