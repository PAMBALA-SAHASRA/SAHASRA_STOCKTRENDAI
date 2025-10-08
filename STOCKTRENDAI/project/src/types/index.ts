export interface User {
  id: string;
  email: string;
  name: string;
}

export interface StockData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  adjClose: number;
}

export interface Prediction {
  date: string;
  predicted: number;
  confidence: number;
  algorithm: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface ChartConfig {
  type: 'candlestick' | 'line' | 'heatmap' | 'histogram';
  timeframe: 'daily' | 'monthly' | 'yearly';
}