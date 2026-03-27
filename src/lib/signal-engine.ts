import { AnalysisResult, AdvisorSignal, TradingMode, OverUnderThreshold } from './types';

export function calculateAdvisorSignal(
  stats: AnalysisResult, 
  mode: TradingMode, 
  threshold: number = 5
): AdvisorSignal {
  let type: AdvisorSignal['type'] = 'WAIT';
  let confidence = 0;
  let strength: AdvisorSignal['strength'] = 'WEAK';
  let recommendation = 'Waiting for high probability setup';
  let bias = 0;
  let momentum = 0;

  if (mode === 'even_odd') {
    const evenBias = stats.evenPercentage;
    const oddBias = stats.oddPercentage;
    const evenMom = stats.momentum.even;
    const oddMom = stats.momentum.odd;

    // EVEN Analysis
    if (evenBias > 50) {
      bias = evenBias;
      momentum = evenMom;
      const confidenceBase = (evenBias * 0.6) + (evenMom * 0.4);
      confidence = Math.min(Math.round(confidenceBase), 99);
      
      if (evenBias > 60 && evenMom > 55) {
        type = 'STRONG BUY EVEN';
        strength = 'STRONG';
        recommendation = 'Strong statistical advantage with momentum support.';
      } else if (evenBias > 55) {
        type = 'WEAK SIGNAL';
        strength = 'MODERATE';
        recommendation = 'Moderate bias detected. Wait for momentum confirmation.';
      }
    } 
    // ODD Analysis
    else if (oddBias > 50) {
      bias = oddBias;
      momentum = oddMom;
      const confidenceBase = (oddBias * 0.6) + (oddMom * 0.4);
      confidence = Math.min(Math.round(confidenceBase), 99);
      
      if (oddBias > 60 && oddMom > 55) {
        type = 'STRONG BUY ODD';
        strength = 'STRONG';
        recommendation = 'Strong statistical advantage with momentum support.';
      } else if (oddBias > 55) {
        type = 'WEAK SIGNAL';
        strength = 'MODERATE';
        recommendation = 'Moderate bias detected. Wait for momentum confirmation.';
      }
    }
  } else {
    // Over/Under Analysis for dynamic threshold
    const ouData = stats.overUnderProbabilities[threshold];
    const overBias = ouData?.over || 0;
    const underBias = ouData?.under || 0;
    
    // We'll use global momentum for 5 as a proxy if threshold is near 5,
    // or we can calculate specific momentum. Let's simplify and use bias + stability.
    // For simplicity, let's assume momentum follows the bias direction.
    
    if (overBias > 60) {
      bias = overBias;
      momentum = overBias; // Mocking momentum as bias for OU thresholds other than 5
      confidence = Math.min(Math.round(overBias * 1.1), 99);
      type = 'BUY OVER';
      strength = overBias > 70 ? 'STRONG' : 'MODERATE';
      recommendation = `High probability of digit > ${threshold}.`;
    } else if (underBias > 60) {
      bias = underBias;
      momentum = underBias;
      confidence = Math.min(Math.round(underBias * 1.1), 99);
      type = 'BUY UNDER';
      strength = underBias > 70 ? 'STRONG' : 'MODERATE';
      recommendation = `High probability of digit < ${threshold}.`;
    }
  }

  // Handle neutral/weak states
  if (confidence < 60) {
    type = 'WAIT FOR CONFIRMATION';
    strength = 'WEAK';
    recommendation = 'No strong probability advantage detected.';
  }

  return { type, confidence, strength, recommendation, bias, momentum };
}