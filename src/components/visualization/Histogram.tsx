import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { calculateHistogramBins } from '../../utils/excelUtils';

interface HistogramProps {
  data: any[];
  columnKey: string;
  title: string;
}

const HistogramComponent: React.FC<HistogramProps> = ({ data, columnKey, title }) => {
  // Extract values for the selected column (only numeric values)
  const columnValues = data
    .map(row => row[columnKey])
    .filter(val => typeof val === 'number' && !isNaN(val)) as number[];
  
  if (columnValues.length === 0) {
    return (
      <div className="w-full h-full min-h-[400px] flex items-center justify-center">
        <p className="text-gray-500">Cannot create histogram: Column does not contain numeric data</p>
      </div>
    );
  }
  
  // Calculate histogram bins
  const bins = calculateHistogramBins(columnValues);
  
  // Format bin labels
  const formattedBins = bins.map(bin => ({
    name: `${bin.x0.toFixed(1)} - ${bin.x1.toFixed(1)}`,
    count: bin.count,
    rangeStart: bin.x0,
    rangeEnd: bin.x1
  }));
  
  return (
    <div className="w-full h-full min-h-[400px]">
      <h3 className="text-lg font-semibold mb-4 text-center">{title}</h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={formattedBins}
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
            labelFormatter={(value) => `Range: ${value}`}
          />
          <Legend />
          <Bar 
            dataKey="count" 
            name="Count" 
            fill="#3b82f6" 
            barSize={30}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HistogramComponent;