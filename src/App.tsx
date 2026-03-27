import React, { useState, useMemo } from 'react';
import { useDerivTicks } from './hooks/useDerivTicks';
import { calculateAdvisorSignal } from './lib/signal-engine';
import { Header } from './components/Dashboard/Header';
import { StatisticsCards } from './components/Dashboard/StatisticsCards';
import { DigitCharts } from './components/Dashboard/DigitCharts';
import { SignalIndicator } from './components/Dashboard/SignalIndicator';
import { RecentTicks } from './components/Dashboard/RecentTicks';
import { RiskSettings } from './components/Dashboard/RiskSettings';
import { DigitHeatmap } from './components/Dashboard/DigitHeatmap';
import { Toaster, toast } from 'sonner';
import { MARKETS, VolatilityMarket, TradingMode, OverUnderThreshold } from './lib/types';
import { Target, ShieldAlert } from 'lucide-react';

const App: React.FC = () => {
  const [windowSize, setWindowSize] = useState<100 | 250 | 500>(100);
  const [selectedMarket, setSelectedMarket] = useState<VolatilityMarket>(MARKETS[9]); // Default Vol 100
  const [tradingMode, setTradingMode] = useState<TradingMode>('even_odd');
  const [ouThreshold, setOuThreshold] = useState<OverUnderThreshold>(5);
  
  const { ticks, stats, isConnected } = useDerivTicks(selectedMarket.symbol, windowSize);
  
  const currentSignal = useMemo(() => {
    return calculateAdvisorSignal(stats, tradingMode, ouThreshold);
  }, [stats, tradingMode, ouThreshold]);

  const handleMarketChange = (market: VolatilityMarket) => {
    setSelectedMarket(market);
    toast.info(`Switching to ${market.name}`, {
      description: "Connection restarting and data resetting...",
    });
  };

  return (
    <div 
      className="min-h-screen bg-[#f8fafc] text-slate-800 selection:bg-emerald-500/20 pb-10 relative overflow-hidden transition-colors duration-500"
    >
      {/* Soft Background Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.25] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `url('https://storage.googleapis.com/dala-prod-public-storage/generated-images/27d3aec7-debb-4d8b-8ec8-7fbb3b699933/light-greenish-dashboard-background-75b92cc9-1774587603782.webp')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 50% -20%, rgba(16, 185, 129, 0.15), transparent 60%), radial-gradient(circle at -10% 40%, rgba(16, 185, 129, 0.08), transparent 45%)`
        }}
      />

      <Toaster position="top-right" theme="light" richColors />
      <Header 
        isConnected={isConnected} 
        windowSize={windowSize} 
        setWindowSize={(s) => setWindowSize(s as 100 | 250 | 500)} 
        selectedMarket={selectedMarket}
        onMarketChange={handleMarketChange}
      />
      
      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6 relative z-10">
        {/* Top Section: Quick Stats */}
        <StatisticsCards stats={stats} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Analytics Area - 8 Columns */}
          <div className="lg:col-span-8 space-y-6">
            <DigitCharts stats={stats} />
            <DigitHeatmap ticks={ticks} />
            <RecentTicks ticks={ticks} />
          </div>

          {/* Sidebar Area - 4 Columns */}
          <div className="lg:col-span-4 space-y-6">
            <SignalIndicator 
              signal={currentSignal} 
              stats={stats} 
              threshold={ouThreshold}
              setThreshold={setOuThreshold}
              mode={tradingMode}
              setMode={setTradingMode}
            />
            <RiskSettings />
            
            <div className="bg-white/90 backdrop-blur-md rounded-xl p-6 border border-emerald-100 space-y-4 shadow-xl shadow-emerald-900/5 transition-all">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                   <Target className="w-3.5 h-3.5" /> Market Status
                </h3>
                <span className={`flex h-2.5 w-2.5 rounded-full ${isConnected ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse' : 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]'}`} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3.5 bg-emerald-50/50 rounded-xl border border-emerald-100/50 transition-colors">
                  <p className="text-[10px] text-slate-400 font-bold uppercase mb-1 tracking-tight">Index</p>
                  <p className="text-sm font-black font-mono text-emerald-600 truncate" title={selectedMarket.name}>
                    {selectedMarket.name.split(' (')[0].replace('Volatility ', 'V-')}
                  </p>
                </div>
                <div className="p-3.5 bg-emerald-50/50 rounded-xl border border-emerald-100/50 transition-colors">
                  <p className="text-[10px] text-slate-400 font-bold uppercase mb-1 tracking-tight">Refresh Rate</p>
                  <p className={`text-sm font-black font-mono ${selectedMarket.type === 'fast' ? 'text-amber-600' : 'text-emerald-600'}`}>
                    {selectedMarket.type === 'fast' ? '1,000ms' : '2,000ms'}
                  </p>
                </div>
              </div>
              <div className="pt-4 border-t border-emerald-50">
                <p className="text-[9px] text-slate-400 leading-relaxed italic text-center font-medium">
                  * Real-time stream synced with Deriv API WebSocket.
                </p>
              </div>
            </div>

            <div className="p-5 bg-emerald-50 border border-emerald-100 rounded-xl flex gap-3 shadow-inner">
              <ShieldAlert className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                 <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Decision Support Notice</p>
                 <p className="text-[10px] text-slate-500 leading-relaxed font-bold italic">
                    Probability analysis is for informational purposes only. Past performance does not guarantee future results.
                 </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;