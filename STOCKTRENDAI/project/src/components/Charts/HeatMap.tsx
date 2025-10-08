import React from 'react';
import { StockData } from '../../types';

interface HeatMapProps {
  data: StockData[];
  symbol: string;
}

export const HeatMap: React.FC<HeatMapProps> = ({ data, symbol }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-96 flex items-center justify-center text-gray-500">
        No data available for heatmap
      </div>
    );
  }

  // Calculate daily returns for heatmap
  const returns = data.slice(1).map((candle, index) => {
    const prevClose = data[index].close;
    const currentClose = candle.close;
    return {
      date: candle.date,
      return: ((currentClose - prevClose) / prevClose) * 100,
    };
  });

  const maxReturn = Math.max(...returns.map(r => Math.abs(r.return)));
  
  // Group by weeks for better visualization
  const weeks: { week: string; days: typeof returns }[] = [];
  let currentWeek: typeof returns = [];
  let currentWeekStart = '';

  returns.forEach(item => {
    const date = new Date(item.date);
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay());
    const weekKey = weekStart.toISOString().split('T')[0];

    if (currentWeekStart !== weekKey) {
      if (currentWeek.length > 0) {
        weeks.push({ week: currentWeekStart, days: [...currentWeek] });
      }
      currentWeek = [item];
      currentWeekStart = weekKey;
    } else {
      currentWeek.push(item);
    }
  });

  if (currentWeek.length > 0) {
    weeks.push({ week: currentWeekStart, days: currentWeek });
  }

  const getColor = (returnValue: number) => {
    const intensity = Math.abs(returnValue) / maxReturn;
    if (returnValue > 0) {
      return `rgba(34, 197, 94, ${intensity * 0.8 + 0.2})`;
    } else {
      return `rgba(239, 68, 68, ${intensity * 0.8 + 0.2})`;
    }
  };

  return (
    <div className="bg-white rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-4">{symbol} - Daily Returns Heatmap</h3>
      <div className="overflow-x-auto">
        <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${Math.max(...weeks.map(w => w.days.length))}, 1fr)` }}>
          {weeks.slice(0, 20).map((week, weekIndex) => (
            <React.Fragment key={weekIndex}>
              {week.days.map((day, dayIndex) => (
                <div
                  key={`${weekIndex}-${dayIndex}`}
                  className="w-8 h-8 rounded cursor-pointer transition-transform hover:scale-110"
                  style={{ backgroundColor: getColor(day.return) }}
                  title={`${day.date}: ${day.return.toFixed(2)}%`}
                />
              ))}
            </React.Fragment>
          ))}
        </div>
        <div className="flex items-center justify-center mt-4 space-x-4 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-400 rounded"></div>
            <span>Negative Returns</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-400 rounded"></div>
            <span>Positive Returns</span>
          </div>
        </div>
      </div>
    </div>
  );
};