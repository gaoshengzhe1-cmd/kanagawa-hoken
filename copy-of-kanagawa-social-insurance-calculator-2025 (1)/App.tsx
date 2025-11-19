import React from 'react';
import { CalculatorInput } from './components/CalculatorInput';
import { ResultCard } from './components/ResultCard';

const App: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-900">
      {/* Navigation Bar - Bootstrap style */}
      <nav className="bg-blue-700 text-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white text-blue-700 rounded-md flex items-center justify-center font-bold text-xl">
              〒
            </div>
            <h1 className="text-lg md:text-xl font-bold tracking-tight">
              社会保険料シミュレーター 2025 <span className="opacity-70 font-normal text-sm ml-2">神奈川県版 (令和7年3月分〜)</span>
            </h1>
          </div>
        </div>
      </nav>

      <main className="flex-grow container mx-auto px-4 py-8 max-w-5xl">
        <div className="grid md:grid-cols-12 gap-8 items-start">
          {/* Left Column: Input */}
          <div className="md:col-span-5 lg:col-span-4">
            <CalculatorInput />
            
            <div className="mt-6 text-xs text-gray-500 leading-relaxed px-2">
              <p>※この計算ツールは、全国健康保険協会（協会けんぽ）神奈川支部の令和7年3月分（4月納付分）からの保険料額表に基づいています。</p>
            </div>
          </div>

          {/* Right Column: Result */}
          <div className="md:col-span-7 lg:col-span-8">
            <ResultCard />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 border-t border-gray-200 mt-auto">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-gray-500">
          <p>© 2025 Kanagawa Social Insurance Calculator</p>
          <p className="text-xs mt-1">本シミュレーション結果は概算です。実際の控除額と異なる場合があります。</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
