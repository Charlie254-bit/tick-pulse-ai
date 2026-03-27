import { AnalysisResult } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';

interface StatsGridProps {
  stats: AnalysisResult;
}

export function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4">
      <Card className="bg-slate-900/40 border-slate-800 overflow-hidden shadow-sm">
        <CardContent className="p-5 flex flex-col gap-4">
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
              <span className="text-blue-400">Even Stats</span>
              <span className="text-rose-400">Odd Stats</span>
            </div>
            <div className="h-3 w-full bg-slate-800/50 rounded-full flex overflow-hidden border border-slate-800">
              <motion.div 
                className="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.3)]" 
                initial={{ width: "50%" }}
                animate={{ width: `${stats.evenPercentage}%` }}
              />
              <motion.div 
                className="h-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.3)]" 
                initial={{ width: "50%" }}
                animate={{ width: `${stats.oddPercentage}%` }}
              />
            </div>
            <div className="flex justify-between font-mono text-sm font-bold">
              <span className="text-blue-400">{stats.evenPercentage.toFixed(1)}%</span>
              <span className="text-rose-400">{stats.oddPercentage.toFixed(1)}%</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
              <span className="text-emerald-400">Under (0-4)</span>
              <span className="text-indigo-400">Over (6-9)</span>
            </div>
            <div className="h-3 w-full bg-slate-800/50 rounded-full flex overflow-hidden border border-slate-800">
              <motion.div 
                className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]" 
                initial={{ width: "40%" }}
                animate={{ width: `${stats.underPercentage}%` }}
              />
              <div 
                className="h-full bg-slate-700/50" 
                style={{ width: `${(100 - stats.underPercentage - stats.overPercentage)}%` }}
              />
              <motion.div 
                className="h-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.3)]" 
                initial={{ width: "40%" }}
                animate={{ width: `${stats.overPercentage}%` }}
              />
            </div>
            <div className="flex justify-between font-mono text-sm font-bold">
              <span className="text-emerald-400">{stats.underPercentage.toFixed(1)}%</span>
              <span className="text-indigo-400">{stats.overPercentage.toFixed(1)}%</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}