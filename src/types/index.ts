export interface TickData {
  digit: number;
  time: number;
  price: string;
}

export interface Stats {
  frequency: Record<number, number>;
  percentages: Record<number, number>;
  evenPercent: number;
  oddPercent: number;
  overPercent: number;
  underPercent: number;
  hotDigits: number[];
  coldDigits: number[];
  recentPattern: number[];
}

export interface Signal {
  type: 'STRONG EVEN' | 'STRONG ODD' | 'OVER LIKELY' | 'UNDER LIKELY' | 'NEUTRAL';
  confidence: number;
  direction: 'UP' | 'DOWN' | 'SIDEWAYS';
}

export interface RiskConfig {
  stake: number;
  stopLoss: number;
  maxTrades: number;
}