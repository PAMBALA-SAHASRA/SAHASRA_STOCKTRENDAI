import { StockData, Prediction } from '../types';

export class MovingAveragePredictor {
  private window: number;

  constructor(window: number = 20) {
    this.window = window;
  }

  predict(data: StockData[], days: number = 30): Prediction[] {
    const predictions: Prediction[] = [];
    const prices = data.map(d => d.close);
    
    for (let i = 0; i < days; i++) {
      const recentPrices = prices.slice(-this.window);
      const ma = recentPrices.reduce((sum, price) => sum + price, 0) / recentPrices.length;
      
      const futureDate = new Date(data[data.length - 1].date);
      futureDate.setDate(futureDate.getDate() + i + 1);
      
      predictions.push({
        date: futureDate.toISOString().split('T')[0],
        predicted: parseFloat(ma.toFixed(2)),
        confidence: Math.max(0.6, Math.random() * 0.4 + 0.6),
        algorithm: 'Moving Average',
      });
      
      prices.push(ma);
    }
    
    return predictions;
  }
}

export class LinearRegressionPredictor {
  predict(data: StockData[], days: number = 30): Prediction[] {
    const predictions: Prediction[] = [];
    const prices = data.map(d => d.close);
    const n = prices.length;
    
    // Simple linear regression
    const x = Array.from({ length: n }, (_, i) => i);
    const y = prices;
    
    const sumX = x.reduce((sum, val) => sum + val, 0);
    const sumY = y.reduce((sum, val) => sum + val, 0);
    const sumXY = x.reduce((sum, val, i) => sum + val * y[i], 0);
    const sumXX = x.reduce((sum, val) => sum + val * val, 0);
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    
    for (let i = 0; i < days; i++) {
      const futureX = n + i;
      const predicted = slope * futureX + intercept;
      
      const futureDate = new Date(data[data.length - 1].date);
      futureDate.setDate(futureDate.getDate() + i + 1);
      
      predictions.push({
        date: futureDate.toISOString().split('T')[0],
        predicted: parseFloat(predicted.toFixed(2)),
        confidence: Math.max(0.5, Math.random() * 0.5 + 0.5),
        algorithm: 'Linear Regression',
      });
    }
    
    return predictions;
  }
}

export class LSTMSimulator {
  predict(data: StockData[], days: number = 30): Prediction[] {
    const predictions: Prediction[] = [];
    const prices = data.map(d => d.close);
    
    // Simulate LSTM-like predictions with trend analysis
    const shortTerm = prices.slice(-10);
    const mediumTerm = prices.slice(-30);
    
    const shortTrend = this.calculateTrend(shortTerm);
    const mediumTrend = this.calculateTrend(mediumTerm);
    
    let lastPrice = prices[prices.length - 1];
    
    for (let i = 0; i < days; i++) {
      const trendFactor = 0.7 * shortTrend + 0.3 * mediumTrend;
      const noise = (Math.random() - 0.5) * 0.02; // 2% noise
      const predicted = lastPrice * (1 + trendFactor + noise);
      
      const futureDate = new Date(data[data.length - 1].date);
      futureDate.setDate(futureDate.getDate() + i + 1);
      
      predictions.push({
        date: futureDate.toISOString().split('T')[0],
        predicted: parseFloat(predicted.toFixed(2)),
        confidence: Math.max(0.7, Math.random() * 0.3 + 0.7),
        algorithm: 'LSTM Neural Network',
      });
      
      lastPrice = predicted;
    }
    
    return predictions;
  }

  private calculateTrend(prices: number[]): number {
    if (prices.length < 2) return 0;
    
    const changes = [];
    for (let i = 1; i < prices.length; i++) {
      changes.push((prices[i] - prices[i - 1]) / prices[i - 1]);
    }
    
    return changes.reduce((sum, change) => sum + change, 0) / changes.length;
  }
}