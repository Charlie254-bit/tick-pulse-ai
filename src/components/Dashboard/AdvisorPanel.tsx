import React from 'react';
import { AnalysisResult, TradeDecision, OverUnderThreshold, TradingMode } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, XCircle, AlertTriangle, Target, ChevronRight, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface AdvisorPanelProps {
  stats: AnalysisResult;
  threshold: OverUnderThreshold;
  setThreshold: (t: OverUnderThreshold) => void;
  mode: TradingMode;
  setMode: (m: TradingMode) => void;
}

export function AdvisorPanel({ stats, threshold, setThreshold, mode, setMode }: AdvisorPanelProps) {
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
      case 'GOOD ENTRY': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'TRADE': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      case 'AVOID': return 'text-slate-500 bg-slate-800/20 border-slate-800/50';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
           <Target className="w-3.5 h-3.5" /> Trade Decision Panel
        </h2>
        <div className="flex bg-slate-900 border border-slate-800 rounded-lg p-0.5">
          <button 
            onClick={() => setMode('even_odd')}
            className={cn(
              "px-2 py-1 rounded-md text-[9px] font-black uppercase transition-all",
              mode === 'even_odd' ? "bg-blue-600 text-white" : "text-slate-500"
            )}
          >
            E/O
          </button>
          <button 
            onClick={() => setMode('over_under')}
            className={cn(
              "px-2 py-1 rounded-md text-[9px] font-black uppercase transition-all",
              mode === 'over_under' ? "bg-blue-600 text-white" : "text-slate-500"
            )}
          >
            O/U
          </button>
        </div>
      </div>

      <Card className="bg-slate-900/40 border-slate-800 overflow-hidden shadow-2xl">
        <CardContent className="p-4 space-y-4">
          {/* Threshold Selector for Over/Under */}
          {mode === 'over_under' && (
            <div className="flex items-center justify-between bg-slate-950/50 p-3 rounded-xl border border-slate-800/50">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">O/U Threshold</span>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setThreshold(Math.max(0, threshold - 1) as OverUnderThreshold)}
                  className="p-1 hover:bg-slate-800 rounded-md transition-colors text-slate-400"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-sm font-black text-blue-500 w-4 text-center">{threshold}</span>
                <button 
                  onClick={() => setThreshold(Math.min(9, threshold + 1) as OverUnderThreshold)}
                  className="p-1 hover:bg-slate-800 rounded-md transition-colors text-slate-400"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-3">
            {decisions
              .filter(d => mode === 'even_odd' ? (d.label === 'EVEN' || d.label === 'ODD') : (d.label.includes('OVER') || d.label.includes('UNDER')))
              .map((decision, idx) => (
              <div 
                key={idx} 
                className={cn(
                  "flex items-center justify-between p-3.5 rounded-2xl border transition-all duration-300",
                  decision.status === 'GOOD ENTRY' ? "bg-emerald-500/5 border-emerald-500/20" : "bg-slate-950/40 border-slate-800/50"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black shadow-inner", 
                    decision.label.includes('EVEN') ? "bg-blue-500/10 text-blue-400" : 
                    decision.label.includes('ODD') ? "bg-rose-500/10 text-rose-400" : 
                    decision.label.includes('OVER') ? "bg-indigo-500/10 text-indigo-400" : "bg-emerald-500/10 text-emerald-400")}>
                    {decision.label.split(' ')[0][0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-black text-white">{decision.label}</span>
                      {decision.status === 'GOOD ENTRY' && <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-emerald-500 text-white font-black uppercase">🔥 Hot</span>}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                       <span className="text-[10px] font-bold text-slate-500">{decision.probability.toFixed(1)}% Prob.</span>
                       <span className="w-1 h-1 rounded-full bg-slate-700" />
                       <span className="text-[10px] font-bold text-slate-500">{decision.confidence}% Conf.</span>
                    </div>
                  </div>
                </div>

                <div className={cn("flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[9px] font-black uppercase tracking-widest", getStatusColor(decision.status))}>
                  {getStatusIcon(decision.status)}
                  {decision.status}
                </div>
              </div>
            ))}
          </div>

          {/* Best Opportunity Highlight */}
          {decisions.every(d => d.status === 'AVOID') && (
            <div className="flex items-center justify-center gap-2 p-3 bg-amber-500/5 border border-amber-500/10 rounded-xl">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
              <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">No strong probability advantage detected</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}