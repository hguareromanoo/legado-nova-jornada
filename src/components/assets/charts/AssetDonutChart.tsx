
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card } from '@/components/ui/card';

interface DonutChartData {
  name: string;
  value: number;
  color: string;
}

interface AssetDonutChartProps {
  data: DonutChartData[];
  title: string;
}

const AssetDonutChart = ({ data, title }: AssetDonutChartProps) => {
  // Calculate total for percentage
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  // Custom tooltip formatter
  const tooltipFormatter = (value: number) => {
    const percentage = ((value / total) * 100).toFixed(1);
    return `R$ ${value.toLocaleString()} (${percentage}%)`;
  };

  return (
    <Card className="bg-w1-secondary-dark/30 p-5 rounded-2xl backdrop-blur-sm border border-gray-700/30">
      <div className="flex justify-between items-center mb-3">
        <div className="text-gray-400 text-sm">{title}</div>
        <button className="text-gray-400">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="10" cy="10" r="1" fill="currentColor" />
            <circle cx="10" cy="6" r="1" fill="currentColor" />
            <circle cx="10" cy="14" r="1" fill="currentColor" />
          </svg>
        </button>
      </div>
      
      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              paddingAngle={2}
              dataKey="value"
              nameKey="name"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              formatter={tooltipFormatter}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  const percentage = ((data.value / total) * 100).toFixed(1);
                  
                  return (
                    <div className="bg-w1-secondary-dark p-2 rounded-md border border-w1-primary-accent/20 text-xs">
                      <p className="text-white font-medium mb-1">{data.name}</p>
                      <p className="text-white">{`R$ ${data.value.toLocaleString()}`}</p>
                      <p className="text-gray-400">{`${percentage}% do total`}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              formatter={(value, entry, index) => {
                const item = data[index];
                const percentage = ((item.value / total) * 100).toFixed(1);
                return (
                  <span className="text-xs">
                    {value} ({percentage}%)
                  </span>
                );
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default AssetDonutChart;
