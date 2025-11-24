
import { InsuranceTableRow, EmploymentType } from '../types';

// Data transcribed from Kanagawa Prefecture March 2025 (Reiwa 7)
export const INSURANCE_TABLE: InsuranceTableRow[] = [
  { grade: 1, standardMonthlyRemuneration: 58000, rangeMin: 0, rangeMax: 63000 },
  { grade: 2, standardMonthlyRemuneration: 68000, rangeMin: 63000, rangeMax: 73000 },
  { grade: 3, standardMonthlyRemuneration: 78000, rangeMin: 73000, rangeMax: 83000 },
  { grade: 4, pensionGrade: 1, standardMonthlyRemuneration: 88000, rangeMin: 83000, rangeMax: 93000 },
  { grade: 5, pensionGrade: 2, standardMonthlyRemuneration: 98000, rangeMin: 93000, rangeMax: 101000 },
  { grade: 6, pensionGrade: 3, standardMonthlyRemuneration: 104000, rangeMin: 101000, rangeMax: 107000 },
  { grade: 7, pensionGrade: 4, standardMonthlyRemuneration: 110000, rangeMin: 107000, rangeMax: 114000 },
  { grade: 8, pensionGrade: 5, standardMonthlyRemuneration: 118000, rangeMin: 114000, rangeMax: 122000 },
  { grade: 9, pensionGrade: 6, standardMonthlyRemuneration: 126000, rangeMin: 122000, rangeMax: 130000 },
  { grade: 10, pensionGrade: 7, standardMonthlyRemuneration: 134000, rangeMin: 130000, rangeMax: 138000 },
  { grade: 11, pensionGrade: 8, standardMonthlyRemuneration: 142000, rangeMin: 138000, rangeMax: 146000 },
  { grade: 12, pensionGrade: 9, standardMonthlyRemuneration: 150000, rangeMin: 146000, rangeMax: 155000 },
  { grade: 13, pensionGrade: 10, standardMonthlyRemuneration: 160000, rangeMin: 155000, rangeMax: 165000 },
  { grade: 14, pensionGrade: 11, standardMonthlyRemuneration: 170000, rangeMin: 165000, rangeMax: 175000 },
  { grade: 15, pensionGrade: 12, standardMonthlyRemuneration: 180000, rangeMin: 175000, rangeMax: 185000 },
  { grade: 16, pensionGrade: 13, standardMonthlyRemuneration: 190000, rangeMin: 185000, rangeMax: 195000 },
  { grade: 17, pensionGrade: 14, standardMonthlyRemuneration: 200000, rangeMin: 195000, rangeMax: 210000 },
  { grade: 18, pensionGrade: 15, standardMonthlyRemuneration: 220000, rangeMin: 210000, rangeMax: 230000 },
  { grade: 19, pensionGrade: 16, standardMonthlyRemuneration: 240000, rangeMin: 230000, rangeMax: 250000 },
  { grade: 20, pensionGrade: 17, standardMonthlyRemuneration: 260000, rangeMin: 250000, rangeMax: 270000 },
  { grade: 21, pensionGrade: 18, standardMonthlyRemuneration: 280000, rangeMin: 270000, rangeMax: 290000 },
  { grade: 22, pensionGrade: 19, standardMonthlyRemuneration: 300000, rangeMin: 290000, rangeMax: 310000 },
  { grade: 23, pensionGrade: 20, standardMonthlyRemuneration: 320000, rangeMin: 310000, rangeMax: 330000 },
  { grade: 24, pensionGrade: 21, standardMonthlyRemuneration: 340000, rangeMin: 330000, rangeMax: 350000 },
  { grade: 25, pensionGrade: 22, standardMonthlyRemuneration: 360000, rangeMin: 350000, rangeMax: 370000 },
  { grade: 26, pensionGrade: 23, standardMonthlyRemuneration: 380000, rangeMin: 370000, rangeMax: 395000 },
  { grade: 27, pensionGrade: 24, standardMonthlyRemuneration: 410000, rangeMin: 395000, rangeMax: 425000 },
  { grade: 28, pensionGrade: 25, standardMonthlyRemuneration: 440000, rangeMin: 425000, rangeMax: 455000 },
  { grade: 29, pensionGrade: 26, standardMonthlyRemuneration: 470000, rangeMin: 455000, rangeMax: 485000 },
  { grade: 30, pensionGrade: 27, standardMonthlyRemuneration: 500000, rangeMin: 485000, rangeMax: 515000 },
  { grade: 31, pensionGrade: 28, standardMonthlyRemuneration: 530000, rangeMin: 515000, rangeMax: 545000 },
  { grade: 32, pensionGrade: 29, standardMonthlyRemuneration: 560000, rangeMin: 545000, rangeMax: 575000 },
  { grade: 33, pensionGrade: 30, standardMonthlyRemuneration: 590000, rangeMin: 575000, rangeMax: 605000 },
  { grade: 34, pensionGrade: 31, standardMonthlyRemuneration: 620000, rangeMin: 605000, rangeMax: 635000 },
  { grade: 35, pensionGrade: 32, standardMonthlyRemuneration: 650000, rangeMin: 635000, rangeMax: 665000 },
  { grade: 36, standardMonthlyRemuneration: 680000, rangeMin: 665000, rangeMax: 695000 },
  { grade: 37, standardMonthlyRemuneration: 710000, rangeMin: 695000, rangeMax: 730000 },
  { grade: 38, standardMonthlyRemuneration: 750000, rangeMin: 730000, rangeMax: 770000 },
  { grade: 39, standardMonthlyRemuneration: 790000, rangeMin: 770000, rangeMax: 810000 },
  { grade: 40, standardMonthlyRemuneration: 830000, rangeMin: 810000, rangeMax: 855000 },
  { grade: 41, standardMonthlyRemuneration: 880000, rangeMin: 855000, rangeMax: 905000 },
  { grade: 42, standardMonthlyRemuneration: 930000, rangeMin: 905000, rangeMax: 955000 },
  { grade: 43, standardMonthlyRemuneration: 980000, rangeMin: 955000, rangeMax: 1005000 },
  { grade: 44, standardMonthlyRemuneration: 1030000, rangeMin: 1005000, rangeMax: 1055000 },
  { grade: 45, standardMonthlyRemuneration: 1090000, rangeMin: 1055000, rangeMax: 1115000 },
  { grade: 46, standardMonthlyRemuneration: 1150000, rangeMin: 1115000, rangeMax: 1175000 },
  { grade: 47, standardMonthlyRemuneration: 1210000, rangeMin: 1175000, rangeMax: 1235000 },
  { grade: 48, standardMonthlyRemuneration: 1270000, rangeMin: 1235000, rangeMax: 1295000 },
  { grade: 49, standardMonthlyRemuneration: 1330000, rangeMin: 1295000, rangeMax: 1355000 },
  { grade: 50, standardMonthlyRemuneration: 1390000, rangeMin: 1355000, rangeMax: Infinity },
];

export const MAX_PENSION_STANDARD = 650000; 
export const MIN_PENSION_STANDARD = 88000; 
export const MAX_HEALTH_STANDARD = 1390000; 
export const MIN_HEALTH_STANDARD = 58000;

// Employment Insurance Rates (Worker Share) for Reiwa 7 (2025)
// Source: MHLW Reiwa 7 Rates
export const EMPLOYMENT_RATES = {
  [EmploymentType.GENERAL]: 0.0055,      // 5.5/1000
  [EmploymentType.AGRICULTURE]: 0.0065,  // 6.5/1000
  [EmploymentType.CONSTRUCTION]: 0.0065, // 6.5/1000
};
