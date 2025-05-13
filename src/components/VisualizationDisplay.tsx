import React from 'react';
import BarChartComponent from './visualization/BarChart';
import LineChartComponent from './visualization/LineChart';
import PieChartComponent from './visualization/PieChart';
import AreaChartComponent from './visualization/AreaChart';
import ScatterChartComponent from './visualization/ScatterChart';
import RadarChartComponent from './visualization/RadarChart';
import HistogramComponent from './visualization/Histogram';
import { VisualizationType } from '../types';
import { Download, Share2 } from 'lucide-react';

interface VisualizationDisplayProps {
  type: VisualizationType;
  data: any[];
  columnKey: string;
  title: string;
}

const VisualizationDisplay: React.FC<VisualizationDisplayProps> = ({
  type,
  data,
  columnKey,
  title
}) => {
  const renderVisualization = () => {
    switch (type) {
      case 'bar':
        return <BarChartComponent data={data} columnKey={columnKey} title={title} />;
      case 'line':
        return <LineChartComponent data={data} columnKey={columnKey} title={title} />;
      case 'pie':
        return <PieChartComponent data={data} columnKey={columnKey} title={title} />;
      case 'area':
        return <AreaChartComponent data={data} columnKey={columnKey} title={title} />;
      case 'scatter':
        return <ScatterChartComponent data={data} columnKey={columnKey} title={title} />;
      case 'radar':
        return <RadarChartComponent data={data} columnKey={columnKey} title={title} />;
      case 'histogram':
        return <HistogramComponent data={data} columnKey={columnKey} title={title} />;
      default:
        return <div>Select a visualization type</div>;
    }
  };

  const handleDownload = () => {
    // This is a placeholder for the download functionality
    // In a real app, we would generate an image or PDF of the visualization
    alert('Download functionality would be implemented here');
  };

  const handleShare = () => {
    // This is a placeholder for the share functionality
    alert('Share functionality would be implemented here');
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 animate-fade-in">
      <div className="flex justify-end gap-2 mb-2">
        <button 
          onClick={handleDownload}
          className="flex items-center gap-1 px-3 py-1.5 text-sm rounded bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Download</span>
        </button>
        <button 
          onClick={handleShare}
          className="flex items-center gap-1 px-3 py-1.5 text-sm rounded bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
        >
          <Share2 className="w-4 h-4" />
          <span>Share</span>
        </button>
      </div>
      <div className="border-t border-gray-100 pt-4">
        {renderVisualization()}
      </div>
    </div>
  );
};

export default VisualizationDisplay;