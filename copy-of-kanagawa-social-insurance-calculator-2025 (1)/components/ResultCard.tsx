import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Shield, Banknote, ArrowRight, Info } from 'lucide-react';

export const ResultCard: React.FC = () => {
  const { result } = useSelector((state: RootState) => state.calculator);

  if (!result) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-12 text-gray-400">
        <Info className="w-12 h-12 mb-3 opacity-30" />
        <p className="text-lg font-medium">情報を入力して計算ボタンを押してください</p>
        <p className="text-sm">ここに計算結果が表示されます</p>
      </div>
    );
  }

  const formatYen = (num: number) => {
    return new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(num);
  };

  const chartData = [
    { name: '手取り（目安）', value: result.netPaymentBeforeTax, color: '#3b82f6' }, // Blue
    { name: '健康保険', value: result.healthInsurance.employee, color: '#ef4444' }, // Red
    { name: '厚生年金', value: result.pensionInsurance.employee, color: '#f59e0b' }, // Amber
  ];

  return (
    <div className="space-y-6">
      {/* Main Summary Card - Bootstrap Card Style */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-white p-6 border-b border-gray-100">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-4">計算結果サマリー</h3>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <p className="text-gray-500 text-sm mb-1">入力された給与月額</p>
              <p className="text-2xl font-bold text-gray-900">{formatYen(result.salaryInput)}</p>
            </div>
            <ArrowRight className="hidden md:block text-gray-300 mb-3" />
            <div className="text-right">
              <p className="text-blue-600 font-bold text-sm mb-1">差引支給額 (税引前手取り)</p>
              <p className="text-4xl font-extrabold text-blue-600">{formatYen(result.netPaymentBeforeTax)}</p>
            </div>
          </div>
        </div>

        {/* Standard Remuneration Detail */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex flex-col gap-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">適用された標準報酬月額 (健康保険)</span>
            <span className="font-mono font-bold text-gray-800">{formatYen(result.standardRemuneration)}</span>
          </div>
          {result.standardRemuneration !== result.standardRemunerationPension && (
            <div className="flex justify-between text-amber-700">
              <span className="text-amber-700">適用された標準報酬月額 (厚生年金)</span>
              <span className="font-mono font-bold">{formatYen(result.standardRemunerationPension)}</span>
            </div>
          )}
        </div>

        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Breakdown */}
            <div className="space-y-4">
              <h4 className="font-bold text-gray-700 text-sm border-l-4 border-blue-500 pl-3">控除額の内訳（自己負担分）</h4>
              
              {/* Health Item */}
              <div className="flex justify-between items-center p-3 bg-red-50 rounded border border-red-100">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-red-500" />
                  <div>
                    <div className="font-bold text-gray-800 text-sm">健康保険料</div>
                    <div className="text-xs text-gray-500">
                       料率 {(result.healthInsurance.rate * 100).toFixed(2)}% (折半)
                    </div>
                  </div>
                </div>
                <div className="font-bold text-red-600 text-lg">
                  -{formatYen(result.healthInsurance.employee)}
                </div>
              </div>

              {/* Pension Item */}
              <div className="flex justify-between items-center p-3 bg-amber-50 rounded border border-amber-100">
                <div className="flex items-center gap-3">
                  <Banknote className="w-5 h-5 text-amber-500" />
                  <div>
                    <div className="font-bold text-gray-800 text-sm">厚生年金保険料</div>
                    <div className="text-xs text-gray-500">
                       料率 18.30% (折半)
                    </div>
                  </div>
                </div>
                <div className="font-bold text-amber-600 text-lg">
                  -{formatYen(result.pensionInsurance.employee)}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                <span className="font-bold text-gray-700">社会保険料 合計</span>
                <span className="font-bold text-gray-900 text-xl">-{formatYen(result.totalDeduction)}</span>
              </div>
            </div>

            {/* Chart */}
            <div className="h-64 w-full relative">
               <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => formatYen(value)} />
                    <Legend verticalAlign="bottom" />
                  </PieChart>
               </ResponsiveContainer>
               <div className="absolute inset-0 flex items-center justify-center pointer-events-none pb-8">
                 <div className="text-center">
                   <p className="text-xs text-gray-400">支払総額</p>
                   <p className="text-sm font-bold text-gray-600">{formatYen(result.salaryInput)}</p>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800">
        <h5 className="font-bold flex items-center gap-2 mb-1">
          <Info className="w-4 h-4" />
          端数処理について
        </h5>
        <p className="opacity-90 text-xs leading-relaxed">
          被保険者負担分の端数が50銭以下の場合は切り捨て、50銭を超える場合は切り上げて計算しています。
          （子ども・子育て拠出金は事業主全額負担のため含まれていません。所得税・住民税は別途計算が必要です。）
        </p>
      </div>
    </div>
  );
};
