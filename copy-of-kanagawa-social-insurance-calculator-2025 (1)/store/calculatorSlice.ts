import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { CalculatorState } from '../types';
import { ApiClient } from '../src/api/ApiClient';

const initialState: CalculatorState = {
  salary: '',
  age: '',
  result: null,
  status: 'idle',
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
    reset: (state) => {
      state.salary = '';
      state.age = '';
      state.result = null;
      state.error = undefined;
      state.status = 'idle';
    },
    clearError: (state) => {
      state.error = undefined;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(calculateInsurance.pending, (state) => {
        state.status = 'loading';
        state.error = undefined;
      })
      .addCase(calculateInsurance.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const { employeeCost, employerCost } = action.payload;
        
        state.result = {
          salaryInput: state.salary as number,
          standardRemuneration: 0, // Not used in the API response
          standardRemunerationPension: 0, // Not used in the API response
          healthInsurance: {
            total: employeeCost.healthCostWithNoCare + (employerCost?.healthCostWithNoCare || 0),
            employee: employeeCost.healthCostWithNoCare,
            rate: 0 // Not used in the API response
          },
          pensionInsurance: {
            total: employeeCost.pension + (employerCost?.pension || 0),
            employee: employeeCost.pension,
            rate: 0 // Not used in the API response
          },
          nursingCareInsurance: {
            total: employeeCost.careCost + (employerCost?.careCost || 0),
            employee: employeeCost.careCost,
            rate: 0 // Not used in the API response
          },
          employmentInsurance: {
            total: employeeCost.employmentInsurance || 0,
            employee: employeeCost.employmentInsurance || 0,
            rate: 0
          },
          incomeTax: {
            total: employeeCost.incomeTax || 0,
            employee: employeeCost.incomeTax || 0,
            rate: 0
          },
          totalDeduction: employeeCost.healthCostWithNoCare + 
                         employeeCost.careCost + 
                         employeeCost.pension +
                         (employeeCost.employmentInsurance || 0) +
                         (employeeCost.incomeTax || 0),
          netPaymentBeforeTax: (state.salary as number) - 
                             (employeeCost.healthCostWithNoCare + 
                              employeeCost.careCost + 
                              employeeCost.pension +
                              (employeeCost.employmentInsurance || 0) +
                              (employeeCost.incomeTax || 0)),
          ageCategory: (state.age as number) < 40 ? 'under40' : 
                      (state.age as number) < 65 ? '40to64' : 'over64'
        };
      })
      .addCase(calculateInsurance.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

// Async thunk for calculating insurance
export const calculateInsurance = createAsyncThunk(
  'calculator/calculateInsurance',
  async ({ salary, age }: { salary: number; age: number }, { rejectWithValue }) => {
    try {
      const result = await ApiClient.getSocialInsurance(salary, age);
      return result;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to calculate insurance');
    }
  }
);

export const { setSalary, setAge, reset, clearError } = calculatorSlice.actions;
export default calculatorSlice.reducer;