import React from 'react';
import { PieChart as RechartsPieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { countValueFrequency } from '../../utils/excelUtils';

interface PieChartProps {
  data: any[];
  columnKey: string;
  title: string;
}

const COLORS = [
  '#3b82f6', '#0ea5e9', '#8b5cf6', '#10b981', '#f59e0b', 
  '#ef4444', '#ec4899', '#6366f1', '#14b8a6', '#f97316'
];

const PieChartComponent: React.FC<PieChartProps> = ({ data, columnKey, title }) => {
  // Extract values for the selected column
  const columnValues = data.map(row => row[columnKey]);
  
  // Count frequency of each value
  const valueFrequency = countValueFrequency(columnValues);
  
  // Convert to format required by Recharts
  let chartData = Object.entries(valueFrequency).map(([value, count]) => ({
    name: value === 'undefined' || value === 'null' ? 'N/A' : value,
    value: count
  }));
  
  // Sort data by value (descending)
  chartData.sort((a, b) => b.value - a.value);
  
  // Limit to top 10 values, group others into "Other" category
  if (chartData.length > 10) {
    const topValues = chartData.slice(0, 9);
    const otherValues = chartData.slice(9);
    
    const otherSum = otherValues.reduce((sum, item) => sum + item.value, 0);
    
    if (otherSum > 0) {
      chartData = [
        ...topValues,
        { name: 'Other', value: otherSum }
      ];
    } else {
      chartData = topValues;
    }
  }
  
  const totalCount = chartData.reduce((sum, item) => sum + item.value, 0);
  
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    
    return percent > 0.05 ? (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor="middle" 
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    ) : null;
  };
  
  return (
    <div className="w-full h-full min-h-[400px]">
      <h3 className="text-lg font-semibold mb-4 text-center">{title}</h3>
      <ResponsiveContainer width="100%" height={400}>
        <RechartsPieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={160}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: number) => [
              `${value} (${((value / totalCount) * 100).toFixed(1)}%)`, 
              'Count'
            ]}
          />
          <Legend layout="vertical" verticalAlign="middle" align="right" />
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PieChartComponent;