"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export interface TickerInfo {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  isPositive: boolean;
  assetClass: "Indices" | "Forex" | "Crypto" | "Commodities";
  decimals: number;
  high?: number;
  low?: number;
  lastTickDir?: "up" | "down" | "flat";
  lastTickTime?: number;
}

export interface DMAFeedState {
  tickers: TickerInfo[];
  tickersMap: Record<string, TickerInfo>;
  status: "CONNECTED" | "STREAMING" | "CONNECTING";
  latencyMs: number;
  lastUpdated: string;
  getTicker: (symbol: string) => TickerInfo | undefined;
  getPrice: (symbol: string, fallback?: number) => number;
}

const INITIAL_TICKERS: TickerInfo[] = [
  { symbol: "NAS100", name: "Nasdaq 100", price: 29544.15, change: 61.85, changePercent: 0.21, isPositive: true, assetClass: "Indices", decimals: 2 },
  { symbol: "US30", name: "Dow Jones 30", price: 53414.25, change: -271.85, changePercent: -0.51, isPositive: false, assetClass: "Indices", decimals: 2 },
  { symbol: "SPX500", name: "S&P 500", price: 7718.60, change: -29.11, changePercent: -0.38, isPositive: false, assetClass: "Indices", decimals: 2 },
  { symbol: "XAUUSD", name: "Gold Spot", price: 4476.60, change: -63.30, changePercent: -1.39, isPositive: false, assetClass: "Commodities", decimals: 2 },
  { symbol: "EURUSD", name: "Euro / US Dollar", price: 1.1621, change: -0.0009, changePercent: -0.08, isPositive: false, assetClass: "Forex", decimals: 4 },
  { symbol: "GBPUSD", name: "British Pound / USD", price: 1.3517, change: -0.0010, changePercent: -0.07, isPositive: false, assetClass: "Forex", decimals: 4 },
  { symbol: "USDJPY", name: "US Dollar / Yen", price: 156.22, change: 0.38, changePercent: 0.24, isPositive: true, assetClass: "Forex", decimals: 2 },
  { symbol: "BTCUSD", name: "Bitcoin", price: 79924.00, change: 278.50, changePercent: 0.35, isPositive: true, assetClass: "Crypto", decimals: 2 },
  { symbol: "ETHUSD", name: "Ethereum", price: 2489.90, change: 37.60, changePercent: 1.53, isPositive: true, assetClass: "Crypto", decimals: 2 },
  { symbol: "SOLUSD", name: "Solana", price: 103.74, change: 2.13, changePercent: 2.10, isPositive: true, assetClass: "Crypto", decimals: 2 },
  { symbol: "DXY", name: "US Dollar Index", price: 99.16, change: -0.02, changePercent: -0.02, isPositive: false, assetClass: "Forex", decimals: 2 },
];

