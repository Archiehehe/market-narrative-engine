import { useState } from 'react';
import { Newspaper, ExternalLink, Clock, Sparkles, Loader2 } from 'lucide-react';
import { NewsArticle } from '@/types/stock';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface MarketCatalystsProps {
  news: NewsArticle[];
}

function CatalystSummaryButton({ article }: { article: NewsArticle }) {
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const generateSummary = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsLoading(true);
    try {
      const { data: result, error } = await supabase.functions.invoke('ai-summary', {
        body: {
          type: 'catalyst_summary',
          data: {
            headline: article.headline,
            summary: article.summary,
          },
        },
      });

      if (error) throw error;
      if (result.error) throw new Error(result.error);
      
      setSummary(result.summary);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to generate summary';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (summary) {
    return (
      <p className="text-primary font-mono text-xs mt-2 pl-0 border-l-2 border-primary/30 ml-0 italic">
        {summary}
      </p>
    );
  }

  return (
    <button
      onClick={generateSummary}
      disabled={isLoading}
      className="mt-2 flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors text-xs font-mono"
      title="Generate AI summary"
    >
      {isLoading ? (
        <Loader2 className="w-3 h-3 animate-spin" />
      ) : (
        <Sparkles className="w-3 h-3" />
      )}
      <span>{isLoading ? 'Summarizing...' : 'AI Summary'}</span>
    </button>
  );
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
          <div key={article.id} className="news-item">
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start justify-between gap-4 group"
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
            <CatalystSummaryButton article={article} />
          </div>
        ))}
      </div>
    </div>
  );
}
