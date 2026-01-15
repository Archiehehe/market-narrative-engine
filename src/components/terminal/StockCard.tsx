import { StockData } from '@/types/stock';
import { StockHeader } from './StockHeader';
import { PerformanceTabs } from './PerformanceTabs';
import { MarketComparison } from './MarketComparison';
import { NarrativeSummary } from './NarrativeSummary';
import { AISummaryBox } from './AISummaryBox';
import { MarketCatalysts } from './MarketCatalysts';
import { PriceChart } from './PriceChart';

interface StockCardProps {
  data: StockData;
}

export function StockCard({ data }: StockCardProps) {
  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 animate-slide-up">
      <StockHeader data={data} />
      
      <PerformanceTabs performance={data.performance} />
      
      <MarketComparison data={data} />
      
      <NarrativeSummary data={data} />
      
      <MarketCatalysts news={data.news} />
      
      <PriceChart 
        priceHistory={data.priceHistory}
        spyHistory={data.spyHistory}
        symbol={data.quote.symbol}
        relativePerformance={data.marketComparison.relativePerformance}
        confidence={data.confidence}
      />
      
      <AISummaryBox data={data} />
    </div>
  );
}
