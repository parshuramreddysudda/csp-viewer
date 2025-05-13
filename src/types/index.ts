export interface ExcelData {
  headers: string[];
  rows: Record<string, any>[];
  rawData: any[][];
}

export interface VisualizationConfig {
  type: VisualizationType;
  columnKey: string;
  title: string;
}

export type VisualizationType = 
  | 'bar' 
  | 'line' 
  | 'pie' 
  | 'area' 
  | 'scatter'
  | 'radar'
  | 'histogram';

export type ColumnDataType = 'string' | 'number' | 'date' | 'boolean' | 'mixed';

export interface ColumnInfo {
  key: string;
  name: string;
  dataType: ColumnDataType;
  uniqueValues?: number;
  min?: number | null;
  max?: number | null;
}

export interface FilterOptions {
  column: string;
  operator: FilterOperator;
  value: string | number;
}

export type FilterOperator = 
  | 'equals' 
  | 'notEquals' 
  | 'contains' 
  | 'notContains'
  | 'greaterThan'
  | 'lessThan'
  | 'startsWith'
  | 'endsWith';