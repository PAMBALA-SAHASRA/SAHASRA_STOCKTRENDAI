import React, { useState } from 'react';
import { Search, Calendar, Download, RefreshCw } from 'lucide-react';
import { fetchStockData, getPopularStocks } from '../../services/stockAPI';
import { StockData } from '../../types';

interface DataAcquisitionProps {
  onDataFetched: (data: StockData[], symbol: string) => void;
}

export const DataAcquisition: React.FC<DataAcquisitionProps> = ({
  onDataFetched,
}) => {
  const [symbol, setSymbol] = useState('AAPL');
  const [startDate, setStartDate] = useState('2024-01-01');
  const [endDate, setEndDate] = useState('2025-08-30');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [lastFetchedData, setLastFetchedData] = useState<StockData[] | null>(null);

  const popularStocks = getPopularStocks();

  const handleFetchData = async () => {
    if (!symbol || !startDate || !endDate) {
      setError('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const data = await fetchStockData(symbol, startDate, endDate);
      setLastFetchedData(data);
      onDataFetched(data, symbol);
    } catch (err) {
      setError('Failed to fetch stock data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSymbolSelect = (selectedSymbol: string) => {
    setSymbol(selectedSymbol);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Financial Data Acquisition</h1>
        <p className="text-gray-600">Connect to financial APIs and fetch real-time stock market data</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Data Parameters</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data Source
              </label>
              <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option>Yahoo Finance</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock Ticker Symbol
              </label>
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter stock symbol"
                />
              </div>
              
              <div className="grid grid-cols-4 gap-2">
                {popularStocks.map((stock) => (
                  <button
                    key={stock}
                    onClick={() => handleSymbolSelect(stock)}
                    className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                      symbol === stock
                        ? 'bg-blue-50 border-blue-200 text-blue-700'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {stock}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              onClick={handleFetchData}
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Fetching Data...</span>
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  <span>Fetch Stock Data</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Data Results</h2>
          
          {lastFetchedData ? (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                Successfully fetched {lastFetchedData.length} data points for {symbol}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Latest Price</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${lastFetchedData[lastFetchedData.length - 1]?.close.toFixed(2)}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Data Points</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {lastFetchedData.length}
                  </p>
                </div>
              </div>
              
              <div className="text-sm text-gray-500">
                Data will be cached to avoid redundant API calls
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-2">Enter stock parameters to fetch financial data</p>
              <p className="text-sm text-gray-400">Data will be cached to avoid redundant API calls</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};