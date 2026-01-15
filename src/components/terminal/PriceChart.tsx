import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { PricePoint } from '@/types/stock';
import { Check } from 'lucide-react';

interface PriceChartProps {
  priceHistory: PricePoint[];
  symbol: string;
  relativePerformance: number;
  confidence: number;
}

export function PriceChart({ priceHistory, symbol, relativePerformance, confidence }: PriceChartProps) {
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
  const chartColor = isPositive ? 'hsl(190, 100%, 60%)' : 'hsl(0, 70%, 55%)';

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="font-mono text-sm text-muted-foreground">30-day price history</p>
        <div className="flex items-center gap-2">
          <div className="w-3 h-0.5 bg-primary rounded" />
          <span className="font-mono text-xs text-muted-foreground">{symbol}</span>
        </div>
      </div>
      
      <div className="h-48 bg-card border border-border rounded-lg p-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={priceHistory} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartColor} stopOpacity={0.3} />
                <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="date" 
              axisLine={false}
              tickLine={false}
              tick={false}
            />
            <YAxis 
              domain={['auto', 'auto']}
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(0, 0%, 50%)', fontSize: 10, fontFamily: 'JetBrains Mono' }}
              width={50}
              tickFormatter={(value) => `$${value.toFixed(0)}`}
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
              itemStyle={{ color: 'hsl(0, 0%, 90%)' }}
              formatter={(value: number) => [`$${value.toFixed(2)}`, 'Price']}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke={chartColor}
              strokeWidth={2}
              fill="url(#priceGradient)"
            />
          </AreaChart>
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
