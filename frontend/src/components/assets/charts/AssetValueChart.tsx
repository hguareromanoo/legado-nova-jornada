
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from '@/components/ui/card';

interface AssetValueChartProps {
  title: string;
  subtitle: string;
  growthPercentage: number;
  period: string;
}

// Mock data for the chart
const data = [
  { name: 'Jan', value: 2800000 },
  { name: 'Fev', value: 2850000 },
  { name: 'Mar', value: 2700000 },
  { name: 'Abr', value: 2900000 },
  { name: 'Mai', value: 3000000 },
  { name: 'Jun', value: 3050000 },
  { name: 'Jul', value: 3100000 },
  { name: 'Ago', value: 3020000 },
  { name: 'Set', value: 3150000 },
  { name: 'Out', value: 3200000 },
  { name: 'Nov', value: 3250000 },
  { name: 'Dez', value: 3254895 },
];

const AssetValueChart = ({ title, subtitle, growthPercentage, period }: AssetValueChartProps) => {
  return (
    <Card className="bg-gradient-to-br from-w1-primary-accent/20 to-w1-primary-accent-hover/20 rounded-2xl p-5 backdrop-blur-sm border border-w1-primary-accent/30">
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
      <h3 className="text-3xl font-bold text-white mb-1">{subtitle}</h3>
      <div className="flex items-center text-sm mb-4">
        <span className={growthPercentage >= 0 ? 'text-green-400 flex items-center' : 'text-red-400 flex items-center'}>
          {growthPercentage >= 0 ? (
            <svg className="w-3 h-3 mr-1" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 2.5V9.5M6 2.5L3 5.5M6 2.5L9 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <svg className="w-3 h-3 mr-1" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 9.5V2.5M6 9.5L3 6.5M6 9.5L9 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
          {growthPercentage >= 0 ? `+${growthPercentage}%` : `${growthPercentage}%`}
        </span>
        <span className="text-gray-400 ml-2">{period}</span>
      </div>
      <div className="h-28">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fill: '#9CA3AF' }} 
              dy={10} 
              tickMargin={5}
              hide={true}
            />
            <Tooltip 
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-w1-secondary-dark p-2 rounded-md border border-w1-primary-accent/20 text-xs">
                      <p className="text-white">{`${payload[0].payload.name}: R$ ${payload[0].value.toLocaleString()}`}</p>
                    </div>
                  );
                }
                return null;
              }} 
              cursor={{ stroke: '#4ECDC4', strokeWidth: 1 }}
            />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#4ECDC4" 
              strokeWidth={2} 
              dot={false} 
              activeDot={{ r: 4, fill: '#4ECDC4', stroke: '#4ECDC4' }} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default AssetValueChart;
