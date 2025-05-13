import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { ColumnDataType, ColumnInfo, ExcelData } from '../types';

export const parseExcelFile = (file: File): Promise<ExcelData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        if (jsonData.length === 0) {
          throw new Error('No data found in Excel file');
        }
        
        // Extract headers and rows
        const headers = jsonData[0] as string[];
        const rows = [];
        
        for (let i = 1; i < jsonData.length; i++) {
          const row = jsonData[i] as any[];
          const rowData: Record<string, any> = {};
          
          headers.forEach((header, index) => {
            rowData[header] = row[index];
          });
          
          rows.push(rowData);
        }
        
        resolve({
          headers,
          rows,
          rawData: jsonData as any[][]
        });
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = (error) => {
      reject(error);
    };
    
    reader.readAsBinaryString(file);
  });
};

export const parseCsvFile = (file: File): Promise<ExcelData> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      complete: (results) => {
        try {
          if (results.data.length === 0) {
            throw new Error('No data found in CSV file');
          }

          const headers = results.data[0] as string[];
          const rows = [];

          for (let i = 1; i < results.data.length; i++) {
            const row = results.data[i] as any[];
            const rowData: Record<string, any> = {};

            headers.forEach((header, index) => {
              // Try to convert numeric strings to numbers
              const value = row[index];
              if (typeof value === 'string' && !isNaN(Number(value))) {
                rowData[header] = Number(value);
              } else {
                rowData[header] = value;
              }
            });

            rows.push(rowData);
          }

          resolve({
            headers,
            rows,
            rawData: results.data as any[][]
          });
        } catch (error) {
          reject(error);
        }
      },
      error: (error) => {
        reject(error);
      },
      header: false,
      skipEmptyLines: true,
      dynamicTyping: true
    });
  });
};

export const parseFile = async (file: File): Promise<ExcelData> => {
  const fileType = file.name.split('.').pop()?.toLowerCase();
  
  switch (fileType) {
    case 'xlsx':
    case 'xls':
      return parseExcelFile(file);
    case 'csv':
      return parseCsvFile(file);
    default:
      throw new Error('Unsupported file type. Please upload an Excel (.xlsx, .xls) or CSV (.csv) file.');
  }
};

export const determineColumnDataType = (columnData: any[]): ColumnDataType => {
  let hasNumber = false;
  let hasString = false;
  let hasDate = false;
  let hasBoolean = false;
  
  for (const value of columnData) {
    if (value === null || value === undefined) continue;
    
    if (typeof value === 'number') {
      hasNumber = true;
    } else if (typeof value === 'string') {
      // Check if it's a date
      const potentialDate = new Date(value);
      if (!isNaN(potentialDate.getTime()) && value.match(/\d{1,4}[-/]\d{1,2}[-/]\d{1,2}/)) {
        hasDate = true;
      } else {
        // Check if it's a boolean-like string
        if (['true', 'false', 'yes', 'no'].includes(value.toLowerCase())) {
          hasBoolean = true;
        } else {
          hasString = true;
        }
      }
    } else if (typeof value === 'boolean') {
      hasBoolean = true;
    }
    
    // If we've seen multiple types already, return mixed
    if ([hasNumber, hasString, hasDate, hasBoolean].filter(Boolean).length > 1) {
      return 'mixed';
    }
  }
  
  if (hasNumber) return 'number';
  if (hasDate) return 'date';
  if (hasBoolean) return 'boolean';
  return 'string';
};

export const analyzeColumnData = (data: ExcelData): ColumnInfo[] => {
  return data.headers.map((header, index) => {
    // Extract column values
    const columnValues = data.rows.map(row => row[header]);
    
    // Determine data type
    const dataType = determineColumnDataType(columnValues);
    
    // For numeric columns, calculate min and max
    let min: number | null = null;
    let max: number | null = null;
    
    if (dataType === 'number') {
      const numericValues = columnValues.filter(value => typeof value === 'number') as number[];
      if (numericValues.length > 0) {
        min = Math.min(...numericValues);
        max = Math.max(...numericValues);
      }
    }
    
    // Count unique values
    const uniqueValues = new Set(columnValues).size;
    
    return {
      key: header,
      name: header,
      dataType,
      uniqueValues,
      min,
      max
    };
  });
};

export const getRecommendedVisualizations = (columnInfo: ColumnInfo): VisualizationType[] => {
  const { dataType, uniqueValues } = columnInfo;
  
  switch (dataType) {
    case 'number':
      return ['bar', 'line', 'area', 'scatter', 'histogram'];
    case 'string':
      if (uniqueValues && uniqueValues < 10) {
        return ['pie', 'bar', 'radar'];
      }
      return ['bar'];
    case 'date':
      return ['line', 'area', 'bar'];
    case 'boolean':
      return ['pie', 'bar'];
    case 'mixed':
    default:
      return ['bar'];
  }
};

export const calculateHistogramBins = (data: number[], binCount: number = 10): { x0: number, x1: number, count: number }[] => {
  if (data.length === 0) return [];
  
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min;
  const binWidth = range / binCount;
  
  const bins = Array(binCount).fill(0).map((_, i) => ({
    x0: min + i * binWidth,
    x1: min + (i + 1) * binWidth,
    count: 0
  }));
  
  data.forEach(val => {
    // Handle edge case where val === max
    const binIndex = val === max 
      ? binCount - 1 
      : Math.floor((val - min) / binWidth);
    
    bins[binIndex].count++;
  });
  
  return bins;
};

export const countValueFrequency = (data: any[]): Record<string, number> => {
  const frequency: Record<string, number> = {};
  
  data.forEach(item => {
    const key = String(item);
    frequency[key] = (frequency[key] || 0) + 1;
  });
  
  return frequency;
};