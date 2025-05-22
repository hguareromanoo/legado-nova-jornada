
import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine
} from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';

const OtherAssetChart: React.FC = () => {
  // Mock data for asset depreciation chart
  const depreciationData = [
    { date: '2021-01', value: 480000 },
    { date: '2021-07', value: 470000 },
    { date: '2022-01', value: 455000 },
    { date: '2022-07', value: 445000 },
    { date: '2023-01', value: 430000 },
    { date: '2023-07', value: 415000 },
    { date: '2024-01', value: 450000 },
    { date: '2024-07', value: 445000, projected: true }
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    if (dateString.includes('-')) {
      const [year, month] = dateString.split('-');
      const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
      return `${monthNames[parseInt(month) - 1]}/${year.slice(-2)}`;
    }
    return dateString;
  };

  return (
    <ChartContainer
      config={{
        value: {
          theme: {
            light: "#f59e0b",
            dark: "#f59e0b",
          }
        },
        referenceValue: {
          theme: {
            light: "#64748b",
            dark: "#94a3b8",
          }
        }
      }}
      className="aspect-[4/3] w-full h-full"
    >
      <LineChart data={depreciationData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <defs>
          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-value, #f59e0b)" stopOpacity={0.8} />
            <stop offset="95%" stopColor="var(--color-value, #f59e0b)" stopOpacity={0.2} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
        <XAxis 
          dataKey="date" 
          stroke="rgba(255,255,255,0.5)" 
          tickFormatter={formatDate} 
          tickLine={false}
          axisLine={false}
          dy={10}
        />
        <YAxis 
          stroke="rgba(255,255,255,0.5)" 
          tickFormatter={formatCurrency} 
          domain={['dataMin - 20000', 'dataMax + 20000']} 
          axisLine={false}
          tickLine={false}
          dx={-10}
        />
        <Tooltip 
          content={({ active, payload }) => {
            if (active && payload?.length) {
              return (
                <div className="rounded-lg border border-gray-800 bg-gray-900 p-2 shadow-md">
                  <div className="text-sm text-gray-300">{formatDate(payload[0].payload.date)}</div>
                  <div className="font-bold text-white">{formatCurrency(payload[0].value as number)}</div>
                </div>
              );
            }
            return null;
          }}
        />
        <Legend 
          verticalAlign="top"
          height={36}
          content={({ payload }) => (
            <div className="flex items-center justify-center text-sm text-gray-300 mb-4">
              <div className="flex items-center mr-4">
                <div className="h-3 w-3 mr-1 rounded-full bg-[#f59e0b]"></div>
                <span>Valor Estimado</span>
              </div>
              <div className="flex items-center">
                <div className="h-3 w-3 mr-1 rounded-full bg-gray-500"></div>
                <span>Valor de Aquisição</span>
              </div>
            </div>
          )}
        />
        <Line 
          type="monotone" 
          dataKey="value" 
          name="Valor Estimado" 
          stroke="var(--color-value, #f59e0b)" 
          strokeWidth={3}
          dot={{ stroke: "var(--color-value, #f59e0b)", strokeWidth: 2, r: 4, fill: '#1f2937' }}
          activeDot={{ stroke: "var(--color-value, #f59e0b)", strokeWidth: 2, r: 6, fill: '#1f2937' }}
          fillOpacity={0.2} 
          fill="url(#colorValue)" 
        />
        <ReferenceLine 
          y={480000} 
          label={{ 
            value: "Valor de Aquisição",
            position: "right",
            fill: "var(--color-referenceValue, #94a3b8)",
            fontSize: 12
          }} 
          stroke="var(--color-referenceValue, #94a3b8)" 
          strokeDasharray="3 3" 
        />
      </LineChart>
    </ChartContainer>
  );
};

export default OtherAssetChart;