export function useDMAFeed(): DMAFeedState {
  const [tickers, setTickers] = useState<TickerInfo[]>(INITIAL_TICKERS);
  const [status, setStatus] = useState<"CONNECTED" | "STREAMING" | "CONNECTING">("CONNECTING");
  const [latencyMs, setLatencyMs] = useState<number>(2.4);
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toISOString());
  const wsRef = useRef<WebSocket | null>(null);

  // Map for O(1) instant symbol lookups
  const tickersMap = useRef<Record<string, TickerInfo>>({});

  useEffect(() => {
    const map: Record<string, TickerInfo> = {};
    tickers.forEach((t) => {
      map[t.symbol] = t;
    });
    tickersMap.current = map;
  }, [tickers]);

  // 1. Regular DMA REST Polling
  const pollDMAFeed = useCallback(async () => {
    try {
      const startTime = performance.now();
      const res = await fetch("/api/dma-feed");
      if (res.ok) {
        const json = await res.json();
        const clientLatency = Number((performance.now() - startTime).toFixed(1));
        if (json.tickers && Array.isArray(json.tickers)) {
          setTickers((prev) => {
            const prevMap = new Map(prev.map((t) => [t.symbol, t]));
            return json.tickers.map((fresh: TickerInfo) => {
              const old = prevMap.get(fresh.symbol);
              let tickDir: "up" | "down" | "flat" = "flat";
              if (old) {
                if (fresh.price > old.price) tickDir = "up";
                else if (fresh.price < old.price) tickDir = "down";
                else tickDir = old.lastTickDir || "flat";
              }
              return {
                ...fresh,
                lastTickDir: tickDir,
                lastTickTime: tickDir !== "flat" ? Date.now() : old?.lastTickTime,
              };
            });
          });
          setLatencyMs(clientLatency);
          setStatus((prev) => (prev === "STREAMING" ? "STREAMING" : "CONNECTED"));
          setLastUpdated(json.marketTime || new Date().toISOString());
        }
      }
    } catch {
      // Retain previous tick state gracefully
    }
  }, []);

  useEffect(() => {
    pollDMAFeed();
    const interval = setInterval(pollDMAFeed, 4000);
    return () => clearInterval(interval);
  }, [pollDMAFeed]);

  // 2. Real-Time Binance WebSocket Stream for sub-second Crypto ticks
  useEffect(() => {
    let active = true;

    try {
      const ws = new WebSocket(
        "wss://stream.binance.com:9443/ws/btcusdt@ticker/ethusdt@ticker/solusdt@ticker"
      );
      wsRef.current = ws;

      ws.onopen = () => {
        if (active) {
          setStatus("STREAMING");
        }
      };

      ws.onmessage = (event) => {
        if (!active) return;
        try {
          const data = JSON.parse(event.data);
          // Data format: { s: 'BTCUSDT', c: '79940.10', p: '290.00', P: '0.36', ... }
          if (data && data.s && data.c) {
            let symbol = "";
            let name = "";
            if (data.s === "BTCUSDT") {
              symbol = "BTCUSD";
              name = "Bitcoin";
            } else if (data.s === "ETHUSDT") {
              symbol = "ETHUSD";
              name = "Ethereum";
            } else if (data.s === "SOLUSDT") {
              symbol = "SOLUSD";
              name = "Solana";
            }

            if (symbol) {
              const currentPrice = parseFloat(data.c);
              const changePercent = parseFloat(data.P);
              const change = parseFloat(data.p);

              if (!isNaN(currentPrice)) {
                setTickers((prev) =>
                  prev.map((item) => {
                    if (item.symbol === symbol) {
                      const dir =
                        currentPrice > item.price ? "up" : currentPrice < item.price ? "down" : item.lastTickDir || "flat";
                      return {
                        ...item,
                        name: item.name || name,
                        price: currentPrice,
                        change: !isNaN(change) ? change : item.change,
                        changePercent: !isNaN(changePercent) ? Number(changePercent.toFixed(2)) : item.changePercent,
                        isPositive: changePercent >= 0,
                        lastTickDir: dir,
                        lastTickTime: Date.now(),
                      };
                    }
                    return item;
                  })
                );
                setLastUpdated(new Date().toISOString());
              }
            }
          }
        } catch {
          // Ignore parse errors
        }
      };

      ws.onerror = () => {
        // Fall back to REST polling silently
      };

      ws.onclose = () => {
        if (active) {
          setStatus("CONNECTED");
        }
      };
    } catch {
      // WS unsupported fallback
    }

    return () => {
      active = false;
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const getTicker = useCallback((symbol: string) => {
    return tickersMap.current[symbol];
  }, []);

  const getPrice = useCallback(
    (symbol: string, fallback = 0) => {
      const t = tickersMap.current[symbol];
      return t ? t.price : fallback;
    },
    []
  );

  return {
    tickers,
    tickersMap: tickersMap.current,
    status,
    latencyMs,
    lastUpdated,
    getTicker,
    getPrice,
  };
}
