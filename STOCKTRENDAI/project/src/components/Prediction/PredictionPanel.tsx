import React, { useState, useEffect } from 'react';
import { Brain, TrendingUp, Calendar, Target } from 'lucide-react';
import { StockData, Prediction } from '../../types';
import { MovingAveragePredictor, LinearRegressionPredictor, LSTMSimulator } from '../../services/mlAlgorithms';
import { PredictionChart } from './PredictionChart';

interface PredictionPanelProps {
  stockData: StockData[];
  symbol: string;
}

export const PredictionPanel: React.FC<PredictionPanelProps> = ({ stockData, symbol }) => {
  const [predictions, setPredictions] = useState<{ [key: string]: Prediction[] }>({});
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('all');
  const [predictionDays, setPredictionDays] = useState(30);
  const [isLoading, setIsLoading] = useState(false);

  const algorithms = [
    { id: 'ma', name: 'Moving Average', predictor: new MovingAveragePredictor() },
    { id: 'lr', name: 'Linear Regression', predictor: new LinearRegressionPredictor() },
    { id: 'lstm', name: 'LSTM Neural Network', predictor: new LSTMSimulator() },
  ];

  const generatePredictions = async () => {
    if (!stockData || stockData.length === 0) return;

    setIsLoading(true);
    const newPredictions: { [key: string]: Prediction[] } = {};

    try {
      for (const algorithm of algorithms) {
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate processing time
        newPredictions[algorithm.id] = algorithm.predictor.predict(stockData, predictionDays);
      }
      setPredictions(newPredictions);
    } catch (error) {
      console.error('Error generating predictions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (stockData && stockData.length > 0) {
      generatePredictions();
    }
  }, [stockData, predictionDays]);

  const getDisplayPredictions = () => {
    if (selectedAlgorithm === 'all') {
      return Object.values(predictions).flat();
    }
    return predictions[selectedAlgorithm] || [];
  };

  const getAverageAccuracy = () => {
    const allPredictions = Object.values(predictions).flat();
    if (allPredictions.length === 0) return 0;
    return allPredictions.reduce((sum, p) => sum + p.confidence, 0) / allPredictions.length * 100;
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Prediction Engine</h1>
        <p className="text-gray-600">Advanced machine learning algorithms for stock price forecasting</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Prediction Settings</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Algorithm
              </label>
              <select
                value={selectedAlgorithm}
                onChange={(e) => setSelectedAlgorithm(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Algorithms</option>
                {algorithms.map(algo => (
                  <option key={algo.id} value={algo.id}>{algo.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prediction Period (Days)
              </label>
              <input
                type="number"
                value={predictionDays}
                onChange={(e) => setPredictionDays(parseInt(e.target.value))}
                min="1"
                max="365"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <button
              onClick={generatePredictions}
              disabled={isLoading || !stockData || stockData.length === 0}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <Brain className="w-5 h-5 animate-pulse" />
                  <span>Generating Predictions...</span>
                </>
              ) : (
                <>
                  <Target className="w-5 h-5" />
                  <span>Generate Predictions</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Model Performance</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Average Accuracy</span>
              <span className="text-xl font-bold text-green-600">
                {getAverageAccuracy().toFixed(1)}%
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Active Models</span>
              <span className="text-xl font-bold text-blue-600">{algorithms.length}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Predictions Generated</span>
              <span className="text-xl font-bold text-purple-600">
                {Object.values(predictions).reduce((sum, preds) => sum + preds.length, 0)}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
          
          {stockData && stockData.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Current Price</span>
                <span className="text-xl font-bold text-gray-900">
                  ${stockData[stockData.length - 1]?.close.toFixed(2)}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Data Range</span>
                <span className="text-sm text-gray-700">
                  {stockData.length} days
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Last Updated</span>
                <span className="text-sm text-gray-700">
                  {new Date().toLocaleTimeString()}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {stockData && stockData.length > 0 && (
        <PredictionChart
          stockData={stockData}
          predictions={getDisplayPredictions()}
          symbol={symbol}
        />
      )}
    </div>
  );
};