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
import { TrendingUp, Clock, Target } from 'lucide-react';

const App: React.FC = () => {
  const [mode, setMode] = useState<CalculationMode>(CalculationMode.STANDARD);
  
  const [values, setValues] = useState<InputState>({
    initialValue: 1000,
    monthlyValue: 500,
    interestRate: 10,
    rateType: 'yearly',
    period: 10,
    periodType: 'years',
  });

  const [result, setResult] = useState<SimulationResult | null>(null);

  const handleInputChange = (field: keyof InputState, value: any) => {
    setValues(prev => ({ ...prev, [field]: value }));
  };

  const handleClear = () => {
    setValues({
      initialValue: 0,
      monthlyValue: 0,
      interestRate: 0,
      rateType: 'yearly',
      period: 0,
      periodType: 'years',
    });
    setResult(null);
  };

  const performCalculation = () => {
    let finalPeriodMonths = 0;
    let finalMonthlyValue = values.monthlyValue;

    if (mode === CalculationMode.TIME_TO_MILLION) {
      finalPeriodMonths = calculateMonthsToTarget(
        values.initialValue,
        values.monthlyValue,
        values.interestRate,
        values.rateType
      );
    } else if (mode === CalculationMode.CONTRIBUTION_TO_MILLION) {
      finalPeriodMonths = getMonths(values.period, values.periodType);
      finalMonthlyValue = calculateMonthlyContributionForTarget(
        values.initialValue,
        values.interestRate,
        values.rateType,
        values.period,
        values.periodType
      );
    } else {
      finalPeriodMonths = getMonths(values.period, values.periodType);
    }

    const simResult = calculateCompoundInterest(
      values.initialValue,
      finalMonthlyValue,
      values.interestRate,
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
    <div className="min-h-screen bg-gray-50 font-sans pb-12">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
             <div className="bg-primary-800 p-2 rounded-lg">
                <TrendingUp className="text-white w-6 h-6" />
             </div>
             <div>
                <h1 className="text-2xl font-bold text-gray-900">Calculadora do Milhão</h1>
                <p className="text-sm text-gray-500">Simulador Profissional de Juros Compostos</p>
             </div>
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
            <h2 className="text-2xl font-bold text-primary-900 mb-6">Resultado da Simulação</h2>
            
            {/* Top Banner Result */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 mb-8 text-center shadow-sm">
                {mode === CalculationMode.TIME_TO_MILLION ? (
                  <>
                    <p className="text-lg text-blue-800 font-medium mb-1">Você atingirá R$ 1 Milhão em</p>
                    <p className="text-3xl md:text-4xl font-bold text-primary-800">
                      {Math.floor(result.timeInMonths / 12)} anos e {result.timeInMonths % 12} meses
                    </p>
                  </>
                ) : mode === CalculationMode.CONTRIBUTION_TO_MILLION ? (
                   <>
                    <p className="text-lg text-blue-800 font-medium mb-1">Aporte Mensal Necessário</p>
                    <p className="text-3xl md:text-4xl font-bold text-primary-800">
                      {formatCurrency(result.monthlyData[0]?.invested || 0)}
                    </p>
                    <p className="text-sm text-blue-600 mt-2">Para atingir R$ 1 Milhão em {values.period} {values.periodType === 'years' ? 'anos' : 'meses'}</p>
                   </>
                ) : (
                  <>
                     <p className="text-lg text-blue-800 font-medium mb-1">Valor Total Acumulado</p>
                     <p className="text-3xl md:text-4xl font-bold text-primary-800">
                       {formatCurrency(result.totalAmount)}
                     </p>
                     <p className="text-sm text-blue-600 mt-2">
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
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-2">Total Investido</p>
                <p className="text-2xl md:text-3xl font-bold text-gray-800">{formatCurrency(result.totalInvested)}</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-2">Total em Juros</p>
                <p className="text-2xl md:text-3xl font-bold text-gray-800">{formatCurrency(result.totalInterest)}</p>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid lg:grid-cols-2 gap-8 mb-8">
               <CompositionChart data={result} />
               <div className="bg-green-50 rounded-xl border border-green-100 p-6 flex flex-col justify-center items-center text-center shadow-sm">
                  <p className="text-green-800 font-bold text-lg mb-2">Poder dos Juros Compostos</p>
                  <p className="text-5xl font-black text-green-600 mb-2">
                    {result.totalInvested > 0 ? ((result.totalInterest / result.totalInvested) * 100).toFixed(0) : 0}%
                  </p>
                  <p className="text-green-700 text-sm">de rentabilidade sobre o valor investido</p>
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

      <footer className="bg-white border-t border-gray-200 mt-12 py-8">
         <div className="max-w-5xl mx-auto px-4 text-center text-gray-500 text-sm">
            <p className="mb-2">© 2024 Calculadora Rumo ao Milhão. Todos os direitos reservados.</p>
            <p>Os resultados são simulações e não garantem rentabilidade futura. Investimentos envolvem riscos.</p>
         </div>
      </footer>
    </div>
  );
};

export default App;