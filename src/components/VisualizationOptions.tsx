import React from 'react';
import { BarChart2, LineChart, PieChart, Activity, ScatterChart, Radar, BarChart } from 'lucide-react';
import { ColumnInfo, VisualizationType } from '../types';
import { getRecommendedVisualizations } from '../utils/excelUtils';

interface VisualizationOptionsProps {
  selectedColumn: string | null;
  columnInfo: ColumnInfo | null;
  onSelectVisualization: (type: VisualizationType) => void;
  selectedVisualization: VisualizationType | null;
}

const VisualizationOptions: React.FC<VisualizationOptionsProps> = ({
  selectedColumn,
  columnInfo,
  onSelectVisualization,
  selectedVisualization
}) => {
  if (!selectedColumn || !columnInfo) {
    return null;
  }
  
  const recommendedVisualizations = getRecommendedVisualizations(columnInfo);
  
  const visualizationTypes: { 
    type: VisualizationType; 
    label: string; 
    icon: React.ReactNode;
    recommended: boolean;
  }[] = [
    { 
      type: 'bar', 
      label: 'Bar Chart', 
      icon: <BarChart2 className="w-5 h-5" />,
      recommended: recommendedVisualizations.includes('bar')
    },
    { 
      type: 'line', 
      label: 'Line Chart', 
      icon: <LineChart className="w-5 h-5" />,
      recommended: recommendedVisualizations.includes('line')
    },
    { 
      type: 'pie', 
      label: 'Pie Chart', 
      icon: <PieChart className="w-5 h-5" />,
      recommended: recommendedVisualizations.includes('pie')
    },
    { 
      type: 'area', 
      label: 'Area Chart', 
      icon: <Activity className="w-5 h-5" />,
      recommended: recommendedVisualizations.includes('area')
    },
    { 
      type: 'scatter', 
      label: 'Scatter Plot', 
      icon: <ScatterChart className="w-5 h-5" />,
      recommended: recommendedVisualizations.includes('scatter')
    },
    { 
      type: 'radar', 
      label: 'Radar Chart', 
      icon: <Radar className="w-5 h-5" />,
      recommended: recommendedVisualizations.includes('radar')
    },
    { 
      type: 'histogram', 
      label: 'Histogram', 
      icon: <BarChart className="w-5 h-5" />,
      recommended: recommendedVisualizations.includes('histogram')
    }
  ];

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-3">Select Visualization Type</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {visualizationTypes.map(({ type, label, icon, recommended }) => (
          <button
            key={type}
            onClick={() => onSelectVisualization(type)}
            className={`
              flex flex-col items-center justify-center p-3 rounded-lg border transition-all
              ${selectedVisualization === type 
                ? 'bg-primary-100 border-primary-500 text-primary-700' 
                : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-700'
              }
              ${recommended 
                ? 'ring-2 ring-offset-2 ring-primary-200' 
                : ''
              }
            `}
          >
            <div className="mb-2">
              {icon}
            </div>
            <span className="text-sm">{label}</span>
            {recommended && (
              <span className="text-xs text-primary-600 mt-1">Recommended</span>
            )}
          </button>
        ))}
      </div>
      
      <div className="mt-4 flex">
        <div className="bg-gray-50 px-3 py-2 rounded border text-sm">
          <span className="font-medium">Column type:</span> {columnInfo.dataType}
          {columnInfo.dataType === 'number' && columnInfo.min !== null && columnInfo.max !== null && (
            <span className="ml-2">
              (Range: {columnInfo.min} - {columnInfo.max})
            </span>
          )}
        </div>
        {columnInfo.uniqueValues && (
          <div className="bg-gray-50 px-3 py-2 rounded border text-sm ml-2">
            <span className="font-medium">Unique values:</span> {columnInfo.uniqueValues}
          </div>
        )}
      </div>
    </div>
  );
};

export default VisualizationOptions;