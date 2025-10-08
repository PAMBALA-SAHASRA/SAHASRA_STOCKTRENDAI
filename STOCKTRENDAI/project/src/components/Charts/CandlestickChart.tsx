import React from 'react';
import { StockData } from '../../types';

interface CandlestickChartProps {
  data: StockData[];
  symbol: string;
}

export const CandlestickChart: React.FC<CandlestickChartProps> = ({ data, symbol }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-96 flex items-center justify-center text-gray-500">
        No data available for visualization
      </div>
    );
  }

  const maxPrice = Math.max(...data.map(d => d.high));
  const minPrice = Math.min(...data.map(d => d.low));
  const priceRange = maxPrice - minPrice;
  const padding = priceRange * 0.1;

  const chartHeight = 350;
  const chartWidth = Math.max(800, data.length * 8);

  const getY = (price: number) => {
    return chartHeight - ((price - minPrice + padding) / (priceRange + 2 * padding)) * chartHeight;
  };

  return (
    <div className="bg-white rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-4">{symbol} - Candlestick Chart</h3>
      <div className="overflow-x-auto">
        <svg width={chartWidth} height={chartHeight} className="border rounded">
          {data.map((candle, index) => {
            const x = (index / data.length) * chartWidth;
            const width = Math.max(2, chartWidth / data.length - 2);
            
            const openY = getY(candle.open);
            const closeY = getY(candle.close);
            const highY = getY(candle.high);
            const lowY = getY(candle.low);
            
            const isGreen = candle.close > candle.open;
            const bodyHeight = Math.abs(closeY - openY);
            const bodyY = Math.min(openY, closeY);
            
            return (
              <g key={index}>
                {/* Wick */}
                <line
                  x1={x + width / 2}
                  y1={highY}
                  x2={x + width / 2}
                  y2={lowY}
                  stroke={isGreen ? '#10B981' : '#EF4444'}
                  strokeWidth="1"
                />
                
                {/* Body */}
                <rect
                  x={x + 1}
                  y={bodyY}
                  width={width - 2}
                  height={Math.max(1, bodyHeight)}
                  fill={isGreen ? '#10B981' : '#EF4444'}
                  opacity={0.8}
                />
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};