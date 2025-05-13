import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FileSpreadsheet, Upload, AlertCircle } from 'lucide-react';
import { parseFile } from '../utils/excelUtils';
import { ExcelData } from '../types';

interface FileUploaderProps {
  onDataLoaded: (data: ExcelData) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onDataLoaded }) => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setError(null);
    
    if (acceptedFiles.length === 0) {
      return;
    }
    
    const file = acceptedFiles[0];
    const fileType = file.name.split('.').pop()?.toLowerCase();
    
    if (!['xlsx', 'xls', 'csv'].includes(fileType || '')) {
      setError('Please upload an Excel (.xlsx, .xls) or CSV (.csv) file');
      return;
    }
    
    try {
      setIsLoading(true);
      const data = await parseFile(file);
      onDataLoaded(data);
      setIsLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse file');
      setIsLoading(false);
    }
  }, [onDataLoaded]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'text/csv': ['.csv']
    },
    maxFiles: 1
  });

  return (
    <div className="mb-8 w-full">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 transition-all duration-300 ease-in-out
          flex flex-col items-center justify-center text-center cursor-pointer
          ${isDragActive 
            ? 'border-primary-500 bg-primary-50' 
            : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
          }
        `}
      >
        <input {...getInputProps()} />
        
        {isLoading ? (
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600">Processing your file...</p>
          </div>
        ) : (
          <>
            <div className={`
              w-16 h-16 rounded-full flex items-center justify-center mb-4
              ${isDragActive ? 'bg-primary-100' : 'bg-gray-100'}
            `}>
              {isDragActive ? (
                <Upload className="w-8 h-8 text-primary-500" />
              ) : (
                <FileSpreadsheet className="w-8 h-8 text-gray-500" />
              )}
            </div>
            
            <h3 className="text-lg font-semibold mb-2">
              {isDragActive ? 'Drop your file here' : 'Upload your file'}
            </h3>
            
            <p className="text-gray-500 mb-2">
              Drag and drop your Excel (.xlsx, .xls) or CSV (.csv) file, or click to browse
            </p>
            
            <p className="text-sm text-gray-400">
              Your data will be processed locally in your browser
            </p>
          </>
        )}
      </div>
      
      {error && (
        <div className="mt-3 p-3 bg-error-50 border border-error-200 rounded-md flex items-start">
          <AlertCircle className="w-5 h-5 text-error-500 mr-2 flex-shrink-0 mt-0.5" />
          <p className="text-error-700 text-sm">{error}</p>
        </div>
      )}
    </div>
  );
};

export default FileUploader;