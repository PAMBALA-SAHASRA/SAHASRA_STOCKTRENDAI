import React from 'react';
import { StockData } from '../../types';

interface HistogramProps {
  data: StockData[];
  symbol: string;
}

export const Histogram: React.FC<HistogramProps> = ({ data, symbol }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-96 flex items-center justify-center text-gray-500">
        No data available for histogram
      </div>
    );
  }

  // Calculate daily returns
  const returns = data.slice(1).map((candle, index) => {
    const prevClose = data[index].close;
    const currentClose = candle.close;
    return ((currentClose - prevClose) / prevClose) * 100;
  });

  // Create histogram bins
  const numBins = 20;
  const minReturn = Math.min(...returns);
  const maxReturn = Math.max(...returns);
  const binWidth = (maxReturn - minReturn) / numBins;
  
  const bins = Array(numBins).fill(0).map((_, i) => ({
    range: [minReturn + i * binWidth, minReturn + (i + 1) * binWidth],
    count: 0,
    percentage: 0,
  }));

  returns.forEach(ret => {
    const binIndex = Math.min(Math.floor((ret - minReturn) / binWidth), numBins - 1);
    bins[binIndex].count++;
  });

  bins.forEach(bin => {
    bin.percentage = (bin.count / returns.length) * 100;
  });

  const maxCount = Math.max(...bins.map(b => b.count));

  return (
    <div className="bg-white rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-4">{symbol} - Returns Distribution</h3>
      <div className="h-80">
        <svg width="100%" height="100%" viewBox="0 0 600 300">
          {bins.map((bin, index) => {
            const x = (index / numBins) * 580 + 10;
            const height = (bin.count / maxCount) * 250;
            const y = 280 - height;
            const barWidth = 580 / numBins - 2;
            
            return (
              <g key={index}>
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={height}
                  fill={bin.range[0] < 0 && bin.range[1] < 0 ? '#EF4444' : 
                        bin.range[0] > 0 && bin.range[1] > 0 ? '#10B981' : '#6B7280'}
                  opacity={0.7}
                  className="hover:opacity-100 transition-opacity"
                >
                  <title>
                    {`Range: ${bin.range[0].toFixed(2)}% to ${bin.range[1].toFixed(2)}%\nCount: ${bin.count}\nPercentage: ${bin.percentage.toFixed(1)}%`}
                  </title>
                </rect>
              </g>
            );
          })}
          
          {/* X-axis */}
          <line x1="10" y1="280" x2="590" y2="280" stroke="#374151" strokeWidth="1" />
          
          {/* Y-axis */}
          <line x1="10" y1="30" x2="10" y2="280" stroke="#374151" strokeWidth="1" />
        </svg>
      </div>
      
      <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
        <div className="text-center">
          <p className="text-gray-600">Mean Return</p>
          <p className="font-semibold">{(returns.reduce((sum, r) => sum + r, 0) / returns.length).toFixed(2)}%</p>
        </div>
        <div className="text-center">
          <p className="text-gray-600">Volatility (Std Dev)</p>
          <p className="font-semibold">
            {Math.sqrt(returns.reduce((sum, r) => sum + Math.pow(r - returns.reduce((s, x) => s + x, 0) / returns.length, 2), 0) / returns.length).toFixed(2)}%
          </p>
        </div>
        <div className="text-center">
          <p className="text-gray-600">Data Points</p>
          <p className="font-semibold">{returns.length}</p>
        </div>
      </div>
    </div>
  );
};