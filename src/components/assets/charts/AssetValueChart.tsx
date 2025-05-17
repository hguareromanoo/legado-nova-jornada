
import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  Legend
} from 'recharts';
import { ChartContainer } from '@/components/ui/chart';

interface AssetValueChartProps {
  title?: string;
  subtitle?: string;
  growthPercentage?: number;
  period?: string;
}

const AssetValueChart: React.FC<AssetValueChartProps> = ({ 
  title = "Valorização do Patrimônio",
  subtitle = "Últimos 12 meses",
  growthPercentage = 8.34,
  period = "este mês"
}) => {
  // Mock data for asset value chart
  const data = [
    { month: "Mai-24", actual: 3000000, forecast: 3050000 },
    { month: "Jun-24", actual: 3080000, forecast: 3100000 },
    { month: "Jul-24", actual: 3120000, forecast: 3150000 },
    { month: "Ago-24", actual: 3180000, forecast: 3210000 },
    { month: "Set-24", actual: 3220000, forecast: 3250000 },
    { month: "Out-24", actual: 3254895, forecast: 3290000 },
    { month: "Nov-24", forecast: 3320000 },
    { month: "Dez-24", forecast: 3360000 },
    { month: "Jan-25", forecast: 3400000 },
    { month: "Fev-25", forecast: 3450000 },
    { month: "Mar-25", forecast: 3500000 },
    { month: "Abr-25", forecast: 3560000 }
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-white">{title}</h3>
        <div className="flex items-center justify-between">
          <p className="text-gray-400 text-sm">{subtitle}</p>
          <div className="flex items-center bg-black/20 rounded-full px-3 py-1">
            <div className={`w-2 h-2 rounded-full mr-2 ${growthPercentage >= 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className={`text-sm ${growthPercentage >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {growthPercentage >= 0 ? '+' : ''}{growthPercentage}% {period}
            </span>
          </div>
        </div>
      </div>
      
      <ChartContainer
        config={{
          actual: {
            theme: {
              light: "#10b981",
              dark: "#10b981",
            }
          },
          forecast: {
            theme: {
              light: "#8b5cf6",
              dark: "#a78bfa",
            }
          }
        }}
        className="aspect-[4/3] flex-1"
      >
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
          <defs>
            <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-actual, #10b981)" stopOpacity={0.5} />
              <stop offset="95%" stopColor="var(--color-actual, #10b981)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-forecast, #a78bfa)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="var(--color-forecast, #a78bfa)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis 
            dataKey="month" 
            tick={{ fontSize: 11 }} 
            tickLine={false} 
            axisLine={false} 
            stroke="rgba(255,255,255,0.5)"
          />
          <YAxis 
            tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`} 
            tickLine={false} 
            axisLine={false} 
            stroke="rgba(255,255,255,0.5)"
            tick={{ fontSize: 11 }}
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="rounded-lg border border-gray-800 bg-gray-900 p-2 shadow-md">
                    <p className="text-sm text-gray-300 mb-1">{label}</p>
                    {payload.map((entry, index) => (
                      entry.value && 
                      <p key={`tooltip-${index}`} className="text-sm flex items-center">
                        <span className={`w-2 h-2 rounded-full mr-1 ${entry.name === "actual" ? "bg-[#10b981]" : "bg-[#a78bfa]"}`}></span>
                        <span className="text-white font-bold">
                          {formatCurrency(entry.value as number)}
                        </span>
                        <span className="text-gray-400 ml-1">
                          ({entry.name === "actual" ? "Atual" : "Projeção"})
                        </span>
                      </p>
                    ))}
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
                  <div className="h-2 w-2 mr-1 rounded-full bg-[#10b981]"></div>
                  <span>Valor Atual</span>
                </div>
                <div className="flex items-center">
                  <div className="h-2 w-2 mr-1 rounded-full bg-[#a78bfa]"></div>
                  <span>Valor Projetado</span>
                </div>
              </div>
            )}
          />
          <Area 
            type="monotone" 
            dataKey="actual" 
            name="actual"
            stroke="var(--color-actual, #10b981)" 
            fillOpacity={1}
            fill="url(#colorActual)" 
            strokeWidth={2}
            activeDot={{ r: 6, stroke: "var(--color-actual, #10b981)", strokeWidth: 2, fill: "#1f2937" }}
            dot={{ r: 4, stroke: "var(--color-actual, #10b981)", strokeWidth: 2, fill: "#1f2937" }}
          />
          <Area 
            type="monotone" 
            dataKey="forecast" 
            name="forecast"
            stroke="var(--color-forecast, #a78bfa)" 
            fillOpacity={1}
            fill="url(#colorForecast)" 
            strokeWidth={2}
            strokeDasharray="5 5"
            activeDot={{ r: 6, stroke: "var(--color-forecast, #a78bfa)", strokeWidth: 2, fill: "#1f2937" }}
            dot={{ r: 3, stroke: "var(--color-forecast, #a78bfa)", strokeWidth: 2, fill: "#1f2937" }}
          />
        </AreaChart>
      </ChartContainer>
    </div>
  );
};

export default AssetValueChart;
