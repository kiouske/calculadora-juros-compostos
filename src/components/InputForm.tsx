import React, { useState } from 'react';
import { Calculator, Calendar, DollarSign, Percent, AlertCircle } from 'lucide-react';
import { CalculationMode, InputState } from '../types';

interface InputFormProps {
  mode: CalculationMode;
  setMode: (mode: CalculationMode) => void;
  values: InputState;
  onChange: (field: keyof InputState, value: any) => void;
  onCalculate: () => void;
  onClear: () => void;
}

export const InputForm: React.FC<InputFormProps> = ({
  mode,
  setMode,
  values,
  onChange,
  onCalculate,
  onClear
}) => {
  const [interestError, setInterestError] = useState<string | null>(null);

  const inputClass = "w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-gray-700 dark:text-gray-100 font-medium placeholder-gray-400 dark:placeholder-gray-500";
  const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5";
  const iconClass = "absolute left-3 top-3 h-5 w-5 text-gray-400 dark:text-gray-500 pointer-events-none";

  // Helper to format number as BRL currency string for display
  const formatCurrencyValue = (value: number | '') => {
    if (value === '') return '';
    // Always format with 2 decimal places
    return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  // Handles currency input changes (e.g. typing 100 becomes 1,00)
  const handleCurrencyChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof InputState) => {
    // Get raw digits only
    const rawValue = e.target.value.replace(/\D/g, '');
    
    if (rawValue === '') {
      onChange(field, '');
      return;
    }

    // Treat as cents (divide by 100)
    const floatValue = parseInt(rawValue, 10) / 100;
    
    onChange(field, floatValue);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof InputState) => {
    if (e.target.value === '') {
      onChange(field, '');
      return;
    }
    const val = parseFloat(e.target.value);
    onChange(field, isNaN(val) ? '' : val);
  };

  const handleInterestRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === '') {
      setInterestError(null);
      onChange('interestRate', '');
      return;
    }
    const val = parseFloat(e.target.value);
    
    if (val < 0) {
      setInterestError('A taxa de juros não pode ser negativa.');
      return;
    }
    
    setInterestError(null);
    onChange('interestRate', isNaN(val) ? '' : val);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 transition-colors duration-200">
      <h2 className="text-2xl font-bold text-primary-800 dark:text-gray-100 mb-6 flex items-center gap-2">
        <Calculator className="w-7 h-7" />
        Simulador Financeiro
      </h2>

      {/* Mode Selector */}
      <div className="mb-8">
        <label className={labelClass}>O que você deseja calcular?</label>
        <div className="relative">
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value as CalculationMode)}
            className="w-full pl-4 pr-10 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-gray-900 dark:text-gray-100 font-semibold appearance-none cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
          >
            <option value={CalculationMode.STANDARD}>Simular Investimento Livre (R$)</option>
            <option value={CalculationMode.TIME_TO_MILLION}>Calcular prazo para atingir R$ 1 Milhão</option>
            <option value={CalculationMode.CONTRIBUTION_TO_MILLION}>Calcular aporte para atingir R$ 1 Milhão</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Initial Value */}
        <div className={mode === CalculationMode.TIME_TO_MILLION ? 'col-span-1' : ''}>
          <label className={labelClass}>Valor Inicial</label>
          <div className="relative group">
            <DollarSign className={iconClass} />
            <input
              type="text"
              inputMode="numeric"
              value={formatCurrencyValue(values.initialValue)}
              onChange={(e) => handleCurrencyChange(e, 'initialValue')}
              className={inputClass}
              placeholder="0,00"
            />
          </div>
        </div>

        {/* Monthly Value */}
        {mode !== CalculationMode.CONTRIBUTION_TO_MILLION && (
          <div>
            <label className={labelClass}>Valor Mensal</label>
            <div className="relative group">
              <DollarSign className={iconClass} />
              <input
                type="text"
                inputMode="numeric"
                value={formatCurrencyValue(values.monthlyValue)}
                onChange={(e) => handleCurrencyChange(e, 'monthlyValue')}
                className={inputClass}
                placeholder="0,00"
              />
            </div>
          </div>
        )}

        {/* Interest Rate */}
        <div>
          <label className={labelClass}>Taxa de Juros</label>
          <div className="flex">
            <div className="relative flex-1 group z-10">
              <Percent className={iconClass} />
              <input
                type="number"
                value={values.interestRate}
                onChange={handleInterestRateChange}
                className={`${inputClass} rounded-r-none border-r-0 ${interestError ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
                placeholder="0,00"
                step="0.1"
                min="0"
              />
            </div>
            <div className={`bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 border-l-0 rounded-r-lg px-2 flex items-center justify-center min-w-[80px] ${interestError ? 'border-red-500' : ''}`}>
               <select
                  value={values.rateType}
                  onChange={(e) => onChange('rateType', e.target.value)}
                  className="bg-transparent border-none text-sm font-medium text-gray-600 dark:text-gray-300 outline-none cursor-pointer focus:ring-0 w-full text-center appearance-none py-2"
                >
                  <option value="yearly">anual</option>
                  <option value="monthly">mensal</option>
                </select>
            </div>
          </div>
          {interestError && (
            <div className="flex items-center gap-1 mt-1 text-red-500 text-xs">
              <AlertCircle className="w-3 h-3" />
              <span>{interestError}</span>
            </div>
          )}
        </div>

        {/* Period */}
        {mode !== CalculationMode.TIME_TO_MILLION && (
          <div>
            <label className={labelClass}>Tempo</label>
            <div className="flex">
              <div className="relative flex-1 group z-10">
                <Calendar className={iconClass} />
                <input
                  type="number"
                  value={values.period}
                  onChange={(e) => handleInputChange(e, 'period')}
                  className={`${inputClass} rounded-r-none border-r-0`}
                  placeholder="0"
                  min="1"
                />
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 border-l-0 rounded-r-lg px-2 flex items-center justify-center min-w-[80px]">
                <select
                  value={values.periodType}
                  onChange={(e) => onChange('periodType', e.target.value)}
                  className="bg-transparent border-none text-sm font-medium text-gray-600 dark:text-gray-300 outline-none cursor-pointer focus:ring-0 w-full text-center appearance-none py-2"
                >
                  <option value="years">anos</option>
                  <option value="months">meses</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 flex items-center justify-between pt-6 border-t border-gray-100 dark:border-gray-700">
        <button
          onClick={() => {
            setInterestError(null);
            onClear();
          }}
          className="bg-[#F4D03F] hover:brightness-95 text-primary-900 px-8 py-3 rounded-lg font-bold shadow-lg shadow-yellow-500/20 transition-all duration-200 transform hover:scale-105"
        >
          Limpar campos
        </button>
        <button
          onClick={onCalculate}
          className="bg-primary-800 hover:bg-primary-900 text-white px-8 py-3 rounded-lg font-bold shadow-lg shadow-primary-900/20 transform hover:-translate-y-0.5 transition-all duration-200"
        >
          Calcular Agora
        </button>
      </div>
    </div>
  );
};