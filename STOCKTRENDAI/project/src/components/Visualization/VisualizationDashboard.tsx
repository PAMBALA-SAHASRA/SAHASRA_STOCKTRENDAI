import React, { useState } from 'react';
import { StockData } from '../../types';
import { CandlestickChart } from '../Charts/CandlestickChart';
import { HeatMap } from '../Charts/HeatMap';
import { Histogram } from '../Charts/Histogram';
import { BarChart3, Activity, Grid3X3, TrendingUp } from 'lucide-react';

interface VisualizationDashboardProps {
  stockData: StockData[];
  symbol: string;
}

export const VisualizationDashboard: React.FC<VisualizationDashboardProps> = ({
  stockData,
  symbol,
}) => {
  const [activeChart, setActiveChart] = useState('candlestick');

  const chartTypes = [
    { id: 'candlestick', name: 'Candlestick Chart', icon: BarChart3 },
    { id: 'heatmap', name: 'Returns Heatmap', icon: Grid3X3 },
    { id: 'histogram', name: 'Distribution', icon: Activity },
  ];

  const renderChart = () => {
    if (!stockData || stockData.length === 0) {
      return (
        <div className="h-96 flex items-center justify-center text-gray-500 bg-gray-50 rounded-lg">
          <div className="text-center">
            <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p>No data available. Please fetch stock data first.</p>
          </div>
        </div>
      );
    }

    switch (activeChart) {
      case 'candlestick':
        return <CandlestickChart data={stockData} symbol={symbol} />;
      case 'heatmap':
        return <HeatMap data={stockData} symbol={symbol} />;
      case 'histogram':
        return <Histogram data={stockData} symbol={symbol} />;
      default:
        return <CandlestickChart data={stockData} symbol={symbol} />;
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Data Visualization</h1>
        <p className="text-gray-600">Interactive charts and advanced analytics for {symbol || 'stock data'}</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-wrap gap-2 mb-6">
          {chartTypes.map((chart) => (
            <button
              key={chart.id}
              onClick={() => setActiveChart(chart.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                activeChart === chart.id
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <chart.icon className="w-4 h-4" />
              <span>{chart.name}</span>
            </button>
          ))}
        </div>

        {renderChart()}

        {stockData && stockData.length > 0 && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-600 font-medium">Current Price</p>
              <p className="text-2xl font-bold text-blue-900">
                ${stockData[stockData.length - 1]?.close.toFixed(2)}
              </p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-600 font-medium">52W High</p>
              <p className="text-2xl font-bold text-green-900">
                ${Math.max(...stockData.map(d => d.high)).toFixed(2)}
              </p>
            </div>
            
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-sm text-red-600 font-medium">52W Low</p>
              <p className="text-2xl font-bold text-red-900">
                ${Math.min(...stockData.map(d => d.low)).toFixed(2)}
              </p>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-purple-600 font-medium">Volume</p>
              <p className="text-2xl font-bold text-purple-900">
                {(stockData[stockData.length - 1]?.volume / 1000000).toFixed(1)}M
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};