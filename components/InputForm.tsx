import React from 'react';
import { Calculator, Calendar, DollarSign, Percent } from 'lucide-react';
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
  const inputClass = "w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-gray-700 font-medium placeholder-gray-400";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1.5";
  const iconClass = "absolute left-3 top-3 h-5 w-5 text-gray-400 pointer-events-none";

  // Helper to format number as BRL currency string for display
  const formatCurrencyValue = (value: number) => {
    // Ensure value is treated as a number
    const num = Number(value);
    if (isNaN(num)) return '0,00';
    
    // Always format with 2 decimal places using PT-BR locale (comma for decimal, dot for thousands)
    return num.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  // Handles currency input changes (ATM style: digits fill from right to left)
  const handleCurrencyChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof InputState) => {
    // Remove all non-digit characters
    const rawValue = e.target.value.replace(/\D/g, '');
    
    // Convert to float (treat as cents)
    // Example: "1" -> 0.01, "100" -> 1.00, "1000" -> 10.00
    const floatValue = rawValue ? parseInt(rawValue, 10) / 100 : 0;
    
    onChange(field, floatValue);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof InputState) => {
    const val = parseFloat(e.target.value);
    onChange(field, isNaN(val) ? '' : val);
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-gray-100">
      <h2 className="text-2xl font-bold text-primary-800 mb-6 flex items-center gap-2">
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
            className="w-full pl-4 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-gray-900 font-semibold appearance-none cursor-pointer hover:bg-gray-100 transition-colors"
          >
            <option value={CalculationMode.STANDARD}>Simular Investimento Livre (R$)</option>
            <option value={CalculationMode.TIME_TO_MILLION}>Calcular prazo para atingir R$ 1 Milhão</option>
            <option value={CalculationMode.CONTRIBUTION_TO_MILLION}>Calcular aporte para atingir R$ 1 Milhão</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
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
                onChange={(e) => handleInputChange(e, 'interestRate')}
                className={`${inputClass} rounded-r-none border-r-0`}
                placeholder="0,00"
                step="0.1"
                min="0"
              />
            </div>
            <div className="bg-gray-50 border border-gray-300 border-l-0 rounded-r-lg px-2 flex items-center justify-center min-w-[80px]">
               <select
                  value={values.rateType}
                  onChange={(e) => onChange('rateType', e.target.value)}
                  className="bg-transparent border-none text-sm font-medium text-gray-600 outline-none cursor-pointer focus:ring-0 w-full text-center appearance-none py-2"
                >
                  <option value="yearly">anual</option>
                  <option value="monthly">mensal</option>
                </select>
            </div>
          </div>
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
              <div className="bg-gray-50 border border-gray-300 border-l-0 rounded-r-lg px-2 flex items-center justify-center min-w-[80px]">
                <select
                  value={values.periodType}
                  onChange={(e) => onChange('periodType', e.target.value)}
                  className="bg-transparent border-none text-sm font-medium text-gray-600 outline-none cursor-pointer focus:ring-0 w-full text-center appearance-none py-2"
                >
                  <option value="years">Anos</option>
                  <option value="months">Meses</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 flex items-center justify-between pt-6 border-t border-gray-100">
        <button
          onClick={onClear}
          className="text-gray-500 hover:text-gray-800 font-medium px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
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
