
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
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
  status: 'idle',
  error: null
};

export const calculateInsuranceAsync = createAsyncThunk(
  'calculator/calculateInsurance',
  async (_, { getState }) => {
    const state = getState() as { calculator: CalculatorState };
    const { salary, age, employmentType, dependents, options } = state.calculator;
    
    if (salary === '' || age === '') {
      throw new Error('请填写工资和年龄');
    }

    return await calculateInsurance(
      Number(salary),
      Number(age),
      employmentType,
      dependents,
      options
    );
  }
);

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
    reset: (state) => {
      state.salary = '';
      state.age = '';
      state.result = null;
      state.status = 'idle';
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(calculateInsuranceAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(calculateInsuranceAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.result = action.payload;
      })
      .addCase(calculateInsuranceAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || '计算失败';
      });
  }
});

export const { 
  setSalary, 
  setAge, 
  setEmploymentType, 
  setDependents, 
  toggleOption, 
  reset 
} = calculatorSlice.actions;

export default calculatorSlice.reducer;
