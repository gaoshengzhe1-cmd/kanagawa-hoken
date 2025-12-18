
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { setSalary, setAge, setEmploymentType, setDependents, toggleOption, calculateInsuranceAsync } from '../store/calculatorSlice';
import { Calculator, Info, User, Briefcase, Users, Shield, HardHat, FileText, CheckCircle } from 'lucide-react';
import { EmploymentType, CalculationOptions } from '../types';

interface OptionCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  checked: boolean;
  onChange: () => void;
  colorClass: string;
}

const OptionCard: React.FC<OptionCardProps> = ({ icon: Icon, title, description, checked, onChange, colorClass }) => (
  <div 
    onClick={onChange}
    className={`
      relative cursor-pointer rounded-lg border-2 p-4 transition-all duration-200 flex flex-col gap-2 h-full
      ${checked 
        ? `border-${colorClass}-500 bg-${colorClass}-50 shadow-sm` 
        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
      }
    `}
  >
    <div className="flex justify-between items-start">
      <div className={`p-2 rounded-full ${checked ? `bg-${colorClass}-100 text-${colorClass}-600` : 'bg-gray-100 text-gray-500'}`}>
        <Icon className="w-5 h-5" />
      </div>
      {checked && <CheckCircle className={`w-5 h-5 text-${colorClass}-500`} />}
    </div>
    
    <div>
      <h3 className={`font-bold text-sm ${checked ? 'text-gray-800' : 'text-gray-500'}`}>{title}</h3>
      <p className="text-xs text-gray-400 mt-1 leading-tight">{description}</p>
    </div>
  </div>
);

export const CalculatorInput: React.FC = () => {
  const dispatch = useDispatch();
  const { salary, age, employmentType, dependents, options } = useSelector((state: RootState) => state.calculator);

  const handleSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === '') {
      dispatch(setSalary(''));
      return;
    }
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

  const handleDependentsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setDependents(parseInt(e.target.value, 10)));
  };

  const handleEmploymentTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setEmploymentType(e.target.value as EmploymentType));
  };

  const handleCalculate = () => {
    dispatch(calculateInsuranceAsync() as any);
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
          <div className={`mt-2 text-sm transition-all duration-300 ${ageInfo ? 'opacity-100' : 'opacity-0 invisible'}`}>
             {ageInfo && (
               <div className="flex flex-col bg-gray-50 p-2 rounded">
                 <span className={`font-bold ${ageInfo.color}`}>{ageInfo.label}</span>
                 <span className="text-gray-500 text-xs mt-1">{ageInfo.desc}</span>
               </div>
             )}
          </div>
        </div>
        
        {/* Calculation Options Cards */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-3">
            計算対象の選択
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <OptionCard 
              icon={Shield}
              title="社会保険"
              description="健康保険・厚生年金"
              checked={options.enableSocial}
              onChange={() => dispatch(toggleOption('enableSocial'))}
              colorClass="blue"
            />
            <OptionCard 
              icon={HardHat}
              title="雇用保険"
              description="事業区分による料率"
              checked={options.enableEmployment}
              onChange={() => dispatch(toggleOption('enableEmployment'))}
              colorClass="emerald"
            />
            <OptionCard 
              icon={FileText}
              title="所得税"
              description="源泉徴収税額表"
              checked={options.enableTax}
              onChange={() => dispatch(toggleOption('enableTax'))}
              colorClass="indigo"
            />
          </div>
        </div>

        {/* Employment Type - Only show if Employment Insurance is enabled */}
        {options.enableEmployment && (
          <div className="animate-fade-in">
            <label className="block text-sm font-bold text-gray-700 mb-2">
              事業の種類（雇用保険）
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Briefcase className="w-5 h-5" />
              </span>
              <select
                value={employmentType}
                onChange={handleEmploymentTypeChange}
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-base text-gray-900"
              >
                <option value={EmploymentType.GENERAL}>一般の事業 (5.5/1000)</option>
                <option value={EmploymentType.AGRICULTURE}>農林水産・清酒製造 (6.5/1000)</option>
                <option value={EmploymentType.CONSTRUCTION}>建設の事業 (6.5/1000)</option>
              </select>
            </div>
          </div>
        )}

        {/* Dependents - Only show if Tax is enabled */}
        {options.enableTax && (
          <div className="animate-fade-in">
            <label className="block text-sm font-bold text-gray-700 mb-2">
              扶養親族等の数（源泉徴収税）
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Users className="w-5 h-5" />
              </span>
              <select
                value={dependents}
                onChange={handleDependentsChange}
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-base text-gray-900"
              >
                {[...Array(11)].map((_, i) => (
                  <option key={i} value={i}>{i} 人{i >= 7 ? ' (以上)' : ''}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        <button
          onClick={handleCalculate}
          disabled={!salary || age === ''}
          className="w-full py-4 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 text-lg flex justify-center items-center gap-2 mt-4"
        >
          <Calculator className="w-6 h-6" />
          計算する
        </button>
      </div>
    </div>
  );
};
