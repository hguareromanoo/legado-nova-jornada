
import React from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

interface CompanyChartProps {
  chartType?: 'dividends' | 'valuation';
}

const CompanyChart: React.FC<CompanyChartProps> = ({ chartType = 'dividends' }) => {
  // Mock data for charts
  const dividendsData = [
    { period: '2020-S1', value: 75000 },
    { period: '2020-S2', value: 80000 },
    { period: '2021-S1', value: 85000 },
    { period: '2021-S2', value: 95000 },
    { period: '2022-S1', value: 110000 },
    { period: '2022-S2', value: 125000 },
    { period: '2023-S1', value: 140000 },
    { period: '2023-S2', value: 160000 },
    { period: '2024-S1', value: 175000 }
  ];

  const valuationData = [
    { year: '2017', value: 1500000 },
    { year: '2018', value: 1600000 },
    { year: '2019', value: 1650000 },
    { year: '2020', value: 1720000 },
    { year: '2021', value: 1800000 },
    { year: '2022', value: 1900000 },
    { year: '2023', value: 1950000 },
    { year: '2024', value: 2000000 }
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const renderChart = () => {
    switch (chartType) {
      case 'valuation':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={valuationData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <defs>
                <linearGradient id="colorValuation" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.2} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="year" stroke="#aaa" />
              <YAxis stroke="#aaa" tickFormatter={formatCurrency} />
              <Tooltip 
                formatter={(value: number) => [formatCurrency(value), 'Valor']}
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
                name="Valor da Participação" 
                stroke="#10b981" 
                strokeWidth={2}
                dot={{ stroke: '#10b981', strokeWidth: 2, r: 4, fill: '#111' }}
                activeDot={{ stroke: '#10b981', strokeWidth: 2, r: 6, fill: '#111' }}
                fillOpacity={1} 
                fill="url(#colorValuation)" 
              />
            </LineChart>
          </ResponsiveContainer>
        );
      default: // dividends
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dividendsData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <defs>
                <linearGradient id="colorDividends" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.2} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="period" stroke="#aaa" />
              <YAxis stroke="#aaa" tickFormatter={formatCurrency} />
              <Tooltip 
                formatter={(value: number) => [formatCurrency(value), 'Dividendos']}
                contentStyle={{ 
                  backgroundColor: '#2a2a2a', 
                  borderColor: '#444',
                  color: '#fff'
                }} 
              />
              <Legend />
              <Bar dataKey="value" name="Dividendos Recebidos" fill="url(#colorDividends)" />
            </BarChart>
          </ResponsiveContainer>
        );
    }
  };

  return renderChart();
};

export default CompanyChart;
