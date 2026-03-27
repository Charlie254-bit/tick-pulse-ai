import React from 'react';
import { AnalysisResult } from '../../lib/types';
import { Activity, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface StatisticsCardsProps {
  stats: AnalysisResult;
}

export const StatisticsCards: React.FC<StatisticsCardsProps> = ({ stats }) => {
  const cards = [
    { 
      label: 'Even Probability', 
      value: `${stats.evenPercentage.toFixed(1)}%`, 
      sub: 'Last digits 0,2,4,6,8', 
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      icon: Activity
    },
    { 
      label: 'Odd Probability', 
      value: `${stats.oddPercentage.toFixed(1)}%`, 
      sub: 'Last digits 1,3,5,7,9', 
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      icon: Activity
    },
    { 
      label: 'Over (5-9)', 
      value: `${stats.overUnderProbabilities[5].over.toFixed(1)}%`, 
      sub: 'High digits bias', 
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      icon: ArrowUpRight
    },
    { 
      label: 'Under (5-0)', 
      value: `${stats.overUnderProbabilities[5].under.toFixed(1)}%`, 
      sub: 'Low digits bias', 
      color: 'text-rose-600',
      bgColor: 'bg-rose-50',
      icon: ArrowDownRight
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((card, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="bg-white border border-emerald-100 p-4 rounded-xl hover:border-emerald-300 transition-all shadow-sm hover:shadow-md group"
        >
          <div className="flex items-center justify-between mb-2">
            <div className={cn("p-1.5 rounded-lg", card.bgColor)}>
              <card.icon className={cn("w-4 h-4", card.color)} />
            </div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Live</span>
          </div>
          <div className={cn("text-2xl font-bold font-mono tracking-tight", card.color)}>{card.value}</div>
          <div className="text-[10px] text-slate-500 mt-1 uppercase font-bold tracking-tight">{card.label}</div>
        </motion.div>
      ))}
    </div>
  );
};