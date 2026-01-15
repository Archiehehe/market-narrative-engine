import { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { searchStocks } from '@/data/stockDatabase';

interface TerminalSearchProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (symbol: string) => void;
  isLoading?: boolean;
}

export function TerminalSearch({ value, onChange, onSubmit, isLoading }: TerminalSearchProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (value.length > 0) {
      const results = searchStocks(value);
      setSuggestions(results);
      setShowSuggestions(results.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && value.trim()) {
      e.preventDefault();
      setShowSuggestions(false);
      onSubmit(value.trim().toUpperCase());
    }
    if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (symbol: string) => {
    onChange(symbol);
    setShowSuggestions(false);
    onSubmit(symbol);
  };

  const handleClear = () => {
    onChange('');
    inputRef.current?.focus();
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value.toUpperCase())}
          onKeyDown={handleKeyDown}
          onFocus={() => value && suggestions.length > 0 && setShowSuggestions(true)}
          placeholder="Enter ticker symbol..."
          className="terminal-search pl-12 pr-12"
          disabled={isLoading}
        />
        {value && (
          <button
            onClick={handleClear}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
      
      <p className="mt-2 text-sm text-muted-foreground font-mono tracking-wide">
        Press Enter to execute
      </p>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-popover border border-border rounded-lg shadow-xl z-50 overflow-hidden">
          {suggestions.map((symbol) => (
            <button
              key={symbol}
              onClick={() => handleSuggestionClick(symbol)}
              className="w-full px-4 py-3 text-left font-mono text-sm hover:bg-secondary transition-colors flex items-center gap-3"
            >
              <span className="text-foreground font-medium">{symbol}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
