import { useState } from 'react';
import { StockPerformance } from '@/types/stock';

interface PerformanceTabsProps {
  performance: {
    '1D': StockPerformance;
    '5D': StockPerformance;
    '1M': StockPerformance;
  };
}

type Period = '1D' | '5D' | '1M';

export function PerformanceTabs({ performance }: PerformanceTabsProps) {
  const [activePeriod, setActivePeriod] = useState<Period>('1D');
  
  const periods: Period[] = ['1D', '5D', '1M'];

  return (
    <div className="grid grid-cols-3 gap-0 border border-border rounded-lg overflow-hidden">
      {periods.map((period) => {
        const perf = performance[period];
        const isPositive = perf.changePercent >= 0;
        const isActive = activePeriod === period;

        return (
          <button
            key={period}
            onClick={() => setActivePeriod(period)}
            className={`p-4 text-center transition-all duration-200 ${
              isActive 
                ? 'bg-primary/10 border-primary' 
                : 'bg-card hover:bg-secondary'
            } ${period !== '1M' ? 'border-r border-border' : ''}`}
          >
            <p className="font-mono text-sm text-muted-foreground mb-1">
              {period}
            </p>
            <p className={`font-mono text-lg font-medium ${isPositive ? 'text-positive' : 'text-negative'}`}>
              {isPositive ? '+' : ''}{perf.changePercent.toFixed(2)}%
            </p>
            <p className={`font-mono text-xs mt-1 ${perf.vsBenchmark >= 0 ? 'text-positive' : 'text-negative'}`}>
              {perf.vsBenchmark >= 0 ? '+' : ''}{perf.vsBenchmark.toFixed(2)}% vs benchmark
            </p>
          </button>
        );
      })}
    </div>
  );
}
