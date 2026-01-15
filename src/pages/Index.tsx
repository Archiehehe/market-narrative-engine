import { useState } from 'react';
import { TerminalSearch } from '@/components/terminal/TerminalSearch';
import { StockCard } from '@/components/terminal/StockCard';
import { useStockData } from '@/hooks/useStockData';
import { Loader2 } from 'lucide-react';

const Index = () => {
  const [searchValue, setSearchValue] = useState('');
  const { data, isLoading, error, fetchStock } = useStockData();

  const handleSubmit = (symbol: string) => {
    fetchStock(symbol);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="pt-16 pb-8 px-4">
        <div className="text-center">
          <h1 className="terminal-title">NARRATIVE TERMINAL</h1>
          <p className="terminal-subtitle mt-3">Market intelligence engine</p>
        </div>
      </header>

      {/* Search */}
      <section className="px-4 pb-8">
        <TerminalSearch
          value={searchValue}
          onChange={setSearchValue}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </section>

      {/* Content */}
      <main className="flex-1 px-4 pb-16">
        {isLoading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        )}

        {error && !isLoading && (
          <div className="max-w-2xl mx-auto">
            <div className="error-box">
              {error}
            </div>
          </div>
        )}

        {data && !isLoading && (
          <StockCard data={data} />
        )}

        {!data && !isLoading && !error && (
          <div className="text-center py-16">
            <p className="text-muted-foreground font-mono text-sm">
              Enter a stock ticker to begin
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-4 px-4 border-t border-border">
        <p className="text-center text-muted-foreground text-xs font-mono">
          Data provided by Finnhub & Polygon · Not financial advice
        </p>
      </footer>
    </div>
  );
};

export default Index;
