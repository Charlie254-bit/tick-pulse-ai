export interface TickData {
  epoch: number;
  quote: number;
  digit: number;
}

export interface DigitStats {
  digit: number;
  count: number;
  percentage: number;
}

export interface AnalysisResult {
  frequency: DigitStats[];
  // Compatibility with old components
  frequencyMap: Record<number, number>;
  percentages: Record<number, number>;
  evenPercent: number;
  oddPercent: number;
  overPercent: number;
  underPercent: number;
  recentPattern: number[];
  
  // New names
  evenPercentage: number;
  oddPercentage: number;
  overPercentage: number;
  underPercentage: number;
  
  // Advisor fields
  overUnderProbabilities: Record<number, { over: number; under: number }>;
  momentum: {
    even: number;
    odd: number;
    over: number;
    under: number;
  };
  hotDigits: number[];
  coldDigits: number[];
  streak: {
    digit: number | null;
    count: number;
  };
  lastDigits: number[];
}

export type SignalStrength = 'STRONG' | 'MODERATE' | 'WEAK' | 'AVOID';

export interface AdvisorSignal {
  type: 'STRONG BUY EVEN' | 'STRONG BUY ODD' | 'BUY OVER' | 'BUY UNDER' | 'WAIT' | 'WEAK SIGNAL' | 'WAIT FOR CONFIRMATION';
  confidence: number;
  strength: SignalStrength;
  recommendation: string;
  bias: number;
  momentum: number;
}

export interface TradeDecision {
  label: string;
  probability: number;
  status: 'TRADE' | 'AVOID' | 'GOOD ENTRY';
  confidence: number;
}

export type TickWindow = 100 | 250 | 500;
export type TradingMode = 'even_odd' | 'over_under';
export type OverUnderThreshold = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export interface VolatilityMarket {
  id: string;
  name: string;
  symbol: string;
  type: 'fast' | 'standard';
}

export const MARKETS: VolatilityMarket[] = [
  { id: 'v10_1s', name: 'Volatility 10 (1s)', symbol: '1HZ10V', type: 'fast' },
  { id: 'v25_1s', name: 'Volatility 25 (1s)', symbol: '1HZ25V', type: 'fast' },
  { id: 'v50_1s', name: 'Volatility 50 (1s)', symbol: '1HZ50V', type: 'fast' },
  { id: 'v75_1s', name: 'Volatility 75 (1s)', symbol: '1HZ75V', type: 'fast' },
  { id: 'v100_1s', name: 'Volatility 100 (1s)', symbol: '1HZ100V', type: 'fast' },
  { id: 'v10', name: 'Volatility 10', symbol: 'R_10', type: 'standard' },
  { id: 'v25', name: 'Volatility 25', symbol: 'R_25', type: 'standard' },
  { id: 'v50', name: 'Volatility 50', symbol: 'R_50', type: 'standard' },
  { id: 'v75', name: 'Volatility 75', symbol: 'R_75', type: 'standard' },
  { id: 'v100', name: 'Volatility 100', symbol: 'R_100', type: 'standard' },
];