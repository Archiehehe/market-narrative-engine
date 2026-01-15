import { TrendingUp } from 'lucide-react';
import { StockData } from '@/types/stock';
import { getStockInfo } from '@/data/stockDatabase';

interface StockHeaderProps {
  data: StockData;
}

export function StockHeader({ data }: StockHeaderProps) {
  const stockInfo = getStockInfo(data.quote.symbol);
  const isPositive = data.quote.changePercent >= 0;

  return (
    <div className="flex items-start justify-between">
      <div>
        <h2 className="font-mono text-3xl md:text-4xl font-semibold text-foreground tracking-tight">
          {data.quote.symbol}
        </h2>
        <p className="text-muted-foreground font-mono text-sm mt-1">
          {stockInfo?.name || data.quote.symbol}
        </p>
        <p className="price-large mt-3">
          ${data.quote.price.toFixed(2)}
        </p>
        <div className="flex items-center gap-2 mt-3">
          <span className={data.status === 'outperforming' ? 'badge-positive' : data.status === 'underperforming' ? 'badge-negative' : 'badge-neutral'}>
            {data.status === 'outperforming' ? 'OUTPERFORMING' : data.status === 'underperforming' ? 'UNDERPERFORMING' : 'NEUTRAL'}
          </span>
          {stockInfo?.industry && (
            <span className="badge-neutral">
              {stockInfo.industry}
            </span>
          )}
        </div>
      </div>
      
      <div className="text-right">
        <div className="flex items-center gap-2 justify-end">
          <TrendingUp className={`w-5 h-5 ${isPositive ? 'text-positive' : 'text-negative'}`} />
          <span className={isPositive ? 'price-change-positive' : 'price-change-negative'}>
            {isPositive ? '+' : ''}{data.quote.changePercent.toFixed(2)}%
          </span>
        </div>
        <p className="text-muted-foreground text-sm mt-1 font-mono">
          1D Return
        </p>
      </div>
    </div>
  );
}
