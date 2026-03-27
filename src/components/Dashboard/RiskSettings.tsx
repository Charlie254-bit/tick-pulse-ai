import React, { useState } from 'react';
import { ShieldAlert, Info, Wallet } from 'lucide-react';
import { toast } from 'sonner';

export const RiskSettings: React.FC = () => {
  const [stake, setStake] = useState('10');
  const [stopLoss, setStopLoss] = useState('50');
  const [maxTrades, setMaxTrades] = useState('5');

  const handleSave = () => {
    toast.success('Risk profile updated successfully');
  };

  return (
    <div className="bg-white border border-emerald-100 rounded-xl p-5 space-y-5 shadow-lg shadow-emerald-900/5">
      <div className="flex items-center gap-2 mb-2">
        <div className="p-2 rounded-lg bg-emerald-50">
          <ShieldAlert className="w-4 h-4 text-emerald-600" />
        </div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">Risk Management</h3>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs text-slate-500 font-bold uppercase tracking-tight">STAKE AMOUNT (USD)</label>
          <div className="relative">
            <input 
              type="number" 
              value={stake}
              onChange={(e) => setStake(e.target.value)}
              className="w-full bg-emerald-50/50 border border-emerald-100 rounded-lg px-3 py-2.5 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-800" 
            />
            <Wallet className="absolute right-3 top-3 w-4 h-4 text-emerald-300" />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs text-slate-500 font-bold uppercase tracking-tight">SESSION STOP LOSS (%)</label>
          <input 
            type="number" 
            value={stopLoss}
            onChange={(e) => setStopLoss(e.target.value)}
            className="w-full bg-emerald-50/50 border border-emerald-100 rounded-lg px-3 py-2.5 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-800" 
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs text-slate-500 font-bold uppercase tracking-tight">MAX TRADES / SESSION</label>
          <input 
            type="number" 
            value={maxTrades}
            onChange={(e) => setMaxTrades(e.target.value)}
            className="w-full bg-emerald-50/50 border border-emerald-100 rounded-lg px-3 py-2.5 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-800" 
          />
        </div>

        <button 
          onClick={handleSave}
          className="w-full bg-emerald-500 text-white font-bold py-3 rounded-lg text-xs transition-all shadow-md shadow-emerald-500/20 hover:bg-emerald-600 hover:shadow-lg hover:shadow-emerald-500/30 active:scale-[0.98]"
        >
          UPDATE CONTROLS
        </button>
      </div>

      <div className="flex items-start gap-2 p-3 bg-emerald-50/50 rounded-lg border border-emerald-100">
        <Info className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
        <p className="text-[10px] text-slate-500 leading-normal font-bold uppercase tracking-tight">
          Settings are saved locally for decision support. Manage your risk effectively.
        </p>
      </div>
    </div>
  );
};