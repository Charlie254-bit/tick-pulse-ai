import { useState, useEffect, useCallback, useRef } from 'react';
import { TickData, AnalysisResult } from '../lib/types';
import { calculateStats } from '../lib/analysis';

const DERIV_WS_URL = 'wss://ws.binaryws.com/websockets/v3?app_id=1089';

export const useDerivTicks = (symbol: string, windowSize: number = 100) => {
  const [ticks, setTicks] = useState<TickData[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!symbol) return;

    let reconnectTimeout: any;

    const connect = () => {
      ws.current = new WebSocket(DERIV_WS_URL);

      ws.current.onopen = () => {
        setIsConnected(true);
        ws.current?.send(JSON.stringify({ 
          ticks: symbol,
          subscribe: 1
        }));
      };

      ws.current.onmessage = (msg) => {
        const data = JSON.parse(msg.data);
        if (data.tick) {
          const priceStr = data.tick.quote.toString();
          const lastDigitStr = priceStr.split('.').join('').slice(-1);
          const lastDigit = parseInt(lastDigitStr);
          
          if (!isNaN(lastDigit)) {
            setTicks(prev => {
              const newTicks = [...prev, {
                digit: lastDigit,
                epoch: data.tick.epoch,
                quote: data.tick.quote
              }];
              return newTicks.slice(-500);
            });
          }
        }
      };

      ws.current.onclose = () => {
        setIsConnected(false);
        reconnectTimeout = setTimeout(() => {
          if (symbol) connect();
        }, 5000);
      };

      ws.current.onerror = () => {
        ws.current?.close();
      };
    };

    connect();

    return () => {
      clearTimeout(reconnectTimeout);
      if (ws.current) {
        ws.current.close();
        ws.current = null;
      }
    };
  }, [symbol]);

  const stats = calculateStats(ticks.slice(-windowSize));

  return { ticks: ticks.slice(-windowSize), stats, isConnected };
};