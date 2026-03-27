import React, { useEffect } from 'react';
import { AdvisorSignal, AnalysisResult, TradingMode, OverUnderThreshold, TradeDecision } from '../../lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, AlertCircle, Zap, Flame, Target, CheckCircle2, XCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '../../lib/utils';
import { Card, CardContent } from '../ui/card';

interface SignalIndicatorProps {
  signal: AdvisorSignal;
  stats: AnalysisResult;
  threshold: OverUnderThreshold;
  setThreshold: (t: OverUnderThreshold) => void;
  mode: TradingMode;
  setMode: (m: TradingMode) => void;
}

export const SignalIndicator: React.FC<SignalIndicatorProps> = ({ signal, stats, threshold, setThreshold, mode, setMode }) => {
  useEffect(() => {
    if (signal.strength === 'STRONG') {
      toast.success(`${signal.type}: ${signal.confidence}%`, {
        description: signal.recommendation,
        duration: 3000,
        icon: <Zap className="w-4 h-4 text-emerald-500" />
      });
    }
  }, [signal.type, signal.strength]);

  const isStrong = signal.strength === 'STRONG';
  const isWait = signal.type === 'WAIT' || signal.type === 'WAIT FOR CONFIRMATION';

  const decisions: TradeDecision[] = [
    {
      label: 'EVEN',
      probability: stats.evenPercentage,
      status: stats.evenPercentage > 60 ? 'GOOD ENTRY' : stats.evenPercentage > 52 ? 'TRADE' : 'AVOID',
      confidence: Math.round((stats.evenPercentage * 0.7) + (stats.momentum.even * 0.3))
    },
    {
      label: 'ODD',
      probability: stats.oddPercentage,
      status: stats.oddPercentage > 60 ? 'GOOD ENTRY' : stats.oddPercentage > 52 ? 'TRADE' : 'AVOID',
      confidence: Math.round((stats.oddPercentage * 0.7) + (stats.momentum.odd * 0.3))
    },
    {
      label: `OVER ${threshold}`,
      probability: stats.overUnderProbabilities[threshold]?.over || 0,
      status: (stats.overUnderProbabilities[threshold]?.over || 0) > 60 ? 'GOOD ENTRY' : (stats.overUnderProbabilities[threshold]?.over || 0) > 52 ? 'TRADE' : 'AVOID',
      confidence: Math.round((stats.overUnderProbabilities[threshold]?.over || 0) * 1.1)
    },
    {
      label: `UNDER ${threshold}`,
      probability: stats.overUnderProbabilities[threshold]?.under || 0,
      status: (stats.overUnderProbabilities[threshold]?.under || 0) > 60 ? 'GOOD ENTRY' : (stats.overUnderProbabilities[threshold]?.under || 0) > 52 ? 'TRADE' : 'AVOID',
      confidence: Math.round((stats.overUnderProbabilities[threshold]?.under || 0) * 1.1)
    }
  ];

  const getStatusIcon = (status: TradeDecision['status']) => {
    switch (status) {
      case 'GOOD ENTRY': return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'TRADE': return <Target className="w-4 h-4 text-blue-500" />;
      case 'AVOID': return <XCircle className="w-4 h-4 text-rose-500 opacity-50" />;
    }
  };

  const getStatusColor = (status: TradeDecision['status']) => {
    switch (status) {
      case 'GOOD ENTRY': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      case 'TRADE': return 'text-blue-600 bg-blue-50 border-blue-100';
      case 'AVOID': return 'text-slate-400 bg-slate-50 border-slate-100 opacity-60';
    }
  };

  return (
    <div className="space-y-6">
      {/* Intelligent Entry Advisor Section */}
      <div className={cn("p-6 rounded-2xl border transition-all duration-500 shadow-xl overflow-hidden relative", 
        isStrong ? "bg-emerald-50 border-emerald-200 shadow-emerald-900/5" : "bg-white border-slate-200 shadow-slate-900/5")}>
        
        {isStrong && <motion.div 
          className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl -mr-16 -mt-16" 
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
        />}

        <div className="flex justify-between items-start mb-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <div className={cn("p-1.5 rounded-lg", isStrong ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-500")}>
                {isStrong ? <Flame className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
              </div>
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Intelligent Entry Advisor</h3>
            </div>
            <div className={cn("text-2xl font-black uppercase tracking-tight", isStrong ? "text-emerald-600" : "text-slate-800")}>
              {signal.type}
            </div>
          </div>
          {!isWait && (
             <div className="flex flex-col items-end">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Confidence</span>
                <span className={cn("text-xl font-black mt-1", isStrong ? "text-emerald-600" : "text-blue-600")}>{signal.confidence}%</span>
             </div>
          )}
        </div>

        <div className="space-y-5 relative z-10">
          <div className="h-12 flex items-center">
            <AnimatePresence mode="wait">
              <motion.p
                key={signal.recommendation}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-lg font-bold text-slate-600 leading-tight"
              >
                {signal.recommendation}
              </motion.p>
            </AnimatePresence>
          </div>

          <div className="space-y-2.5">
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <motion.div 
                className={cn("h-full rounded-full transition-all duration-1000", isStrong ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-blue-500")}
                initial={{ width: 0 }}
                animate={{ width: `${signal.confidence}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <div className="flex items-center gap-1.5">
                 <span className={cn("w-1.5 h-1.5 rounded-full", isStrong ? "bg-emerald-500" : "bg-slate-300")} />
                 Momentum: {signal.momentum.toFixed(1)}%
              </div>
              <div className="flex items-center gap-1.5">
                 <span className={cn("w-1.5 h-1.5 rounded-full", isStrong ? "bg-emerald-500" : "bg-slate-300")} />
                 Statistical Bias: {signal.bias.toFixed(1)}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trade Decision Panel Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xl shadow-slate-900/5">
        <div className="flex items-center justify-between mb-6">
           <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-emerald-500" />
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Trade Decision Panel</h3>
           </div>
           <div className="flex bg-slate-50 border border-slate-200 rounded-xl p-1">
              <button 
                onClick={() => setMode('even_odd')}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all",
                  mode === 'even_odd' ? "bg-emerald-500 text-white shadow-lg" : "text-slate-500"
                )}
              >
                Even/Odd
              </button>
              <button 
                onClick={() => setMode('over_under')}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all",
                  mode === 'over_under' ? "bg-emerald-500 text-white shadow-lg" : "text-slate-500"
                )}
              >
                Over/Under
              </button>
           </div>
        </div>

        {mode === 'over_under' && (
           <div className="flex items-center justify-between bg-emerald-50/50 p-3.5 rounded-xl border border-emerald-100/50 mb-5">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">O/U Threshold Level</span>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setThreshold(Math.max(0, threshold - 1) as OverUnderThreshold)}
                  className="w-8 h-8 flex items-center justify-center bg-white border border-slate-200 rounded-lg shadow-sm hover:border-emerald-300 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4 text-slate-500" />
                </button>
                <span className="text-xl font-black text-emerald-600 w-6 text-center">{threshold}</span>
                <button 
                  onClick={() => setThreshold(Math.min(9, threshold + 1) as OverUnderThreshold)}
                  className="w-8 h-8 flex items-center justify-center bg-white border border-slate-200 rounded-lg shadow-sm hover:border-emerald-300 transition-colors"
                >
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </button>
              </div>
           </div>
        )}

        <div className="grid grid-cols-1 gap-4">
          {decisions
            .filter(d => mode === 'even_odd' ? (d.label === 'EVEN' || d.label === 'ODD') : (d.label.includes('OVER') || d.label.includes('UNDER')))
            .map((decision, idx) => (
            <div 
              key={idx} 
              className={cn(
                "flex items-center justify-between p-4 rounded-2xl border transition-all duration-300",
                decision.status === 'GOOD ENTRY' ? "bg-emerald-50 border-emerald-200" : "bg-slate-50 border-slate-100"
              )}
            >
              <div className="flex items-center gap-4">
                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center text-sm font-black shadow-inner", 
                  decision.label.includes('EVEN') ? "bg-blue-100 text-blue-600" : 
                  decision.label.includes('ODD') ? "bg-rose-100 text-rose-600" : 
                  decision.label.includes('OVER') ? "bg-emerald-100 text-emerald-600" : "bg-teal-100 text-teal-600")}>
                  {decision.label[0]}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-slate-800">{decision.label}</span>
                    {decision.status === 'GOOD ENTRY' && <span className="text-[8px] px-2 py-0.5 rounded-full bg-emerald-500 text-white font-black uppercase tracking-tighter">Good Entry</span>}
                  </div>
                  <div className="flex items-center gap-2.5 mt-1">
                     <span className="text-[10px] font-bold text-slate-400">{decision.probability.toFixed(1)}% Prob.</span>
                     <span className="w-1 h-1 rounded-full bg-slate-300" />
                     <span className="text-[10px] font-bold text-slate-400">{decision.confidence}% Conf.</span>
                  </div>
                </div>
              </div>

              <div className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[10px] font-black uppercase tracking-widest", getStatusColor(decision.status))}>
                {getStatusIcon(decision.status)}
                {decision.status}
              </div>
            </div>
          ))}
        </div>

        {isWait && decisions.every(d => d.status === 'AVOID') && (
           <div className="mt-6 p-4 bg-amber-50 border border-amber-100 rounded-2xl flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-amber-500" />
              <p className="text-xs font-bold text-amber-600">Market equilibrium detected. No clear statistical edge available for these parameters.</p>
           </div>
        )}
      </div>
    </div>
  );
};