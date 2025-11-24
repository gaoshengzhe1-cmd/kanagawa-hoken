
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CalculatorState, EmploymentType, CalculationOptions } from '../types';
import { calculateInsurance } from '../services/insuranceService';

const initialState: CalculatorState = {
  salary: '',
  age: '',
  employmentType: EmploymentType.GENERAL,
  dependents: 0,
  options: {
    enableSocial: true,
    enableEmployment: true,
    enableTax: true,
  },
  result: null,
};

export const calculatorSlice = createSlice({
  name: 'calculator',
  initialState,
  reducers: {
    setSalary: (state, action: PayloadAction<number | ''>) => {
      state.salary = action.payload;
    },
    setAge: (state, action: PayloadAction<number | ''>) => {
      state.age = action.payload;
    },
    setEmploymentType: (state, action: PayloadAction<EmploymentType>) => {
      state.employmentType = action.payload;
    },
    setDependents: (state, action: PayloadAction<number>) => {
      state.dependents = action.payload;
    },
    toggleOption: (state, action: PayloadAction<keyof CalculationOptions>) => {
      state.options[action.payload] = !state.options[action.payload];
    },
    calculate: (state) => {
      if (
        state.salary !== '' && typeof state.salary === 'number' &&
        state.age !== '' && typeof state.age === 'number'
      ) {
        state.result = calculateInsurance(
          state.salary, 
          state.age,
          state.employmentType,
          state.dependents,
          state.options
        );
      }
    },
    reset: (state) => {
      state.salary = '';
      state.age = '';
      state.result = null;
    }
  },
});

export const { setSalary, setAge, setEmploymentType, setDependents, toggleOption, calculate, reset } = calculatorSlice.actions;
export default calculatorSlice.reducer;
