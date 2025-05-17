
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface AssetDonutChartProps {
  data: {
    name: string;
    value: number;
    color: string;
  }[];
  title?: string;
}

const AssetDonutChart: React.FC<AssetDonutChartProps> = ({ data, title = "Distribuição de Ativos" }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };
  
  return (
    <div className="w-full h-full bg-gray-800/30 p-5 rounded-2xl backdrop-blur-sm border border-gray-700/30">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-white">{title}</h3>
      </div>
      
      <div className="w-full aspect-square max-h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius="60%"
              outerRadius="80%"
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0];
                  const percentage = ((item.value as number) / total * 100).toFixed(1);
                  
                  return (
                    <div className="rounded-lg border border-gray-800 bg-gray-900 p-2 shadow-md">
                      <p className="text-sm text-white font-medium">{item.name}</p>
                      <p className="text-sm text-white font-bold">
                        {formatCurrency(item.value as number)}
                      </p>
                      <p className="text-xs text-gray-400">{percentage}% do total</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend
              layout="vertical"
              verticalAlign="middle"
              align="right"
              content={({ payload }) => (
                <ul className="list-none p-0 m-0">
                  {payload?.map((entry, index) => (
                    <li key={`item-${index}`} className="flex items-center mb-2.5 text-sm">
                      <div 
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: entry.color }}
                      />
                      <span className="mr-2 text-gray-300">{entry.value}</span>
                      <span className="text-gray-400">
                        {((data[index].value / total) * 100).toFixed(1)}%
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <ul className="mt-4 grid grid-cols-2 gap-3">
        {data.map((item, index) => (
          <li key={index} className="bg-black/20 rounded-lg p-2.5">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-sm text-gray-300 font-medium">{item.name}</span>
            </div>
            <p className="text-lg font-bold text-white">{formatCurrency(item.value)}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AssetDonutChart;
