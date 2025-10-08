import React, { useState, useEffect } from 'react';
import { StockData } from '../../types';
import { BarChart3, TrendingUp, TrendingDown, Activity } from 'lucide-react';

interface DataProcessingProps {
  stockData: StockData[];
  symbol: string;
}

export const DataProcessing: React.FC<DataProcessingProps> = ({ stockData, symbol }) => {
  const [processedStats, setProcessedStats] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (stockData && stockData.length > 0) {
      processData();
    }
  }, [stockData]);

  const processData = async () => {
    setIsProcessing(true);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Calculate technical indicators
    const prices = stockData.map(d => d.close);
    const volumes = stockData.map(d => d.volume);
    
    // Moving averages
    const sma20 = calculateSMA(prices, 20);
    const sma50 = calculateSMA(prices, 50);
    
    // RSI
    const rsi = calculateRSI(prices, 14);
    
    // Volatility
    const returns = prices.slice(1).map((price, i) => (price - prices[i]) / prices[i]);
    const volatility = Math.sqrt(returns.reduce((sum, r) => sum + r * r, 0) / returns.length) * Math.sqrt(252) * 100;
    
    // Price change
    const priceChange = prices[prices.length - 1] - prices[0];
    const priceChangePercent = (priceChange / prices[0]) * 100;
    
    setProcessedStats({
      sma20: sma20[sma20.length - 1],
      sma50: sma50[sma50.length - 1],
      rsi: rsi[rsi.length - 1],
      volatility,
      priceChange,
      priceChangePercent,
      avgVolume: volumes.reduce((sum, v) => sum + v, 0) / volumes.length,
      highestPrice: Math.max(...prices),
      lowestPrice: Math.min(...prices),
    });
    
    setIsProcessing(false);
  };

  const calculateSMA = (prices: number[], period: number): number[] => {
    const sma = [];
    for (let i = period - 1; i < prices.length; i++) {
      const sum = prices.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
      sma.push(sum / period);
    }
    return sma;
  };

  const calculateRSI = (prices: number[], period: number): number[] => {
    const gains: number[] = [];
    const losses: number[] = [];
    
    for (let i = 1; i < prices.length; i++) {
      const change = prices[i] - prices[i - 1];
      gains.push(change > 0 ? change : 0);
      losses.push(change < 0 ? Math.abs(change) : 0);
    }
    
    const rsi = [];
    for (let i = period - 1; i < gains.length; i++) {
      const avgGain = gains.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0) / period;
      const avgLoss = losses.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0) / period;
      const rs = avgGain / avgLoss;
      rsi.push(100 - (100 / (1 + rs)));
    }
    
    return rsi;
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Data Processing & Analytics</h1>
        <p className="text-gray-600">Technical indicators and statistical analysis for {symbol || 'selected stock'}</p>
      </div>

      {isProcessing ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <Activity className="w-12 h-12 text-blue-600 mx-auto mb-4 animate-pulse" />
          <p className="text-lg text-gray-700">Processing market data...</p>
          <p className="text-gray-500">Calculating technical indicators and statistics</p>
        </div>
      ) : processedStats ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Moving Averages</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">SMA 20</span>
                <span className="font-bold text-blue-600">${processedStats.sma20?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">SMA 50</span>
                <span className="font-bold text-purple-600">${processedStats.sma50?.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Momentum Indicators</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">RSI (14)</span>
                <span className={`font-bold ${processedStats.rsi > 70 ? 'text-red-600' : processedStats.rsi < 30 ? 'text-green-600' : 'text-gray-600'}`}>
                  {processedStats.rsi?.toFixed(1)}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${processedStats.rsi > 70 ? 'bg-red-500' : processedStats.rsi < 30 ? 'bg-green-500' : 'bg-blue-500'}`}
                  style={{ width: `${processedStats.rsi}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Volatility Analysis</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Annualized Volatility</span>
                <span className="font-bold text-orange-600">{processedStats.volatility?.toFixed(1)}%</span>
              </div>
              <div className="text-sm text-gray-500">
                {processedStats.volatility > 30 ? 'High volatility' : processedStats.volatility > 15 ? 'Moderate volatility' : 'Low volatility'}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Price Performance</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Change</span>
                <div className="flex items-center space-x-1">
                  {processedStats.priceChange > 0 ? (
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-600" />
                  )}
                  <span className={`font-bold ${processedStats.priceChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {processedStats.priceChangePercent?.toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Price Range</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Highest</span>
                <span className="font-bold text-green-600">${processedStats.highestPrice?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Lowest</span>
                <span className="font-bold text-red-600">${processedStats.lowestPrice?.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Volume Analysis</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Average Volume</span>
                <span className="font-bold text-indigo-600">
                  {(processedStats.avgVolume / 1000000).toFixed(1)}M
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-lg text-gray-700 mb-2">No data to process</p>
          <p className="text-gray-500">Please fetch stock data first to begin analysis</p>
        </div>
      )}
    </div>
  );
};