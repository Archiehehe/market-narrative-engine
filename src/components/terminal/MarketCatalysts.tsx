import { Newspaper, ExternalLink, Clock } from 'lucide-react';
import { NewsArticle } from '@/types/stock';

interface MarketCatalystsProps {
  news: NewsArticle[];
}

export function MarketCatalysts({ news }: MarketCatalystsProps) {
  if (!news || news.length === 0) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Newspaper className="w-4 h-4 text-muted-foreground" />
          <h3 className="font-mono text-sm text-muted-foreground tracking-wide">
            Market Catalysts
          </h3>
        </div>
        <p className="text-muted-foreground text-sm font-mono">No recent news available</p>
      </div>
    );
  }

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toISOString().replace('T', ' ').substring(0, 16);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Newspaper className="w-4 h-4 text-muted-foreground" />
        <h3 className="font-mono text-sm text-muted-foreground tracking-wide">
          Market Catalysts
        </h3>
      </div>
      
      <div className="space-y-2">
        {news.map((article) => (
          <a
            key={article.id}
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="news-item flex items-start justify-between gap-4 group"
          >
            <div className="flex-1 min-w-0">
              <p className="text-foreground font-mono text-sm leading-relaxed group-hover:text-primary transition-colors">
                {article.headline}
              </p>
              <div className="flex items-center gap-3 mt-2 text-muted-foreground text-xs font-mono">
                <span>{article.source}</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatDate(article.datetime)}
                </span>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-1" />
          </a>
        ))}
      </div>
    </div>
  );
}
