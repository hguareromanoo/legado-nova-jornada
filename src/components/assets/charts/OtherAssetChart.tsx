
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
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={depreciationData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <defs>
          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.2} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#444" />
        <XAxis dataKey="date" stroke="#aaa" tickFormatter={formatDate} />
        <YAxis stroke="#aaa" tickFormatter={formatCurrency} domain={['dataMin - 20000', 'dataMax + 20000']} />
        <Tooltip 
          formatter={(value: number) => [formatCurrency(value), 'Valor']}
          labelFormatter={formatDate}
          contentStyle={{ 
            backgroundColor: '#2a2a2a', 
            borderColor: '#444',
            color: '#fff'
          }} 
        />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="value" 
          name="Valor Estimado" 
          stroke="#f59e0b" 
          strokeWidth={2}
          dot={{ stroke: '#f59e0b', strokeWidth: 2, r: 4, fill: '#111' }}
          activeDot={{ stroke: '#f59e0b', strokeWidth: 2, r: 6, fill: '#111' }}
          fillOpacity={1} 
          fill="url(#colorValue)" 
        />
        <ReferenceLine y={480000} label="Valor de Aquisição" stroke="#888" strokeDasharray="3 3" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default OtherAssetChart;
