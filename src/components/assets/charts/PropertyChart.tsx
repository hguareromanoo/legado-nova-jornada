
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

interface PropertyChartProps {
  chartType?: 'valuation' | 'rental' | 'occupancy' | 'maintenance';
}

const PropertyChart: React.FC<PropertyChartProps> = ({ chartType = 'valuation' }) => {
  // Mock data for charts
  const valuationData = [
    { year: '2019', value: 850000 },
    { year: '2020', value: 875000 },
    { year: '2021', value: 910000 },
    { year: '2022', value: 930000 },
    { year: '2023', value: 960000 },
    { year: '2024', value: 980000 }
  ];

  const rentalData = [
    { month: 'Jan', income: 5000 },
    { month: 'Fev', income: 5000 },
    { month: 'Mar', income: 5000 },
    { month: 'Abr', income: 5000 },
    { month: 'Mai', income: 5200 },
    { month: 'Jun', income: 5200 },
    { month: 'Jul', income: 5200 },
    { month: 'Ago', income: 5200 },
    { month: 'Set', income: 5200 },
    { month: 'Out', income: 5400 },
    { month: 'Nov', income: 5400 },
    { month: 'Dez', income: 5400 }
  ];

  const occupancyData = [
    { year: '2020', occupancy: 92 },
    { year: '2021', occupancy: 100 },
    { year: '2022', occupancy: 100 },
    { year: '2023', occupancy: 95 },
    { year: '2024', occupancy: 100 }
  ];

  const maintenanceData = [
    { month: 'Jan', cost: 0 },
    { month: 'Fev', cost: 1200 },
    { month: 'Mar', cost: 0 },
    { month: 'Abr', cost: 0 },
    { month: 'Mai', cost: 500 },
    { month: 'Jun', cost: 0 },
    { month: 'Jul', cost: 0 },
    { month: 'Ago', cost: 0 },
    { month: 'Set', cost: 3500 },
    { month: 'Out', cost: 0 },
    { month: 'Nov', cost: 0 },
    { month: 'Dez', cost: 0 }
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
      case 'rental':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={rentalData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <defs>
                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.2} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="month" stroke="#aaa" />
              <YAxis stroke="#aaa" tickFormatter={formatCurrency} />
              <Tooltip 
                formatter={(value: number) => [formatCurrency(value), 'Receita']}
                contentStyle={{ 
                  backgroundColor: '#2a2a2a', 
                  borderColor: '#444',
                  color: '#fff'
                }} 
              />
              <Legend />
              <Bar dataKey="income" name="Receita de Aluguel" fill="url(#colorIncome)" />
            </BarChart>
          </ResponsiveContainer>
        );
      case 'occupancy':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={occupancyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <defs>
                <linearGradient id="colorOccupancy" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.2} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="year" stroke="#aaa" />
              <YAxis stroke="#aaa" tickFormatter={(value) => `${value}%`} domain={[0, 100]} />
              <Tooltip 
                formatter={(value: number) => [`${value}%`, 'Ocupação']}
                contentStyle={{ 
                  backgroundColor: '#2a2a2a', 
                  borderColor: '#444',
                  color: '#fff'
                }} 
              />
              <Legend />
              <Bar dataKey="occupancy" name="Taxa de Ocupação" fill="url(#colorOccupancy)" />
            </BarChart>
          </ResponsiveContainer>
        );
      case 'maintenance':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={maintenanceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <defs>
                <linearGradient id="colorMaintenance" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.2} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="month" stroke="#aaa" />
              <YAxis stroke="#aaa" tickFormatter={formatCurrency} />
              <Tooltip 
                formatter={(value: number) => [formatCurrency(value), 'Custos']}
                contentStyle={{ 
                  backgroundColor: '#2a2a2a', 
                  borderColor: '#444',
                  color: '#fff'
                }} 
              />
              <Legend />
              <Bar dataKey="cost" name="Custos de Manutenção" fill="url(#colorMaintenance)" />
            </BarChart>
          </ResponsiveContainer>
        );
      default: // valuation
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={valuationData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.2} />
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
                name="Valor de Mercado" 
                stroke="#3b82f6" 
                strokeWidth={2} 
                dot={{ stroke: '#3b82f6', strokeWidth: 2, r: 4, fill: '#111' }} 
                activeDot={{ stroke: '#3b82f6', strokeWidth: 2, r: 6, fill: '#111' }}
                fillOpacity={1} 
                fill="url(#colorValue)" 
              />
            </LineChart>
          </ResponsiveContainer>
        );
    }
  };

  return renderChart();
};

export default PropertyChart;
