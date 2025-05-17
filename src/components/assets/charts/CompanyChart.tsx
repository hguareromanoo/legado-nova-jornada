
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
import { ChartContainer } from '@/components/ui/chart';

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
          <ChartContainer
            config={{
              value: {
                theme: {
                  light: "#10b981",
                  dark: "#10b981",
                }
              }
            }}
            className="aspect-[4/3] w-full h-full"
          >
            <LineChart data={valuationData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <defs>
                <linearGradient id="colorValuation" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-value, #10b981)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--color-value, #10b981)" stopOpacity={0.2} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="year" 
                stroke="rgba(255,255,255,0.5)" 
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="rgba(255,255,255,0.5)" 
                tickFormatter={formatCurrency} 
                tickLine={false}
                axisLine={false}
              />
              <Tooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border border-gray-800 bg-gray-900 p-2 shadow-md">
                        <p className="text-sm text-gray-300 mb-1">{label}</p>
                        <p className="text-white font-bold">{formatCurrency(payload[0].value as number)}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend 
                verticalAlign="top"
                height={36}
                content={() => (
                  <div className="flex items-center justify-center text-sm text-gray-300 mb-4">
                    <div className="flex items-center">
                      <div className="h-3 w-3 mr-1 rounded-full bg-[#10b981]"></div>
                      <span>Valor da Participação</span>
                    </div>
                  </div>
                )}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                name="Valor da Participação" 
                stroke="var(--color-value, #10b981)" 
                strokeWidth={3}
                dot={{ stroke: "var(--color-value, #10b981)", strokeWidth: 2, r: 4, fill: '#1f2937' }}
                activeDot={{ stroke: "var(--color-value, #10b981)", strokeWidth: 2, r: 6, fill: '#1f2937' }}
                fillOpacity={0.2} 
                fill="url(#colorValuation)" 
              />
            </LineChart>
          </ChartContainer>
        );
      default: // dividends
        return (
          <ChartContainer
            config={{
              value: {
                theme: {
                  light: "#10b981",
                  dark: "#10b981",
                }
              }
            }}
            className="aspect-[4/3] w-full h-full"
          >
            <BarChart data={dividendsData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <defs>
                <linearGradient id="colorDividends" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-value, #10b981)" stopOpacity={1} />
                  <stop offset="95%" stopColor="var(--color-value, #10b981)" stopOpacity={0.4} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="period" 
                stroke="rgba(255,255,255,0.5)" 
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="rgba(255,255,255,0.5)" 
                tickFormatter={formatCurrency} 
                tickLine={false}
                axisLine={false}
              />
              <Tooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border border-gray-800 bg-gray-900 p-2 shadow-md">
                        <p className="text-sm text-gray-300 mb-1">{label}</p>
                        <p className="text-white font-bold">{formatCurrency(payload[0].value as number)}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend 
                verticalAlign="top"
                height={36}
                content={() => (
                  <div className="flex items-center justify-center text-sm text-gray-300 mb-4">
                    <div className="flex items-center">
                      <div className="h-3 w-3 mr-1 rounded-full bg-[#10b981]"></div>
                      <span>Dividendos Recebidos</span>
                    </div>
                  </div>
                )}
              />
              <Bar 
                dataKey="value" 
                name="Dividendos Recebidos" 
                fill="url(#colorDividends)" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        );
    }
  };

  return renderChart();
};

export default CompanyChart;
