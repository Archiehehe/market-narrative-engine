import { XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart, Line, LineChart, Legend, ComposedChart } from 'recharts';
import { PricePoint } from '@/types/stock';
import { Check } from 'lucide-react';
import { useMemo } from 'react';

interface PriceChartProps {
  priceHistory: PricePoint[];
  spyHistory: PricePoint[];
  symbol: string;
  relativePerformance: number;
  confidence: number;
}

export function PriceChart({ priceHistory, spyHistory, symbol, relativePerformance, confidence }: PriceChartProps) {
  // Rebase both series to start from 0% returns
  const chartData = useMemo(() => {
    if (!priceHistory || priceHistory.length === 0) return [];
    
    const stockBasePrice = priceHistory[0]?.price || 1;
    const spyBasePrice = spyHistory?.[0]?.price || 1;
    
    // Create a map of SPY prices by date for easy lookup
    const spyPriceMap = new Map<string, number>();
    spyHistory?.forEach(point => {
      spyPriceMap.set(point.date, point.price);
    });
    
    return priceHistory.map((point, index) => {
      const stockReturn = ((point.price - stockBasePrice) / stockBasePrice) * 100;
      const spyPrice = spyPriceMap.get(point.date) || spyHistory?.[index]?.price;
      const spyReturn = spyPrice ? ((spyPrice - spyBasePrice) / spyBasePrice) * 100 : null;
      
      // Format date for display
      const date = new Date(point.date);
      const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      return {
        date: formattedDate,
        fullDate: point.date,
        [symbol]: stockReturn,
        SPY: spyReturn,
      };
    });
  }, [priceHistory, spyHistory, symbol]);

  if (!priceHistory || priceHistory.length === 0) {
    return (
      <div className="space-y-3">
        <p className="font-mono text-sm text-muted-foreground">30-day price history</p>
        <div className="h-48 bg-card border border-border rounded-lg flex items-center justify-center">
          <p className="text-muted-foreground font-mono text-sm">No price history available</p>
        </div>
      </div>
    );
  }

  const isPositive = relativePerformance >= 0;
  const stockColor = 'hsl(190, 100%, 60%)';
  const spyColor = 'hsl(0, 0%, 50%)';

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="font-mono text-sm text-muted-foreground">30-day price history</p>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 rounded" style={{ backgroundColor: stockColor }} />
            <span className="font-mono text-xs text-muted-foreground">{symbol}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 rounded" style={{ backgroundColor: spyColor }} />
            <span className="font-mono text-xs text-muted-foreground">SPY</span>
          </div>
        </div>
      </div>
      
      <div className="h-48 bg-card border border-border rounded-lg p-4">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="stockGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={stockColor} stopOpacity={0.3} />
                <stop offset="95%" stopColor={stockColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="date" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(0, 0%, 50%)', fontSize: 10, fontFamily: 'JetBrains Mono' }}
              interval="preserveStartEnd"
              tickCount={5}
            />
            <YAxis 
              domain={['auto', 'auto']}
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(0, 0%, 50%)', fontSize: 10, fontFamily: 'JetBrains Mono' }}
              width={50}
              tickFormatter={(value) => `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(0, 0%, 8%)',
                border: '1px solid hsl(0, 0%, 15%)',
                borderRadius: '6px',
                fontFamily: 'JetBrains Mono',
                fontSize: '12px',
              }}
              labelStyle={{ color: 'hsl(0, 0%, 50%)' }}
              formatter={(value: number, name: string) => [
                `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`,
                name
              ]}
            />
            <Area
              type="monotone"
              dataKey={symbol}
              stroke={stockColor}
              strokeWidth={2}
              fill="url(#stockGradient)"
            />
            <Line
              type="monotone"
              dataKey="SPY"
              stroke={spyColor}
              strokeWidth={1.5}
              strokeDasharray="4 4"
              dot={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-2">
          <Check className={`w-3 h-3 ${isPositive ? 'text-positive' : 'text-negative'}`} />
          <span className="text-muted-foreground">
            {symbol} {isPositive ? 'outperforming' : 'underperforming'} SPY by{' '}
            <span className={isPositive ? 'text-positive' : 'text-negative'}>
              {Math.abs(relativePerformance).toFixed(2)}%
            </span>
          </span>
        </div>
        <span className="text-muted-foreground">
          Confidence: {confidence}%
        </span>
      </div>
    </div>
  );
}
