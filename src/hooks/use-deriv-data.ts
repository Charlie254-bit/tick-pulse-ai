import { useState, useEffect, useRef, useCallback } from 'react';
import { TickData, TickWindow } from '../lib/types';
import { toast } from 'sonner';

const DERIV_WS_URL = 'wss://ws.binaryws.com/websockets/v3?app_id=1089';

export function useDerivData(symbol: string = 'R_100', windowSize: TickWindow = 100) {
  const [ticks, setTicks] = useState<TickData[]>([]);
  const [lastTick, setLastTick] = useState<TickData | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const ws = useRef<WebSocket | null>(null);

  const connect = useCallback(() => {
    if (ws.current?.readyState === WebSocket.OPEN) return;

    ws.current = new WebSocket(DERIV_WS_URL);

    ws.current.onopen = () => {
      setIsConnected(true);
      toast.success('Real-time connection established');
      ws.current?.send(JSON.stringify({
        ticks: symbol,
        subscribe: 1
      }));
    };

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.msg_type === 'tick') {
        const quote = data.tick.quote;
        const digit = parseInt(quote.toString().split('').pop() || '0');
        const newTick: TickData = {
          epoch: data.tick.epoch,
          quote,
          digit
        };

        setLastTick(newTick);
        setTicks(prev => {
          const updated = [...prev, newTick];
          if (updated.length > 500) { // Max allowed window is 500
            return updated.slice(-500);
          }
          return updated;
        });
      }
    };

    ws.current.onerror = () => setIsConnected(false);

    ws.current.onclose = () => {
      setIsConnected(false);
      setTimeout(connect, 5000);
    };
  }, [symbol]);

  useEffect(() => {
    connect();
    return () => {
      if (ws.current) ws.current.close();
    };
  }, [connect]);

  // Provide only the slice needed for the current window size
  const windowedTicks = ticks.slice(-windowSize);

  return { ticks: windowedTicks, lastTick, isConnected };
}