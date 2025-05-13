import React from 'react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { countValueFrequency } from '../../utils/excelUtils';

interface BarChartProps {
  data: any[];
  columnKey: string;
  title: string;
}

const BarChartComponent: React.FC<BarChartProps> = ({ data, columnKey, title }) => {
  // Extract values for the selected column
  const columnValues = data.map(row => row[columnKey]);
  
  // Count frequency of each value
  const valueFrequency = countValueFrequency(columnValues);
  
  // Convert to format required by Recharts
  const chartData = Object.entries(valueFrequency).map(([value, count]) => ({
    name: value === 'undefined' || value === 'null' ? 'N/A' : value,
    value: count
  }));
  
  // Sort data by value (descending)
  chartData.sort((a, b) => b.value - a.value);
  
  // Limit to top 20 values if there are too many
  const displayData = chartData.length > 20 ? chartData.slice(0, 20) : chartData;
  
  return (
    <div className="w-full h-full min-h-[400px]">
      <h3 className="text-lg font-semibold mb-4 text-center">{title}</h3>
      <ResponsiveContainer width="100%" height={400}>
        <RechartsBarChart
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
          <Bar dataKey="value" name="Count" fill="#3b82f6" />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChartComponent;