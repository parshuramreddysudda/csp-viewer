import React from 'react';
import { ScatterChart as RechartsScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ZAxis } from 'recharts';

interface ScatterChartProps {
  data: any[];
  columnKey: string;
  title: string;
}

const ScatterChartComponent: React.FC<ScatterChartProps> = ({ data, columnKey, title }) => {
  // For scatter plots, we need two numeric dimensions
  // We'll use the index as x-axis and the column value as y-axis
  const scatterData = data
    .map((row, index) => ({
      x: index + 1, // Index starting from 1
      y: row[columnKey],
      name: `Row ${index + 1}`
    }))
    .filter(item => typeof item.y === 'number' && !isNaN(item.y)); // Filter only numeric values
  
  if (scatterData.length === 0) {
    return (
      <div className="w-full h-full min-h-[400px] flex items-center justify-center">
        <p className="text-gray-500">Cannot create scatter plot: Column does not contain numeric data</p>
      </div>
    );
  }
  
  return (
    <div className="w-full h-full min-h-[400px]">
      <h3 className="text-lg font-semibold mb-4 text-center">{title}</h3>
      <ResponsiveContainer width="100%" height={400}>
        <RechartsScatterChart
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 20
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            type="number" 
            dataKey="x" 
            name="Row Index" 
            label={{ value: "Row Index", position: "insideBottomRight", offset: -10 }}
          />
          <YAxis 
            type="number" 
            dataKey="y" 
            name={columnKey} 
            label={{ value: columnKey, angle: -90, position: "insideLeft" }}
          />
          <ZAxis range={[50, 50]} />
          <Tooltip 
            cursor={{ strokeDasharray: '3 3' }}
            formatter={(value: number) => [value, value === scatterData[0].x ? 'Row Index' : columnKey]}
            labelFormatter={(value) => `Row ${value}`}
          />
          <Legend />
          <Scatter 
            name={columnKey} 
            data={scatterData} 
            fill="#3b82f6" 
            shape="circle"
          />
        </RechartsScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ScatterChartComponent;