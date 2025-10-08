import { StockData } from '../types';

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const cache = new Map<string, { data: StockData[]; timestamp: number }>();

export const fetchStockData = async (
  symbol: string,
  startDate: string,
  endDate: string
): Promise<StockData[]> => {
  const cacheKey = `${symbol}-${startDate}-${endDate}`;
  const cached = cache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  try {
    // Simulate real stock data with realistic patterns
    const start = new Date(startDate);
    const end = new Date(endDate);
    const data: StockData[] = [];
    
    let basePrice = 150 + Math.random() * 100; // Random starting price
    const volatility = 0.02; // 2% daily volatility
    
    for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
      if (date.getDay() !== 0 && date.getDay() !== 6) { // Skip weekends
        const change = (Math.random() - 0.5) * volatility * basePrice;
        const open = basePrice;
        const close = basePrice + change;
        const high = Math.max(open, close) + Math.random() * 0.01 * basePrice;
        const low = Math.min(open, close) - Math.random() * 0.01 * basePrice;
        const volume = Math.floor(Math.random() * 10000000) + 1000000;
        
        data.push({
          date: date.toISOString().split('T')[0],
          open: parseFloat(open.toFixed(2)),
          high: parseFloat(high.toFixed(2)),
          low: parseFloat(low.toFixed(2)),
          close: parseFloat(close.toFixed(2)),
          volume,
          adjClose: parseFloat(close.toFixed(2)),
        });
        
        basePrice = close;
      }
    }
    
    cache.set(cacheKey, { data, timestamp: Date.now() });
    return data;
  } catch (error) {
    console.error('Error fetching stock data:', error);
    throw new Error('Failed to fetch stock data');
  }
};

export const getPopularStocks = () => [
  'AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA', 'NVDA', 'META', 'NFLX'
];