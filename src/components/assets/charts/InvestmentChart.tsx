
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
  Legend,
  ReferenceLine
} from 'recharts';

interface InvestmentChartProps {
  chartType?: 'price' | 'returns' | 'dividends' | 'comparison';
}

const InvestmentChart: React.FC<InvestmentChartProps> = ({ chartType = 'price' }) => {
  // Mock data for charts
  const priceData = [
    { date: '2023-05', price: 25.8 },
    { date: '2023-06', price: 26.4 },
    { date: '2023-07', price: 26.8 },
    { date: '2023-08', price: 27.5 },
    { date: '2023-09', price: 26.9 },
    { date: '2023-10', price: 27.3 },
    { date: '2023-11', price: 27.8 },
    { date: '2023-12', price: 28.1 },
    { date: '2024-01', price: 28.5 },
    { date: '2024-02', price: 29.1 },
    { date: '2024-03', price: 28.9 },
    { date: '2024-04', price: 29.2 },
    { date: '2024-05', price: 29.6 }
  ];

  const returnsData = [
    { period: '1M', return: 1.4 },
    { period: '3M', return: 2.4 },
    { period: '6M', return: 5.3 },
    { period: 'YTD', return: 3.9 },
    { period: '1Y', return: 8.7 },
    { period: '2Y', return: 14.8 },
    { period: 'Desde o início', return: 15.3 }
  ];

  const dividendsData = [
    { date: 'Jan-23', value: 0 },
    { date: 'Fev-23', value: 0.45 },
    { date: 'Mar-23', value: 0 },
    { date: 'Abr-23', value: 0 },
    { date: 'Mai-23', value: 0.45 },
    { date: 'Jun-23', value: 0 },
    { date: 'Jul-23', value: 0 },
    { date: 'Ago-23', value: 0.50 },
    { date: 'Set-23', value: 0 },
    { date: 'Out-23', value: 0 },
    { date: 'Nov-23', value: 0.50 },
    { date: 'Dez-23', value: 0 },
    { date: 'Jan-24', value: 0 },
    { date: 'Fev-24', value: 0.55 }
  ];

  const comparisonData = [
    { date: '2023-05', asset: 0, ibovespa: 0 },
    { date: '2023-06', asset: 2.3, ibovespa: 1.8 },
    { date: '2023-07', asset: 3.9, ibovespa: 3.2 },
    { date: '2023-08', asset: 6.6, ibovespa: 5.1 },
    { date: '2023-09', asset: 4.3, ibovespa: 3.7 },
    { date: '2023-10', asset: 5.8, ibovespa: 6.2 },
    { date: '2023-11', asset: 7.8, ibovespa: 7.4 },
    { date: '2023-12', asset: 8.9, ibovespa: 8.5 },
    { date: '2024-01', asset: 10.5, ibovespa: 9.8 },
    { date: '2024-02', asset: 12.8, ibovespa: 10.5 },
    { date: '2024-03', asset: 12.1, ibovespa: 10.9 },
    { date: '2024-04', asset: 13.2, ibovespa: 11.4 },
    { date: '2024-05', asset: 14.7, ibovespa: 12.3 }
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
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

  const renderChart = () => {
    switch (chartType) {
      case 'returns':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={returnsData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <defs>
                <linearGradient id="colorReturns" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.2} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="period" stroke="#aaa" />
              <YAxis stroke="#aaa" tickFormatter={(value) => `${value}%`} />
              <Tooltip 
                formatter={(value: number) => [`${value.toFixed(2)}%`, 'Rentabilidade']}
                contentStyle={{ 
                  backgroundColor: '#2a2a2a', 
                  borderColor: '#444',
                  color: '#fff'
                }} 
              />
              <Legend />
              <Bar dataKey="return" name="Rentabilidade" fill="url(#colorReturns)" />
              <ReferenceLine y={0} stroke="#666" />
            </BarChart>
          </ResponsiveContainer>
        );
      case 'dividends':
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
              <XAxis dataKey="date" stroke="#aaa" />
              <YAxis stroke="#aaa" tickFormatter={(value) => `R$ ${value.toFixed(2)}`} />
              <Tooltip 
                formatter={(value: number) => [`R$ ${value.toFixed(2)}`, 'Proventos por Ação']}
                contentStyle={{ 
                  backgroundColor: '#2a2a2a', 
                  borderColor: '#444',
                  color: '#fff'
                }} 
              />
              <Legend />
              <Bar dataKey="value" name="Proventos por Ação" fill="url(#colorDividends)" />
            </BarChart>
          </ResponsiveContainer>
        );
      case 'comparison':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={comparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="date" stroke="#aaa" tickFormatter={formatDate} />
              <YAxis stroke="#aaa" tickFormatter={(value) => `${value}%`} />
              <Tooltip 
                formatter={(value: number) => [`${value.toFixed(2)}%`, '']}
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
                dataKey="asset" 
                name="PETR4" 
                stroke="#8b5cf6" 
                strokeWidth={2} 
                dot={{ stroke: '#8b5cf6', strokeWidth: 2, r: 4, fill: '#111' }}
                activeDot={{ stroke: '#8b5cf6', strokeWidth: 2, r: 6, fill: '#111' }} 
              />
              <Line 
                type="monotone" 
                dataKey="ibovespa" 
                name="Ibovespa" 
                stroke="#f59e0b" 
                strokeWidth={2}
                dot={{ stroke: '#f59e0b', strokeWidth: 2, r: 4, fill: '#111' }}
                activeDot={{ stroke: '#f59e0b', strokeWidth: 2, r: 6, fill: '#111' }}
                strokeDasharray="3 3"
              />
            </LineChart>
          </ResponsiveContainer>
        );
      default: // price
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={priceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.2} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="date" stroke="#aaa" tickFormatter={formatDate} />
              <YAxis stroke="#aaa" domain={['dataMin - 1', 'dataMax + 1']} />
              <Tooltip 
                formatter={(value: number) => [`R$ ${value.toFixed(2)}`, 'Preço']}
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
                dataKey="price" 
                name="Cotação" 
                stroke="#8b5cf6" 
                strokeWidth={2}
                dot={{ stroke: '#8b5cf6', strokeWidth: 2, r: 4, fill: '#111' }}
                activeDot={{ stroke: '#8b5cf6', strokeWidth: 2, r: 6, fill: '#111' }}
                fillOpacity={1} 
                fill="url(#colorPrice)" 
              />
              <ReferenceLine y={28.5} label="Preço Médio" stroke="#888" strokeDasharray="3 3" />
            </LineChart>
          </ResponsiveContainer>
        );
    }
  };

  return renderChart();
};

export default InvestmentChart;
