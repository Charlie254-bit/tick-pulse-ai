import { useState, useMemo } from 'react';
import { useDerivData } from '@/hooks/use-deriv-data';
import { calculateStats } from '@/lib/analysis';
import { calculateAdvisorSignal } from '@/lib/signal-engine';
import { TickWindow, TradingMode, OverUnderThreshold } from '@/lib/types';
import { DigitFrequencyChart } from '@/components/DigitFrequencyChart';
import { SignalDisplay } from '@/components/SignalDisplay';
import { PatternAnalysis } from '@/components/PatternAnalysis';
import { StatsGrid } from '@/components/StatsGrid';
import { AdvisorPanel } from '@/components/Dashboard/AdvisorPanel';
import { Card, CardContent } from '@/components/ui/card';
import { Settings, RefreshCw, BarChart3, Target, ShieldAlert, Activity, User, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Dashboard() {
  const [windowSize, setWindowSize] = useState<TickWindow>(100);
  const [tradingMode, setTradingMode] = useState<TradingMode>('even_odd');
  const [ouThreshold, setOuThreshold] = useState<OverUnderThreshold>(5);
  const [stake, setStake] = useState('1.00');
  const [stopLoss, setStopLoss] = useState('10.00');

  const { ticks, lastTick, isConnected } = useDerivData('R_100', windowSize);

  const stats = useMemo(() => calculateStats(ticks), [ticks]);
  const advisorSignal = useMemo(() => 
    calculateAdvisorSignal(stats, tradingMode, ouThreshold), 
    [stats, tradingMode, ouThreshold]
  );

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans pb-24 selection:bg-blue-500/30">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
         <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-blue-600/10 blur-[120px] rounded-full" />
         <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] bg-indigo-600/10 blur-[120px] rounded-full" />
      </div>

      {/* Header */}
      <header className="p-4 border-b border-slate-800/50 flex items-center justify-between sticky top-0 bg-[#020617]/80 backdrop-blur-xl z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group cursor-pointer overflow-hidden">
             <img 
               src="https://storage.googleapis.com/dala-prod-public-storage/generated-images/27d3aec7-debb-4d8b-8ec8-7fbb3b699933/app-logo-1549cc31-1774586048525.webp" 
               alt="Logo" 
               className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
             />
          </div>
          <div>
            <h1 className="text-sm font-black tracking-[0.2em] text-white leading-none">DIGITS EDGE AI</h1>
            <div className="flex items-center gap-1.5 mt-1.5">
              <span className={cn("w-1.5 h-1.5 rounded-full", isConnected ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" : "bg-red-500")} />
              <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest leading-none">
                {isConnected ? 'LIVE FEED: R_100' : 'CONNECTION LOST'}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
           <button className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors">
              <RefreshCw className="w-4 h-4" />
           </button>
           <button className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors">
              <Settings className="w-4 h-4" />
           </button>
        </div>
      </header>

      <main className="relative z-10 p-4 space-y-5 max-w-2xl mx-auto">
        {/* Real-time Hero Card */}
        <Card className="bg-slate-900/60 border-slate-800 shadow-2xl backdrop-blur-md relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl -mr-16 -mt-16 group-hover:bg-blue-500/10 transition-colors duration-1000" />
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Synthetic Market Index</p>
                <div className="flex items-baseline gap-2">
                   <div className="text-4xl font-mono font-bold tracking-tighter text-white tabular-nums">
                    {lastTick?.quote.toFixed(2) || '0.00'}
                  </div>
                  <div className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                    +0.002%
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center">
                <div className={cn(
                  "w-16 h-16 rounded-[24px] flex items-center justify-center text-3xl font-black shadow-2xl transition-all duration-300 ring-4 ring-slate-900/50",
                  (lastTick?.digit ?? 0) % 2 === 0 ? "bg-blue-600 text-white" : "bg-rose-600 text-white"
                )}>
                  {lastTick?.digit ?? '-'}
                </div>
                <span className="text-[9px] font-black mt-2 text-slate-500 uppercase tracking-widest">Last Digit</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Intelligence Layer */}
        <SignalDisplay signal={advisorSignal} />

        {/* Trade Decision Panel */}
        <AdvisorPanel 
          stats={stats} 
          threshold={ouThreshold} 
          setThreshold={setOuThreshold} 
          mode={tradingMode} 
          setMode={setTradingMode} 
        />

        {/* Analytics Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
               <Activity className="w-3.5 h-3.5" /> Market Intelligence
            </h2>
            <div className="flex gap-1">
               {[100, 250, 500].map((size) => (
                <button
                  key={size}
                  onClick={() => setWindowSize(size as TickWindow)}
                  className={cn(
                    "px-3 py-1 rounded-lg text-[9px] font-black transition-all border",
                    windowSize === size 
                      ? "bg-blue-600 border-blue-500 text-white" 
                      : "bg-slate-900 border-slate-800 text-slate-500"
                  )}
                >
                  {size}T
                </button>
              ))}
            </div>
          </div>

          <StatsGrid stats={stats} />
          <DigitFrequencyChart stats={stats.frequency} />
          <PatternAnalysis stats={stats} />
        </div>

        {/* Trading Configuration */}
        <div className="space-y-4 pb-12">
          <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
             <ShieldCheck className="w-3.5 h-3.5" /> Risk Parameters
          </h2>
          
          <Card className="bg-slate-900/40 border-slate-800">
            <CardContent className="p-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Trade Stake</label>
                  <div className="relative">
                     <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-mono text-xs">$</span>
                     <input 
                      type="number" 
                      value={stake}
                      onChange={(e) => setStake(e.target.value)}
                      className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-7 pr-3 py-2.5 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Stop Loss</label>
                  <div className="relative">
                     <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-mono text-xs">$</span>
                     <input 
                      type="number" 
                      value={stopLoss}
                      onChange={(e) => setStopLoss(e.target.value)}
                      className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-7 pr-3 py-2.5 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl flex gap-3 shadow-inner">
            <ShieldAlert className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
               <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Mathematical Decision Support</p>
               <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
                  Analysis is strictly probabilistic. Signals represent statistical deviations from random behavior. Maintain strict discipline and trade within your risk parameters.
               </p>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#020617]/80 backdrop-blur-2xl border-t border-slate-800/50 p-3 px-8 flex justify-between items-center z-50">
        <button className="flex flex-col items-center gap-1.5 text-blue-500 transition-all group">
          <div className="p-1.5 rounded-xl bg-blue-500/10 group-active:scale-90 transition-transform">
            <BarChart3 className="w-5 h-5" />
          </div>
          <span className="text-[9px] font-black uppercase tracking-widest">Index</span>
        </button>
        <button className="flex flex-col items-center gap-1.5 text-slate-500 transition-all group">
          <div className="p-1.5 rounded-xl hover:bg-slate-800 group-active:scale-90 transition-transform">
            <Target className="w-5 h-5" />
          </div>
          <span className="text-[9px] font-black uppercase tracking-widest">Signals</span>
        </button>
        <button className="flex flex-col items-center gap-1.5 text-slate-500 transition-all group">
          <div className="p-1.5 rounded-xl hover:bg-slate-800 group-active:scale-90 transition-transform">
            <Activity className="w-5 h-5" />
          </div>
          <span className="text-[9px] font-black uppercase tracking-widest">History</span>
        </button>
        <button className="flex flex-col items-center gap-1.5 text-slate-500 transition-all group">
          <div className="p-1.5 rounded-xl hover:bg-slate-800 group-active:scale-90 transition-transform">
            <User className="w-5 h-5" />
          </div>
          <span className="text-[9px] font-black uppercase tracking-widest">Profile</span>
        </button>
      </nav>
    </div>
  );
}