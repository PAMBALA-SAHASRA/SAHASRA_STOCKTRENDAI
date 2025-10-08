import React from 'react';
import { StockData, Prediction } from '../../types';

interface PredictionChartProps {
  stockData: StockData[];
  predictions: Prediction[];
  symbol: string;
}

export const PredictionChart: React.FC<PredictionChartProps> = ({
  stockData,
  predictions,
  symbol,
}) => {
  const allPrices = [
    ...stockData.map(d => d.close),
    ...predictions.map(p => p.predicted),
  ];
  
  const minPrice = Math.min(...allPrices);
  const maxPrice = Math.max(...allPrices);
  const priceRange = maxPrice - minPrice;
  const padding = priceRange * 0.1;

  const chartHeight = 400;
  const chartWidth = 800;

  const getY = (price: number) => {
    return chartHeight - ((price - minPrice + padding) / (priceRange + 2 * padding)) * chartHeight;
  };

  const getX = (index: number, isHistorical: boolean) => {
    const totalPoints = stockData.length + predictions.length;
    if (isHistorical) {
      return (index / totalPoints) * chartWidth;
    } else {
      return ((stockData.length + index) / totalPoints) * chartWidth;
    }
  };

  // Group predictions by algorithm
  const predictionsByAlgorithm = predictions.reduce((acc, pred) => {
    if (!acc[pred.algorithm]) acc[pred.algorithm] = [];
    acc[pred.algorithm].push(pred);
    return acc;
  }, {} as { [key: string]: Prediction[] });

  const algorithmColors = {
    'Moving Average': '#3B82F6',
    'Linear Regression': '#10B981',
    'LSTM Neural Network': '#8B5CF6',
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">
        {symbol} - Price Prediction Visualization
      </h3>
      
      <div className="overflow-x-auto">
        <svg width={chartWidth} height={chartHeight} className="border rounded">
          {/* Historical data line */}
          <path
            d={`M ${stockData.map((d, i) => `${getX(i, true)},${getY(d.close)}`).join(' L ')}`}
            fill="none"
            stroke="#374151"
            strokeWidth="2"
          />
          
          {/* Historical data points */}
          {stockData.map((d, i) => (
            <circle
              key={`hist-${i}`}
              cx={getX(i, true)}
              cy={getY(d.close)}
              r="3"
              fill="#374151"
            >
              <title>{`${d.date}: $${d.close.toFixed(2)}`}</title>
            </circle>
          ))}
          
          {/* Prediction lines */}
          {Object.entries(predictionsByAlgorithm).map(([algorithm, preds]) => (
            <g key={algorithm}>
              <path
                d={`M ${getX(stockData.length - 1, true)},${getY(stockData[stockData.length - 1].close)} L ${preds.map((p, i) => `${getX(i, false)},${getY(p.predicted)}`).join(' L ')}`}
                fill="none"
                stroke={algorithmColors[algorithm as keyof typeof algorithmColors] || '#6B7280'}
                strokeWidth="2"
                strokeDasharray="5,5"
                opacity="0.8"
              />
              
              {preds.map((p, i) => (
                <circle
                  key={`pred-${algorithm}-${i}`}
                  cx={getX(i, false)}
                  cy={getY(p.predicted)}
                  r="3"
                  fill={algorithmColors[algorithm as keyof typeof algorithmColors] || '#6B7280'}
                  opacity="0.8"
                >
                  <title>{`${p.date}: $${p.predicted.toFixed(2)} (${algorithm})`}</title>
                </circle>
              ))}
            </g>
          ))}
          
          {/* Vertical separator line */}
          <line
            x1={getX(stockData.length - 1, true)}
            y1="0"
            x2={getX(stockData.length - 1, true)}
            y2={chartHeight}
            stroke="#EF4444"
            strokeWidth="2"
            strokeDasharray="3,3"
            opacity="0.6"
          />
        </svg>
      </div>
      
      <div className="mt-6 flex flex-wrap gap-4">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-gray-700 rounded-full"></div>
          <span className="text-sm text-gray-600">Historical Data</span>
        </div>
        {Object.keys(algorithmColors).map(algorithm => (
          <div key={algorithm} className="flex items-center space-x-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: algorithmColors[algorithm as keyof typeof algorithmColors] }}
            ></div>
            <span className="text-sm text-gray-600">{algorithm}</span>
          </div>
        ))}
      </div>
    </div>
  );
};