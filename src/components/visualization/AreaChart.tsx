import React from 'react';
import { AreaChart as RechartsAreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { countValueFrequency } from '../../utils/excelUtils';

interface AreaChartProps {
  data: any[];
  columnKey: string;
  title: string;
}

const AreaChartComponent: React.FC<AreaChartProps> = ({ data, columnKey, title }) => {
  // Extract values for the selected column
  const columnValues = data.map(row => row[columnKey]);
  
  // Count frequency of each value
  const valueFrequency = countValueFrequency(columnValues);
  
  // Convert to format required by Recharts
  const chartData = Object.entries(valueFrequency).map(([value, count]) => ({
    name: value === 'undefined' || value === 'null' ? 'N/A' : value,
    value: count
  }));
  
  // Sort data by name (try numeric sort first, fall back to string sort)
  chartData.sort((a, b) => {
    // Try to sort numerically if possible
    const numA = Number(a.name);
    const numB = Number(b.name);
    
    if (!isNaN(numA) && !isNaN(numB)) {
      return numA - numB;
    }
    
    // Otherwise sort alphabetically
    return a.name.localeCompare(b.name);
  });
  
  // Limit to top 30 values if there are too many
  const displayData = chartData.length > 30 ? chartData.slice(0, 30) : chartData;
  
  return (
    <div className="w-full h-full min-h-[400px]">
      <h3 className="text-lg font-semibold mb-4 text-center">{title}</h3>
      <ResponsiveContainer width="100%" height={400}>
        <RechartsAreaChart
          data={displayData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 70
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="name" 
            angle={-45} 
            textAnchor="end" 
            height={70}
            interval={0}
            tick={{ fontSize: 12 }}
          />
          <YAxis />
          <Tooltip 
            formatter={(value: number) => [`${value} items`, 'Count']}
            labelFormatter={(value) => `${value}`}
          />
          <Legend />
          <Area 
            type="monotone" 
            dataKey="value" 
            name="Count" 
            stroke="#3b82f6" 
            fill="#3b82f6" 
            fillOpacity={0.3}
            strokeWidth={2}
          />
        </RechartsAreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AreaChartComponent;