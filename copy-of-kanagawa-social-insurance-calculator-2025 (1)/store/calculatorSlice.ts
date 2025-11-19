import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CalculatorState } from '../types';
import { calculateInsurance } from '../services/insuranceService';

const initialState: CalculatorState = {
  salary: '',
  age: '',
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
    calculate: (state) => {
      if (
        state.salary !== '' && typeof state.salary === 'number' &&
        state.age !== '' && typeof state.age === 'number'
      ) {
        state.result = calculateInsurance(state.salary, state.age);
      }
    },
    reset: (state) => {
      state.salary = '';
      state.age = '';
      state.result = null;
    }
  },
});

export const { setSalary, setAge, calculate, reset } = calculatorSlice.actions;
export default calculatorSlice.reducer;