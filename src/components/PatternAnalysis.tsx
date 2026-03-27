import { AnalysisResult } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Flame, Snowflake, Clock, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PatternAnalysisProps {
  stats: AnalysisResult;
}

export function PatternAnalysis({ stats }: PatternAnalysisProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Card className="bg-slate-900/40 border-slate-800 shadow-sm">
          <CardHeader className="p-3 pb-0">
            <CardTitle className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1.5">
              <Flame className="w-3 h-3 text-orange-500" /> Hot Digits
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3">
            <div className="flex justify-between gap-1.5">
              {stats.hotDigits.map(d => (
                <div key={d} className="flex-1 text-center py-2.5 bg-orange-500/5 border border-orange-500/10 rounded-xl">
                  <span className="text-xl font-black text-orange-500 leading-none">{d}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/40 border-slate-800 shadow-sm">
          <CardHeader className="p-3 pb-0">
            <CardTitle className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1.5">
              <Snowflake className="w-3 h-3 text-cyan-500" /> Cold Digits
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3">
            <div className="flex justify-between gap-1.5">
              {stats.coldDigits.map(d => (
                <div key={d} className="flex-1 text-center py-2.5 bg-cyan-500/5 border border-cyan-500/10 rounded-xl">
                  <span className="text-xl font-black text-cyan-500 leading-none">{d}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-900/40 border-slate-800 overflow-hidden shadow-sm">
        <CardHeader className="p-3 pb-2 flex flex-row items-center justify-between border-b border-slate-800/50">
          <CardTitle className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1.5">
            <Clock className="w-3 h-3 text-indigo-400" /> Momentum History
          </CardTitle>
          {stats.streak.count > 1 && (
             <div className="flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-indigo-300">
                <TrendingUp className="w-2.5 h-2.5" /> STREAK: {stats.streak.count}x
             </div>
          )}
        </CardHeader>
        <CardContent className="p-3">
          <div className="flex flex-wrap gap-2 justify-between">
            {stats.lastDigits.map((digit, i) => (
              <div 
                key={i} 
                className={cn(
                  "w-8 h-8 flex items-center justify-center rounded-lg text-xs font-black border transition-all duration-300",
                  digit % 2 === 0 
                    ? "bg-slate-800/50 border-blue-500/20 text-blue-400 shadow-[inset_0_0_10px_rgba(59,130,246,0.05)]" 
                    : "bg-slate-800/50 border-rose-500/20 text-rose-400 shadow-[inset_0_0_10px_rgba(244,63,94,0.05)]"
                )}
              >
                {digit}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}