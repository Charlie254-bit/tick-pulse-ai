import React from 'react';
import { Settings, Zap, Activity, FastForward, Globe } from 'lucide-react';
import { cn } from '../../lib/utils';
import { MARKETS, VolatilityMarket } from '../../lib/types';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface HeaderProps {
  isConnected: boolean;
  windowSize: number;
  setWindowSize: (size: number) => void;
  selectedMarket: VolatilityMarket;
  onMarketChange: (market: VolatilityMarket) => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  isConnected, 
  windowSize, 
  setWindowSize,
  selectedMarket,
  onMarketChange
}) => {
  const fastMarkets = MARKETS.filter(m => m.type === 'fast');
  const standardMarkets = MARKETS.filter(m => m.type === 'standard');

  return (
    <header className="sticky top-0 z-50 w-full border-b border-emerald-100 bg-white/80 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-20 flex flex-col sm:flex-row items-center justify-between gap-4 py-4 sm:py-0">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight whitespace-nowrap text-slate-800">Digits Edge AI</span>
          </div>

          <div className="h-6 w-[1px] bg-emerald-100 hidden sm:block mx-2" />

          <div className="flex-1 sm:w-64">
            <Select 
              value={selectedMarket.id} 
              onValueChange={(val) => {
                const market = MARKETS.find(m => m.id === val);
                if (market) onMarketChange(market);
              }}
            >
              <SelectTrigger className="w-full bg-white border-emerald-100 hover:bg-emerald-50 transition-colors h-10 text-slate-800 shadow-sm">
                <div className="flex items-center gap-2">
                  <Activity className={cn("w-4 h-4", selectedMarket.type === 'fast' ? "text-amber-500" : "text-emerald-500")} />
                  <span className="text-sm font-semibold truncate">
                    {selectedMarket.name}
                  </span>
                </div>
              </SelectTrigger>
              <SelectContent className="bg-white border-emerald-100">
                <SelectGroup>
                  <SelectLabel className="flex items-center gap-2 text-amber-600">
                    <FastForward className="w-4 h-4" />
                    Fast Markets (1s)
                  </SelectLabel>
                  {fastMarkets.map((market) => (
                    <SelectItem key={market.id} value={market.id} className="focus:bg-emerald-50 focus:text-emerald-900">
                      {market.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
                <SelectGroup>
                  <SelectLabel className="flex items-center gap-2 text-emerald-600">
                    <Globe className="w-4 h-4" />
                    Standard Markets
                  </SelectLabel>
                  {standardMarkets.map((market) => (
                    <SelectItem key={market.id} value={market.id} className="focus:bg-emerald-50 focus:text-emerald-900">
                      {market.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
          <div className="flex bg-emerald-50 p-1 rounded-lg border border-emerald-100">
            {[100, 250, 500].map(size => (
              <button
                key={size}
                onClick={() => setWindowSize(size)}
                className={cn(
                  "px-3 py-1 text-xs font-medium rounded transition-all",
                  windowSize === size 
                    ? "bg-emerald-500 text-white shadow-md" 
                    : "text-slate-500 hover:text-emerald-600"
                )}
              >
                {size}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100">
            <div className={cn("w-2 h-2 rounded-full", isConnected ? "bg-emerald-500 animate-pulse" : "bg-red-500")} />
            <span className="text-xs font-medium text-slate-700">{isConnected ? 'LIVE' : 'OFFLINE'}</span>
          </div>

          <button className="p-2 hover:bg-emerald-50 rounded-lg transition-colors hidden sm:block group">
            <Settings className="w-5 h-5 text-slate-400 group-hover:text-emerald-600" />
          </button>
        </div>
      </div>
    </header>
  );
};