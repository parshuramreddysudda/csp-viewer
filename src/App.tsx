import React, { useState, useMemo } from 'react';
import FileUploader from './components/FileUploader';
import DataTable from './components/DataTable';
import VisualizationOptions from './components/VisualizationOptions';
import VisualizationDisplay from './components/VisualizationDisplay';
import Header from './components/Header';
import { ExcelData, VisualizationType, ColumnInfo } from './types';
import { analyzeColumnData } from './utils/excelUtils';
import { BarChart2, Table, FileSpreadsheet } from 'lucide-react';

function App() {
  const [data, setData] = useState<ExcelData | null>(null);
  const [selectedColumn, setSelectedColumn] = useState<string | null>(null);
  const [selectedVisualization, setSelectedVisualization] = useState<VisualizationType | null>(null);
  
  // Analyze column data for the selected column
  const columnInfo = useMemo<ColumnInfo | null>(() => {
    if (!data || !selectedColumn) return null;
    
    const allColumnInfo = analyzeColumnData(data);
    return allColumnInfo.find(info => info.key === selectedColumn) || null;
  }, [data, selectedColumn]);
  
  const handleDataLoaded = (excelData: ExcelData) => {
    setData(excelData);
    setSelectedColumn(null);
    setSelectedVisualization(null);
  };
  
  const handleSelectColumn = (column: string) => {
    setSelectedColumn(column);
    setSelectedVisualization(null);
  };
  
  const handleSelectVisualization = (type: VisualizationType) => {
    setSelectedVisualization(type);
  };
  
  const getVisualizationTitle = () => {
    if (!selectedColumn) return '';
    return `Distribution of ${selectedColumn}`;
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Excel Data Visualizer</h1>
          <p className="text-gray-600">
            Upload an Excel file to visualize your data in beautiful, interactive charts
          </p>
        </div>
        
        {!data ? (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 animate-fade-in">
            <FileUploader onDataLoaded={handleDataLoaded} />
            
            <div className="mt-8 border-t border-gray-100 pt-6">
              <h3 className="text-lg font-semibold mb-4">How It Works</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex justify-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                      <FileSpreadsheet className="w-6 h-6 text-primary-600" />
                    </div>
                  </div>
                  <h4 className="font-medium text-center mb-2">1. Upload Excel File</h4>
                  <p className="text-sm text-gray-600 text-center">
                    Drag and drop your Excel files or browse to select
                  </p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex justify-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                      <Table className="w-6 h-6 text-primary-600" />
                    </div>
                  </div>
                  <h4 className="font-medium text-center mb-2">2. View and Select Data</h4>
                  <p className="text-sm text-gray-600 text-center">
                    Review your data and select columns to visualize
                  </p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex justify-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                      <BarChart2 className="w-6 h-6 text-primary-600" />
                    </div>
                  </div>
                  <h4 className="font-medium text-center mb-2">3. Create Visualizations</h4>
                  <p className="text-sm text-gray-600 text-center">
                    Generate beautiful charts and data visualizations
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-fade-in">
            {/* Data Controls */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <h2 className="text-xl font-semibold">Your Excel Data</h2>
                <button 
                  onClick={() => setData(null)} 
                  className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors"
                >
                  Upload New File
                </button>
              </div>
              <p className="text-gray-600 mb-4">
                {data.rows.length} rows and {data.headers.length} columns found. 
                Select a column from the table below to visualize its data.
              </p>
              
              <DataTable 
                data={data} 
                onSelectColumn={handleSelectColumn} 
                selectedColumn={selectedColumn}
              />
            </div>
            
            {/* Visualization Options */}
            {selectedColumn && (
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 animate-slide-up">
                <h2 className="text-xl font-semibold mb-4">
                  Visualize Column: <span className="text-primary-600">{selectedColumn}</span>
                </h2>
                
                <VisualizationOptions 
                  selectedColumn={selectedColumn}
                  columnInfo={columnInfo}
                  onSelectVisualization={handleSelectVisualization}
                  selectedVisualization={selectedVisualization}
                />
              </div>
            )}
            
            {/* Visualization Display */}
            {selectedColumn && selectedVisualization && data && (
              <VisualizationDisplay 
                type={selectedVisualization}
                data={data.rows}
                columnKey={selectedColumn}
                title={getVisualizationTitle()}
              />
            )}
          </div>
        )}
      </main>
      
      <footer className="bg-white border-t border-gray-200 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            Excel Data Visualizer © {new Date().getFullYear()} | All data is processed locally in your browser
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;