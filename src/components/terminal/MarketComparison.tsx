import { StockData } from '@/types/stock';

interface MarketComparisonProps {
  data: StockData;
}

export function MarketComparison({ data }: MarketComparisonProps) {
  const isSpyPositive = data.marketComparison.spyChange >= 0;
  const isRelativePositive = data.marketComparison.relativePerformance >= 0;

  return (
    <div className="flex items-center justify-between py-3 px-4 bg-card border border-border rounded-lg">
      <div className="flex items-center gap-6">
        <div>
          <span className="text-muted-foreground font-mono text-sm">Range: </span>
          <span className="text-foreground font-mono">
            ${data.range.low.toFixed(2)} — ${data.range.high.toFixed(2)}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div>
          <span className="text-muted-foreground font-mono text-sm">vs Market (SPY): </span>
          <span className={`font-mono ${isSpyPositive ? 'text-positive' : 'text-negative'}`}>
            {isSpyPositive ? '+' : ''}{data.marketComparison.spyChange.toFixed(2)}%
          </span>
        </div>
        <div>
          <span className="text-muted-foreground font-mono text-sm">Relative: </span>
          <span className={`font-mono ${isRelativePositive ? 'text-positive' : 'text-negative'}`}>
            {isRelativePositive ? '+' : ''}{data.marketComparison.relativePerformance.toFixed(2)}%
          </span>
        </div>
      </div>
    </div>
  );
}
