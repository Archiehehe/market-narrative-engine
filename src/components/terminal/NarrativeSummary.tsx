import { StockData } from '@/types/stock';

interface NarrativeSummaryProps {
  data: StockData;
}

export function NarrativeSummary({ data }: NarrativeSummaryProps) {
  const isPositive = data.quote.changePercent >= 0;
  const latestNews = data.news[0]?.headline || 'No recent news available';
  const truncatedNews = latestNews.length > 60 ? latestNews.substring(0, 60) + '...' : latestNews;

  return (
    <div className="bg-card border border-border rounded-lg p-5">
      <p className="font-mono text-base text-foreground leading-relaxed">
        {data.quote.symbol} at ${data.quote.price.toFixed(2)},{' '}
        <span className={isPositive ? 'text-positive' : 'text-negative'}>
          {isPositive ? '+' : ''}{data.quote.changePercent.toFixed(2)}%
        </span>{' '}
        (benchmark: {data.marketComparison.spyChange >= 0 ? '+' : ''}{data.marketComparison.spyChange.toFixed(2)}%).{' '}
        Recent: {truncatedNews}
      </p>
    </div>
  );
}
