import React from 'react';
import { TickData } from '../../lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';

interface RecentTicksProps {
  ticks: TickData[];
}

export const RecentTicks: React.FC<RecentTicksProps> = ({ ticks }) => {
  const reversedTicks = [...ticks].reverse().slice(0, 20);

  return (
    <div className="bg-white border border-emerald-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="px-6 py-4 border-b border-emerald-100 flex justify-between items-center bg-emerald-50/30">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Recent Last Digits</h3>
        <span className="text-[10px] text-slate-400 font-bold uppercase">Live Updates</span>
      </div>
      <div className="p-4 grid grid-cols-5 sm:grid-cols-10 gap-2">
        <AnimatePresence mode="popLayout">
          {reversedTicks.map((tick, i) => (
            <motion.div
              key={`${tick.epoch}-${i}`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              layout
              className={cn(
                "h-12 rounded-lg flex items-center justify-center font-mono font-bold text-lg transition-all shadow-sm",
                tick.digit % 2 === 0 
                  ? "bg-emerald-100 text-emerald-700 border border-emerald-200" 
                  : "bg-amber-100 text-amber-700 border border-amber-200",
                i === 0 && "ring-2 ring-emerald-500 ring-offset-2 ring-offset-white scale-105"
              )}
            >
              {tick.digit}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};