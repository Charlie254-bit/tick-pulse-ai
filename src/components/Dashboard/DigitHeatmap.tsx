import React from 'react';
import { TickData } from '../../lib/types';
import { cn } from '../../lib/utils';

interface HeatmapProps {
  ticks: TickData[];
}

export const DigitHeatmap: React.FC<HeatmapProps> = ({ ticks }) => {
  const last100 = [...ticks].slice(-100);

  return (
    <div className="bg-white border border-emerald-100 rounded-xl p-6 shadow-sm">
      <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">Digit Momentum Heatmap (Last 100)</h3>
      <div className="grid grid-cols-10 gap-1 sm:gap-2">
        {last100.map((tick, i) => {
          const intensity = Math.min((i / 100) + 0.4, 1);
          return (
            <div
              key={i}
              className={cn(
                "aspect-square rounded-[2px] sm:rounded-md flex items-center justify-center text-[8px] sm:text-[10px] font-bold shadow-sm",
                tick.digit % 2 === 0 
                  ? "bg-emerald-500 text-white" 
                  : "bg-amber-500 text-white"
              )}
              style={{ opacity: intensity }}
            >
              {tick.digit}
            </div>
          );
        })}
        {Array.from({ length: Math.max(0, 100 - last100.length) }).map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square rounded-[2px] sm:rounded-md bg-emerald-50 border border-emerald-100" />
        ))}
      </div>
      <div className="mt-4 flex justify-between items-center text-[10px] text-slate-500 font-mono font-bold">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm" />
          <span>EVEN</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-sm" />
          <span>ODD</span>
        </div>
        <span className="text-slate-400">NEWEST \u2192 OLDEST</span>
      </div>
    </div>
  );
};