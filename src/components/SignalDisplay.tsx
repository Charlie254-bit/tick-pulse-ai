import { AdvisorSignal } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, Zap, Info, Flame, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SignalDisplayProps {
  signal: AdvisorSignal;
}

export function SignalDisplay({ signal }: SignalDisplayProps) {
  const isStrong = signal.strength === 'STRONG';
  const isWait = signal.type === 'WAIT' || signal.type === 'WAIT FOR CONFIRMATION';

  const getStatusColor = () => {
    if (isWait) return 'border-slate-800 bg-slate-900/40 text-slate-400';
    if (isStrong) return 'border-emerald-500/30 bg-emerald-950/10 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.05)]';
    return 'border-blue-500/30 bg-blue-950/10 text-blue-400';
  };

  const getIcon = () => {
    if (isWait) return <Info className="w-5 h-5" />;
    if (isStrong) return <Flame className="w-5 h-5 fill-emerald-400/20" />;
    return <TrendingUp className="w-5 h-5" />;
  };

  return (
    <Card className={cn("border-2 transition-all duration-700 overflow-hidden relative", getStatusColor())}>
      {/* Glow Effect */}
      {isStrong && <div className="absolute inset-0 bg-emerald-500/5 animate-pulse pointer-events-none" />}
      
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className={cn("p-1.5 rounded-lg", isWait ? "bg-slate-800" : isStrong ? "bg-emerald-500/20" : "bg-blue-500/20")}>
              {getIcon()}
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.1em] opacity-60 block leading-none">INTELLIGENT ENTRY ADVISOR</span>
              <span className="text-xs font-bold uppercase tracking-widest leading-none mt-1 inline-block">
                {signal.type}
              </span>
            </div>
          </div>
          {!isWait && (
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-mono opacity-50 leading-none uppercase">Confidence</span>
              <span className="text-sm font-black text-slate-100 mt-1 leading-none">{signal.confidence}%</span>
            </div>
          )}
        </div>

        <div className="relative h-10 flex items-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={signal.recommendation}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="text-lg font-bold text-slate-100 leading-tight"
            >
              {signal.recommendation}
            </motion.p>
          </AnimatePresence>
        </div>

        <div className="mt-4 space-y-2">
          <div className="w-full bg-slate-800/50 h-1.5 rounded-full overflow-hidden">
            <motion.div 
              className={cn(
                "h-full transition-all duration-1000",
                isWait ? "bg-slate-600" : isStrong ? "bg-emerald-500" : "bg-blue-500"
              )}
              initial={{ width: 0 }}
              animate={{ width: `${signal.confidence}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[9px] font-black text-slate-500 uppercase tracking-widest">
            <div className="flex items-center gap-1.5">
              <span className={cn("w-1 h-1 rounded-full", isStrong ? "bg-emerald-500" : "bg-slate-500")} />
              <span>Momentum: {signal.momentum.toFixed(1)}%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className={cn("w-1 h-1 rounded-full", isStrong ? "bg-emerald-500" : "bg-slate-500")} />
              <span>Statistical Bias: {signal.bias.toFixed(1)}%</span>
            </div>
          </div>
        </div>

        {isWait && (
          <div className="mt-4 flex items-center gap-2 p-2 bg-slate-950/50 rounded-lg border border-slate-800/50 text-[9px] font-black uppercase text-slate-500 tracking-widest">
            <AlertCircle className="w-3 h-3" />
            <span>No strong probability advantage detected</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}