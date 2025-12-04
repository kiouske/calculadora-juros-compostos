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
    <div className="mt-12 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div 
        className="p-6 flex items-center justify-between cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="text-lg font-bold text-primary-900">Detalhamento Anual</h3>
        <button className="text-gray-500">
            {isOpen ? <ChevronUp /> : <ChevronDown />}
        </button>
      </div>
      
      {isOpen && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 font-bold text-center">Ano</th>
                <th className="px-6 py-4 font-bold text-right text-gray-600">Investimento (Ano)</th>
                <th className="px-6 py-4 font-bold text-right text-gray-600">Juros (Ano)</th>
                <th className="px-6 py-4 font-bold text-right text-primary-900">Total Investido</th>
                <th className="px-6 py-4 font-bold text-right text-primary-900">Total Juros</th>
                <th className="px-6 py-4 font-bold text-right text-primary-900 bg-gray-50">Total Acumulado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.yearlyData.map((row) => (
                <tr key={row.year} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-center font-medium text-gray-900">{row.year}</td>
                  <td className="px-6 py-4 text-right text-gray-600">{formatCurrency(row.investedInYear)}</td>
                  <td className="px-6 py-4 text-right text-gray-600">{formatCurrency(row.interestInYear)}</td>
                  <td className="px-6 py-4 text-right font-medium text-gray-800">{formatCurrency(row.invested)}</td>
                  <td className="px-6 py-4 text-right font-medium text-gray-800">{formatCurrency(row.interest)}</td>
                  <td className="px-6 py-4 text-right font-bold text-primary-900 bg-gray-50/50">{formatCurrency(row.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
       {!isOpen && (
        <div className="px-6 py-4 text-center text-sm text-gray-500 italic">
          Clique para ver a tabela detalhada ano a ano.
        </div>
      )}
    </div>
  );
};