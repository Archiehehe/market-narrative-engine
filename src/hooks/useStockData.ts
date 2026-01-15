import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { StockData } from '@/types/stock';
import { toast } from 'sonner';

export function useStockData() {
  const [data, setData] = useState<StockData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStock = async (symbol: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data: response, error: fetchError } = await supabase.functions.invoke('stock-data', {
        body: { symbol: symbol.toUpperCase() },
      });

      if (fetchError) {
        throw new Error(fetchError.message);
      }

      if (response.error) {
        throw new Error(response.error);
      }

      setData(response as StockData);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch stock data';
      setError(message);
      toast.error(message);
      setData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const clearData = () => {
    setData(null);
    setError(null);
  };

  return {
    data,
    isLoading,
    error,
    fetchStock,
    clearData,
  };
}
