import React, { useState, useEffect } from 'react';
import { CalculationMode, InputState, SimulationResult } from './types';
import { 
  calculateCompoundInterest, 
  calculateMonthsToTarget, 
  calculateMonthlyContributionForTarget,
  formatCurrency, 
  getMonths 
} from './utils/financial';
import { InputForm } from './components/InputForm';
import { EvolutionChart, CompositionChart } from './components/Charts';
import { DataTable } from './components/DataTable';
import { InfoSection } from './components/InfoSection';
import { TrendingUp, Sun, Moon } from 'lucide-react';

const App: React.FC = () => {
  const [mode, setMode] = useState<CalculationMode>(CalculationMode.STANDARD);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' ||
        (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });
  
  const [values, setValues] = useState<InputState>({
    initialValue: '',
    monthlyValue: '',
    interestRate: '',
    rateType: 'yearly',
    period: '',
    periodType: 'years',
  });

  const [result, setResult] = useState<SimulationResult | null>(null);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleInputChange = (field: keyof InputState, value: any) => {
    setValues(prev => ({ ...prev, [field]: value }));
  };

  const handleClear = () => {
    setValues({
      initialValue: '',
      monthlyValue: '',
      interestRate: '',
      rateType: 'yearly',
      period: '',
      periodType: 'years',
    });
    setResult(null);
  };

  const performCalculation = () => {
    // Validation Logic
    if (values.interestRate === '') {
      alert('Por favor, preencha a Taxa de Juros.');
      return;
    }

    if (mode === CalculationMode.STANDARD) {
      if (values.initialValue === '' || values.monthlyValue === '' || values.period === '') {
        alert('Por favor, preencha todos os campos (Valor Inicial, Mensal e Tempo) para realizar a simulação.');
        return;
      }
    } else if (mode === CalculationMode.TIME_TO_MILLION) {
      if (values.initialValue === '' || values.monthlyValue === '') {
        alert('Por favor, preencha o Valor Inicial e o Valor Mensal.');
        return;
      }
      if (Number(values.initialValue) <= 0 && Number(values.monthlyValue) <= 0) {
         alert('Para calcular o prazo, é necessário informar um Valor Inicial ou um Valor Mensal maior que zero.');
         return;
      }
    } else if (mode === CalculationMode.CONTRIBUTION_TO_MILLION) {
      if (values.initialValue === '' || values.period === '') {
        alert('Por favor, preencha o Valor Inicial e o Tempo.');
        return;
      }
      if (Number(values.period) <= 0) {
        alert('O tempo deve ser maior que zero para calcular o aporte necessário.');
        return;
      }
    }

    // Convert inputs to numbers, treating empty strings as 0
    const initialVal = Number(values.initialValue);
    const monthlyVal = Number(values.monthlyValue);
    const interestVal = Number(values.interestRate);
    const periodVal = Number(values.period);

    let finalPeriodMonths = 0;
    let finalMonthlyValue = monthlyVal;

    if (mode === CalculationMode.TIME_TO_MILLION) {
      finalPeriodMonths = calculateMonthsToTarget(
        initialVal,
        monthlyVal,
        interestVal,
        values.rateType
      );
    } else if (mode === CalculationMode.CONTRIBUTION_TO_MILLION) {
      finalPeriodMonths = getMonths(periodVal, values.periodType);
      finalMonthlyValue = calculateMonthlyContributionForTarget(
        initialVal,
        interestVal,
        values.rateType,
        periodVal,
        values.periodType
      );
    } else {
      finalPeriodMonths = getMonths(periodVal, values.periodType);
    }

    const simResult = calculateCompoundInterest(
      initialVal,
      finalMonthlyValue,
      interestVal,
      values.rateType,
      finalPeriodMonths,
      'months' // Pass as months because we already converted
    );

    setResult(simResult);
  };

  // When mode changes, reset result but keep values (mostly)
  useEffect(() => {
    setResult(null);
  }, [mode]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans pb-12 transition-colors duration-200">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between gap-3">
             <div className="flex items-center gap-3">
               <div className="bg-primary-800 p-2 rounded-lg">
                  <TrendingUp className="text-white w-6 h-6" />
               </div>
               <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Calculadora do Milhão</h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Simulador Profissional de Juros Compostos</p>
               </div>
             </div>
             
             <button 
               onClick={toggleTheme}
               className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
               aria-label="Alternar tema"
             >
               {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
             </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <InputForm 
          mode={mode} 
          setMode={setMode} 
          values={values} 
          onChange={handleInputChange} 
          onCalculate={performCalculation}
          onClear={handleClear}
        />

        {result && (
          <div className="mt-8 animate-fade-in-up">
            <h2 className="text-2xl font-bold text-primary-900 dark:text-white mb-6">Resultado da Simulação</h2>
            
            {/* Top Banner Result */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl p-6 mb-8 text-center shadow-sm">
                {mode === CalculationMode.TIME_TO_MILLION ? (
                  <>
                    <p className="text-lg text-blue-800 dark:text-blue-200 font-medium mb-1">Você atingirá R$ 1 Milhão em</p>
                    <p className="text-3xl md:text-4xl font-bold text-primary-800 dark:text-white">
                      {Math.floor(result.timeInMonths / 12)} anos e {result.timeInMonths % 12} meses
                    </p>
                  </>
                ) : mode === CalculationMode.CONTRIBUTION_TO_MILLION ? (
                   <>
                    <p className="text-lg text-blue-800 dark:text-blue-200 font-medium mb-1">Aporte Mensal Necessário</p>
                    <p className="text-3xl md:text-4xl font-bold text-primary-800 dark:text-white">
                      {formatCurrency(result.monthlyData[0]?.invested || 0)}
                    </p>
                    <p className="text-sm text-blue-600 dark:text-blue-300 mt-2">Para atingir R$ 1 Milhão em {values.period} {values.periodType === 'years' ? 'anos' : 'meses'}</p>
                   </>
                ) : (
                  <>
                     <p className="text-lg text-blue-800 dark:text-blue-200 font-medium mb-1">Valor Total Acumulado</p>
                     <p className="text-3xl md:text-4xl font-bold text-primary-800 dark:text-white">
                       {formatCurrency(result.totalAmount)}
                     </p>
                     <p className="text-sm text-blue-600 dark:text-blue-300 mt-2">
                       Em {Math.floor(result.timeInMonths / 12)} anos e {result.timeInMonths % 12} meses
                     </p>
                  </>
                )}
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-primary-900 text-white rounded-xl p-6 shadow-md">
                <p className="text-primary-100 text-sm font-semibold uppercase tracking-wider mb-2">Valor Total Final</p>
                <p className="text-2xl md:text-3xl font-bold">{formatCurrency(result.totalAmount)}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm">
                <p className="text-gray-500 dark:text-gray-400 text-sm font-semibold uppercase tracking-wider mb-2">Total Investido</p>
                <p className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100">{formatCurrency(result.totalInvested)}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm">
                <p className="text-gray-500 dark:text-gray-400 text-sm font-semibold uppercase tracking-wider mb-2">Total em Juros</p>
                <p className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100">{formatCurrency(result.totalInterest)}</p>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid lg:grid-cols-2 gap-8 mb-8">
               <CompositionChart data={result} />
               <div className="bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-100 dark:border-green-800 p-6 flex flex-col justify-center items-center text-center shadow-sm">
                  <p className="text-green-800 dark:text-green-200 font-bold text-lg mb-2">Poder dos Juros Compostos</p>
                  <p className="text-5xl font-black text-green-600 dark:text-green-400 mb-2">
                    {result.totalInvested > 0 ? ((result.totalInterest / result.totalInvested) * 100).toFixed(0) : 0}%
                  </p>
                  <p className="text-green-700 dark:text-green-300 text-sm">de rentabilidade sobre o valor investido</p>
               </div>
            </div>

            <div className="mb-8">
               <EvolutionChart data={result} />
            </div>

            <DataTable data={result} />
          </div>
        )}

        <InfoSection />
      </main>

      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-12 py-8 transition-colors duration-200">
         <div className="max-w-5xl mx-auto px-4 text-center text-gray-500 dark:text-gray-400 text-sm">
            <p className="mb-2">© {new Date().getFullYear()} Calculadora Rumo ao Milhão. Todos os direitos reservados.</p>
            <p>Os resultados são simulações e não garantem rentabilidade futura. Investimentos envolvem riscos.</p>
         </div>
      </footer>
    </div>
  );
};

export default App;