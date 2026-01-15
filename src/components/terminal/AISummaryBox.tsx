import { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { StockData } from '@/types/stock';
import { toast } from 'sonner';

interface AISummaryBoxProps {
  data: StockData;
}

export function AISummaryBox({ data }: AISummaryBoxProps) {
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const generateSummary = async () => {
    setIsLoading(true);
    try {
      const { data: result, error } = await supabase.functions.invoke('ai-summary', {
        body: {
          type: 'market_summary',
          data: {
            symbol: data.quote.symbol,
            price: data.quote.price,
            changePercent: data.quote.changePercent,
            relativePerformance: data.marketComparison.relativePerformance,
            news: data.news,
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

  return (
    <div className="bg-card border border-border rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <h3 className="font-mono text-sm text-foreground">AI Market Summary</h3>
        </div>
        {!summary && (
          <Button
            variant="outline"
            size="sm"
            onClick={generateSummary}
            disabled={isLoading}
            className="font-mono text-xs gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-3 h-3 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-3 h-3" />
                Generate AI Summary
              </>
            )}
          </Button>
        )}
      </div>
      
      {summary ? (
        <p className="text-foreground font-mono text-sm leading-relaxed">{summary}</p>
      ) : (
        <p className="text-muted-foreground font-mono text-xs">
          Click the button above to generate an AI-powered summary of the latest market narratives for {data.quote.symbol}. The AI model runs entirely in your browser for privacy.
        </p>
      )}
    </div>
  );
}
