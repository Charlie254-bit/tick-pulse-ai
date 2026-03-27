import { AnalysisResult, DigitStats } from './types';

export function calculateStats(ticks: any[]): AnalysisResult {
  const digits = ticks.map(t => t.digit);
  const total = digits.length || 1;
  
  const frequencyMap: Record<number, number> = {};
  for (let i = 0; i <= 9; i++) frequencyMap[i] = 0;
  digits.forEach(d => frequencyMap[d]++);

  const frequency: DigitStats[] = Object.entries(frequencyMap).map(([digit, count]) => ({
    digit: parseInt(digit),
    count,
    percentage: (count / total) * 100
  }));

  const percentages: Record<number, number> = {};
  for (let i = 0; i <= 9; i++) {
    percentages[i] = (frequencyMap[i] / total) * 100;
  }

  const evenCount = digits.filter(d => d % 2 === 0).length;
  const oddCount = total - evenCount;

  // Threshold probabilities
  const overUnderProbabilities: Record<number, { over: number; under: number }> = {};
  for (let t = 0; t <= 9; t++) {
    const over = digits.filter(d => d > t).length;
    const under = digits.filter(d => d < t).length;
    overUnderProbabilities[t] = {
      over: (over / total) * 100,
      under: (under / total) * 100
    };
  }

  // Momentum calculation (last 20 ticks)
  const recentCount = Math.min(digits.length, 20);
  const recentDigits = digits.slice(-recentCount);
  const recentEven = recentDigits.filter(d => d % 2 === 0).length;
  const recentOver = recentDigits.filter(d => d > 5).length;
  
  const momentum = {
    even: (recentEven / (recentCount || 1)) * 100,
    odd: (((recentCount - recentEven) / (recentCount || 1))) * 100,
    over: (recentOver / (recentCount || 1)) * 100,
    under: ((recentDigits.filter(d => d < 5).length) / (recentCount || 1)) * 100
  };

  const sortedByFreq = [...frequency].sort((a, b) => b.count - a.count);
  const hotDigits = sortedByFreq.slice(0, 3).map(d => d.digit);
  const coldDigits = sortedByFreq.slice(-3).map(d => d.digit);

  let streakCount = 0;
  let currentDigit: number | null = null;
  if (digits.length > 0) {
    const last = digits[digits.length - 1];
    currentDigit = last;
    for (let i = digits.length - 1; i >= 0; i--) {
      if (digits[i] === last) streakCount++;
      else break;
    }
  }

  return {
    frequency,
    frequencyMap,
    percentages,
    evenPercent: (evenCount / total) * 100,
    oddPercent: (oddCount / total) * 100,
    overPercent: overUnderProbabilities[5].over,
    underPercent: overUnderProbabilities[5].under,
    evenPercentage: (evenCount / total) * 100,
    oddPercentage: (oddCount / total) * 100,
    overPercentage: overUnderProbabilities[5].over,
    underPercentage: overUnderProbabilities[5].under,
    overUnderProbabilities,
    momentum,
    hotDigits,
    coldDigits,
    streak: { digit: currentDigit, count: streakCount },
    lastDigits: digits.slice(-20),
    recentPattern: digits.slice(-10)
  };
}