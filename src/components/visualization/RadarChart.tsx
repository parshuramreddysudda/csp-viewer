import React from 'react';
import { RadarChart as RechartsRadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import { countValueFrequency } from '../../utils/excelUtils';

interface RadarChartProps {
  data: any[];
  columnKey: string;
  title: string;
}

const RadarChartComponent: React.FC<RadarChartProps> = ({ data, columnKey, title }) => {
  // Extract values for the selected column
  const columnValues = data.map(row => row[columnKey]);
  
  // Count frequency of each value
  const valueFrequency = countValueFrequency(columnValues);
  
  // Convert to format required by Recharts
  let chartData = Object.entries(valueFrequency).map(([value, count]) => ({
    subject: value === 'undefined' || value === 'null' ? 'N/A' : value,
    value: count
  }));
  
  // Sort data by value (descending)
  chartData.sort((a, b) => b.value - a.value);
  
  // Limit to top 10 values (radar charts become unreadable with too many points)
  if (chartData.length > 10) {
    chartData = chartData.slice(0, 10);
  }
  
  // If no data or too few points, show message
  if (chartData.length < 3) {
    return (
      <div className="w-full h-full min-h-[400px] flex items-center justify-center">
        <p className="text-gray-500">Cannot create radar chart: Need at least 3 unique values</p>
      </div>
    );
  }
  
  const maxValue = Math.max(...chartData.map(item => item.value));
  
  return (
    <div className="w-full h-full min-h-[400px]">
      <h3 className="text-lg font-semibold mb-4 text-center">{title}</h3>
      <ResponsiveContainer width="100%" height={400}>
        <RechartsRadarChart cx="50%" cy="50%" outerRadius="80%">
          <PolarGrid />
          <PolarAngleAxis dataKey="subject" />
          <PolarRadiusAxis angle={30} domain={[0, maxValue]} />
          <Radar
            name="Count"
            dataKey="value"
            stroke="#3b82f6"
            fill="#3b82f6"
            fillOpacity={0.6}
            animationDuration={500}
          />
          <Tooltip 
            formatter={(value: number) => [`${value} items`, 'Count']}
          />
          <Legend />
        </RechartsRadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RadarChartComponent;