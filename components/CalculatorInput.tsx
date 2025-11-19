import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { setSalary, setAge, calculate } from '../store/calculatorSlice';
import { Calculator, Info, User } from 'lucide-react';

export const CalculatorInput: React.FC = () => {
  const dispatch = useDispatch();
  const { salary, age } = useSelector((state: RootState) => state.calculator);

  const handleSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === '') {
      dispatch(setSalary(''));
      return;
    }
    // Remove commas and non-numeric chars
    const num = parseInt(val.replace(/[^\d]/g, ''), 10);
    if (!isNaN(num)) {
      dispatch(setSalary(num));
    }
  };

  const handleAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === '') {
      dispatch(setAge(''));
      return;
    }
    const num = parseInt(val.replace(/[^\d]/g, ''), 10);
    if (!isNaN(num) && num >= 0 && num < 150) {
      dispatch(setAge(num));
    }
  };

  const handleCalculate = () => {
    dispatch(calculate());
  };

  const getAgeCategoryInfo = (age: number | '') => {
    if (age === '') return null;
    if (age < 40) return { label: '40歳未満', desc: '介護保険料の徴収はありません', color: 'text-blue-600' };
    if (age < 65) return { label: '40歳〜64歳', desc: '介護保険料が含まれます（9.92% → 11.51%）', color: 'text-orange-600' };
    return { label: '65歳以上', desc: '原則、介護保険料は年金から天引きされます', color: 'text-green-600' };
  };

  const ageInfo = getAgeCategoryInfo(age);

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-bold text-gray-700 flex items-center gap-2">
          <Calculator className="text-blue-600 w-5 h-5" />
          条件入力
        </h2>
      </div>

      <div className="p-6 space-y-6">
        {/* Salary Input */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            給与月額（総支給額）
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold">¥</span>
            <input
              type="text"
              inputMode="numeric"
              value={salary ? salary.toLocaleString() : ''}
              onChange={handleSalaryChange}
              placeholder="例: 300,000"
              className="w-full pl-8 pr-4 py-3 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-lg text-gray-900 placeholder-gray-400"
            />
          </div>
          <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
            <Info className="w-3 h-3" />
            基本給、残業代、各種手当を含む税引前の総額
          </p>
        </div>

        {/* Age Input */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            年齢
          </label>
          <div className="relative">
             <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <User className="w-5 h-5" />
            </span>
            <input 
              type="text"
              inputMode="numeric"
              value={age}
              onChange={handleAgeChange}
              placeholder="例: 35"
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-lg text-gray-900 placeholder-gray-400"
            />
             <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold">歳</span>
          </div>

          {/* Dynamic Age Category Feedback */}
          <div className={`mt-3 p-3 rounded border text-sm transition-all duration-300 ${ageInfo ? 'opacity-100' : 'opacity-0 invisible'}`}>
             {ageInfo && (
               <div className="flex flex-col">
                 <span className={`font-bold ${ageInfo.color}`}>{ageInfo.label}</span>
                 <span className="text-gray-500 text-xs mt-1">{ageInfo.desc}</span>
               </div>
             )}
          </div>
        </div>

        <button
          onClick={handleCalculate}
          disabled={!salary || age === ''}
          className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold rounded-md shadow-sm transition-colors text-base flex justify-center items-center gap-2"
        >
          <Calculator className="w-5 h-5" />
          保険料を計算する
        </button>
      </div>
    </div>
  );
};