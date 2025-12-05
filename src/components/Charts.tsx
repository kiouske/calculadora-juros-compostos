import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { SimulationResult } from '../types';
import { formatCurrency } from '../utils/financial';

interface ChartProps {
  data: SimulationResult;
}

const COLORS = ['#6b7280', '#1f2937']; // Gray 500, Gray 800

export const EvolutionChart: React.FC<ChartProps> = ({ data }) => {
  const chartData = data.yearlyData.map((d) => ({
    name: `${d.year}º Ano`,
    Total: d.amount,
    Investido: d.invested,
    Juros: d.interest,
  }));

  // Add year 0
  const fullData = [
    { name: 'Início', Total: data.monthlyData[0]?.invested || 0, Investido: data.monthlyData[0]?.invested || 0, Juros: 0 },
    ...chartData
  ];

  return (
    <div className="h-[400px] w-full bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm transition-colors duration-200">
      <h3 className="text-center text-primary-800 dark:text-gray-100 font-bold mb-6">Evolução no Tempo</h3>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={fullData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#1f2937" stopOpacity={0.1} />
              <stop offset="95%" stopColor="#1f2937" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" className="dark:opacity-30" />
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 11, fill: '#6b7280' }} 
            interval="preserveStartEnd"
          />
          <YAxis 
            tickFormatter={(value) => 
              new Intl.NumberFormat('pt-BR', { notation: "compact", compactDisplay: "short" }).format(value)
            }
            tick={{ fontSize: 11, fill: '#6b7280' }}
          />
          <Tooltip
            formatter={(value: number) => formatCurrency(value)}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Legend wrapperStyle={{ paddingTop: '20px' }} />
          <Area
            type="monotone"
            dataKey="Total"
            fill="url(#colorTotal)"
            stroke="#1f2937"
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="Investido"
            stroke="#9ca3af"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="Juros"
            stroke="#d3d3db" // The requested color (Silver) for Interest
            strokeWidth={2}
            dot={false}
            name="Total em Juros"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export const CompositionChart: React.FC<ChartProps> = ({ data }) => {
  const pieData = [
    { name: 'Valor Investido', value: data.totalInvested },
    { name: 'Total em Juros', value: data.totalInterest },
  ];

  const total = data.totalAmount;
  const investedPct = ((data.totalInvested / total) * 100).toFixed(1);
  const interestPct = ((data.totalInterest / total) * 100).toFixed(1);

  return (
    <div className="h-[400px] w-full bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col md:flex-row items-center transition-colors duration-200">
      <div className="w-full md:w-1/2 h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => formatCurrency(value)} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      <div className="w-full md:w-1/2 space-y-4 px-4">
        <h3 className="text-center md:text-left text-primary-800 dark:text-gray-100 font-bold mb-4">Composição Final</h3>
        
        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border-l-4 border-gray-500 dark:border-gray-400">
          <p className="text-xs text-gray-500 dark:text-gray-300 uppercase font-semibold">Valor Investido</p>
          <p className="text-xl font-bold text-gray-800 dark:text-white">{formatCurrency(data.totalInvested)}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{investedPct}% do total</p>
        </div>

        <div className="p-4 bg-gray-100 dark:bg-gray-900 rounded-lg border-l-4 border-primary-800 dark:border-primary-500">
          <p className="text-xs text-primary-900 dark:text-primary-300 uppercase font-semibold">Total em Juros</p>
          <p className="text-xl font-bold text-primary-900 dark:text-white">{formatCurrency(data.totalInterest)}</p>
          <p className="text-xs text-primary-700 dark:text-primary-400 mt-1">{interestPct}% do total</p>
        </div>
      </div>
    </div>
  );
};