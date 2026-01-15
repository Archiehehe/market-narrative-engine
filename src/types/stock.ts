export interface StockQuote {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  previousClose: number;
  open: number;
  high: number;
  low: number;
  volume: number;
  timestamp: number;
}

export interface StockPerformance {
  period: '1D' | '5D' | '1M';
  change: number;
  changePercent: number;
  vsBenchmark: number;
}

export interface PricePoint {
  date: string;
  price: number;
}

export interface NewsArticle {
  id: string;
  headline: string;
  source: string;
  datetime: number;
  url: string;
  summary?: string;
}

export interface StockData {
  quote: StockQuote;
  performance: {
    '1D': StockPerformance;
    '5D': StockPerformance;
    '1M': StockPerformance;
  };
  priceHistory: PricePoint[];
  news: NewsArticle[];
  range: {
    low: number;
    high: number;
  };
  marketComparison: {
    spyChange: number;
    relativePerformance: number;
  };
  status: 'outperforming' | 'underperforming' | 'neutral';
  confidence: number;
}
