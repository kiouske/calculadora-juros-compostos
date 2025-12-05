import React, { useState } from 'react';
import { SimulationResult } from '../types';
import { formatCurrency } from '../utils/financial';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface Props {
  data: SimulationResult;
}

export const DataTable: React.FC<Props> = ({ data }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="mt-12 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors duration-200">
      <div 
        className="p-6 flex items-center justify-between cursor-pointer bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="text-lg font-bold text-primary-900 dark:text-white">Detalhamento Anual</h3>
        <button className="text-gray-500 dark:text-gray-400">
            {isOpen ? <ChevronUp /> : <ChevronDown />}
        </button>
      </div>
      
      {isOpen && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-700 dark:text-gray-300 uppercase bg-gray-100 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-6 py-4 font-bold text-center">Ano</th>
                <th className="px-6 py-4 font-bold text-right text-gray-600 dark:text-gray-400">Investimento (Ano)</th>
                <th className="px-6 py-4 font-bold text-right text-gray-600 dark:text-gray-400">Juros (Ano)</th>
                <th className="px-6 py-4 font-bold text-right text-primary-900 dark:text-gray-200">Total Investido</th>
                <th className="px-6 py-4 font-bold text-right text-primary-900 dark:text-gray-200">Total Juros</th>
                <th className="px-6 py-4 font-bold text-right text-primary-900 dark:text-gray-200 bg-gray-50 dark:bg-gray-800">Total Acumulado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {data.yearlyData.map((row) => (
                <tr key={row.year} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td className="px-6 py-4 text-center font-medium text-gray-900 dark:text-white">{row.year}</td>
                  <td className="px-6 py-4 text-right text-gray-600 dark:text-gray-300">{formatCurrency(row.investedInYear)}</td>
                  <td className="px-6 py-4 text-right text-gray-600 dark:text-gray-300">{formatCurrency(row.interestInYear)}</td>
                  <td className="px-6 py-4 text-right font-medium text-gray-800 dark:text-gray-200">{formatCurrency(row.invested)}</td>
                  <td className="px-6 py-4 text-right font-medium text-gray-800 dark:text-gray-200">{formatCurrency(row.interest)}</td>
                  <td className="px-6 py-4 text-right font-bold text-primary-900 dark:text-white bg-gray-50/50 dark:bg-gray-800/50">{formatCurrency(row.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
       {!isOpen && (
        <div className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400 italic">
          Clique para ver a tabela detalhada ano a ano.
        </div>
      )}
    </div>
  );
};