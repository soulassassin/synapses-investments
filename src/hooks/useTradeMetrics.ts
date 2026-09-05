import { useMemo } from "react";
import {
  Trade,
  MetricStats,
  DayOfWeekStat,
  SessionStat,
  AssetStat,
  SetupStat,
  MistakeStat,
} from "@/lib/types";

export interface PnLPoint {
  date: string;
  ticker: string;
  tradePnL: number;
  cumulativePnL: number;
  drawdown: number;
  rMultiple: number;
  tradeId: string;
}

const safeParseTime = (d: string | undefined): number => {
  if (!d) return 0;
  try {
    const iso = d.includes("T") ? d : d.replace(" ", "T");
    const t = new Date(iso).getTime();
    return isNaN(t) ? 0 : t;
  } catch {
    return 0;
  }
};

const safeGetDay = (d: string | undefined): number => {
  if (!d) return 1;
  try {
    const iso = d.includes("T") ? d : d.replace(" ", "T");
    const day = new Date(iso).getDay();
    return isNaN(day) ? 1 : day;
  } catch {
    return 1;
  }
};

export function useTradeMetrics(trades: Trade[]) {
  return useMemo(() => {
    if (!trades || trades.length === 0) {
      const emptyStats: MetricStats = {
        totalTrades: 0,
        winningTrades: 0,
        losingTrades: 0,
        breakevenTrades: 0,
        winRate: 0,
        grossProfit: 0,
        grossLoss: 0,
        netPnL: 0,
        profitFactor: 0,
        expectancy: 0,
        expectancyR: 0,
        sharpeRatio: 0,
        avgWin: 0,
        avgLoss: 0,
        avgWinLossRatio: 0,
        maxDrawdownAmount: 0,
        maxDrawdownPercent: 0,
        currentStreak: { type: "WIN", count: 0 },
        maxWinStreak: 0,
        maxLossStreak: 0,
        avgHoldTimeMinutes: 0,
        totalCommissions: 0,
      };

      return {
        stats: emptyStats,
        pnlCurve: [] as PnLPoint[],
        dayOfWeekStats: [] as DayOfWeekStat[],
        sessionStats: [] as SessionStat[],
        assetStats: [] as AssetStat[],
        setupStats: [] as SetupStat[],
        mistakeStats: [] as MistakeStat[],
      };
    }

    // Sort trades chronologically with safe date parser
    const sortedTrades = [...trades].sort(
      (a, b) => safeParseTime(a.entryDate) - safeParseTime(b.entryDate)
    );

    let grossProfit = 0;
    let grossLoss = 0;
    let netPnL = 0;
    let totalCommissions = 0;
    let winningTrades = 0;
    let losingTrades = 0;
    let breakevenTrades = 0;
    let totalR = 0;

    let peakCumulative = 0;
    let maxDrawdownAmount = 0;
    let maxDrawdownPercent = 0;
    let runningCumulative = 0;

    let currentStreakType: "WIN" | "LOSS" = "WIN";
    let currentStreakCount = 0;
    let maxWinStreak = 0;
    let maxLossStreak = 0;
    let tempWinStreak = 0;
    let tempLossStreak = 0;

    const pnlCurve: PnLPoint[] = [];

    // Initialize baseline point
    pnlCurve.push({
      date: "Start",
      ticker: "BASELINE",
      tradePnL: 0,
      cumulativePnL: 0,
      drawdown: 0,
      rMultiple: 0,
      tradeId: "START",
    });

    const returnsList: number[] = [];

    sortedTrades.forEach((trade) => {
      const pnl = Number(trade.netPnL) || 0;
      netPnL += pnl;
      runningCumulative += pnl;
      totalCommissions += (Number(trade.commission) || 0) + (Number(trade.swap) || 0);
      totalR += Number(trade.rMultiple) || 0;
      returnsList.push(pnl);

      if (pnl > 0.01) {
        winningTrades++;
        grossProfit += pnl;
        tempWinStreak++;
        tempLossStreak = 0;
        if (tempWinStreak > maxWinStreak) maxWinStreak = tempWinStreak;
      } else if (pnl < -0.01) {
        losingTrades++;
        grossLoss += Math.abs(pnl);
        tempLossStreak++;
        tempWinStreak = 0;
        if (tempLossStreak > maxLossStreak) maxLossStreak = tempLossStreak;
      } else {
        breakevenTrades++;
        tempWinStreak = 0;
        tempLossStreak = 0;
      }

      // Drawdown calculation
      if (runningCumulative > peakCumulative) {
        peakCumulative = runningCumulative;
      }
      const dd = peakCumulative - runningCumulative;
      if (dd > maxDrawdownAmount) {
        maxDrawdownAmount = dd;
        const initialOrPeak = Math.max(100000, peakCumulative + 100000);
        maxDrawdownPercent = (dd / initialOrPeak) * 100;
      }

      pnlCurve.push({
        date: (trade.entryDate || "").split(" ")[0] || trade.entryDate || "2026-09-01",
        ticker: trade.ticker || "NAS100",
        tradePnL: pnl,
        cumulativePnL: runningCumulative,
        drawdown: dd,
        rMultiple: Number(trade.rMultiple) || 0,
        tradeId: trade.id || `TRD-${Date.now()}`,
      });
    });

    // Current streak
    if (sortedTrades.length > 0) {
      const lastTrade = sortedTrades[sortedTrades.length - 1];
      if ((Number(lastTrade.netPnL) || 0) >= 0) {
        currentStreakType = "WIN";
        currentStreakCount = tempWinStreak;
      } else {
        currentStreakType = "LOSS";
        currentStreakCount = tempLossStreak;
      }
    }

    const totalTrades = sortedTrades.length;
    const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;
    const profitFactor = grossLoss > 0 ? grossProfit / grossLoss : grossProfit > 0 ? 99.99 : 0;
    const avgWin = winningTrades > 0 ? grossProfit / winningTrades : 0;
    const avgLoss = losingTrades > 0 ? grossLoss / losingTrades : 0;
    const avgWinLossRatio = avgLoss > 0 ? avgWin / avgLoss : 0;
    const lossRate = totalTrades > 0 ? (losingTrades / totalTrades) : 0;
    const expectancy = (winRate / 100) * avgWin - lossRate * avgLoss;
    const expectancyR = totalTrades > 0 ? totalR / totalTrades : 0;

    // Sharpe calculation (annualized approximation)
    let sharpeRatio = 0;
    if (returnsList.length > 1) {
      const meanReturn = netPnL / returnsList.length;
      const variance =
        returnsList.reduce((sum, r) => sum + Math.pow(r - meanReturn, 2), 0) /
        (returnsList.length - 1);
      const stdDev = Math.sqrt(variance);
      if (stdDev > 0) {
        sharpeRatio = Number(((meanReturn / stdDev) * Math.sqrt(252)).toFixed(2));
      }
    }

    const stats: MetricStats = {
      totalTrades,
      winningTrades,
      losingTrades,
      breakevenTrades,
      winRate: isNaN(winRate) ? 0 : Number(winRate.toFixed(1)),
      grossProfit: isNaN(grossProfit) ? 0 : Number(grossProfit.toFixed(2)),
      grossLoss: isNaN(grossLoss) ? 0 : Number(grossLoss.toFixed(2)),
      netPnL: isNaN(netPnL) ? 0 : Number(netPnL.toFixed(2)),
      profitFactor: isNaN(profitFactor) ? 0 : Number(profitFactor.toFixed(2)),
      expectancy: isNaN(expectancy) ? 0 : Number(expectancy.toFixed(2)),
      expectancyR: isNaN(expectancyR) ? 0 : Number(expectancyR.toFixed(2)),
      sharpeRatio: isNaN(sharpeRatio) ? 0 : sharpeRatio,
      avgWin: isNaN(avgWin) ? 0 : Number(avgWin.toFixed(2)),
      avgLoss: isNaN(avgLoss) ? 0 : Number(avgLoss.toFixed(2)),
      avgWinLossRatio: isNaN(avgWinLossRatio) ? 0 : Number(avgWinLossRatio.toFixed(2)),
      maxDrawdownAmount: isNaN(maxDrawdownAmount) ? 0 : Number(maxDrawdownAmount.toFixed(2)),
      maxDrawdownPercent: isNaN(maxDrawdownPercent) ? 0 : Number(maxDrawdownPercent.toFixed(1)),
      currentStreak: { type: currentStreakType, count: currentStreakCount },
      maxWinStreak,
      maxLossStreak,
      avgHoldTimeMinutes: 85,
      totalCommissions: isNaN(totalCommissions) ? 0 : Number(totalCommissions.toFixed(2)),
    };

    // Day of week stats
    const daysMap: Record<number, { name: string; short: string; pnl: number; trades: number; wins: number }> = {
      1: { name: "Monday", short: "Mon", pnl: 0, trades: 0, wins: 0 },
      2: { name: "Tuesday", short: "Tue", pnl: 0, trades: 0, wins: 0 },
      3: { name: "Wednesday", short: "Wed", pnl: 0, trades: 0, wins: 0 },
      4: { name: "Thursday", short: "Thu", pnl: 0, trades: 0, wins: 0 },
      5: { name: "Friday", short: "Fri", pnl: 0, trades: 0, wins: 0 },
    };

    sortedTrades.forEach((t) => {
      const d = safeGetDay(t.entryDate);
      if (daysMap[d]) {
        const p = Number(t.netPnL) || 0;
        daysMap[d].pnl += p;
        daysMap[d].trades += 1;
        if (p > 0) daysMap[d].wins += 1;
      }
    });

    const dayOfWeekStats: DayOfWeekStat[] = Object.values(daysMap).map((d) => ({
      day: d.name,
      shortDay: d.short,
      pnl: Number(d.pnl.toFixed(2)),
      trades: d.trades,
      winRate: d.trades > 0 ? Number(((d.wins / d.trades) * 100).toFixed(1)) : 0,
    }));

    // Session stats
    const sessionMap: Record<string, { pnl: number; trades: number; wins: number; grossWin: number; grossLoss: number }> = {
      "London": { pnl: 0, trades: 0, wins: 0, grossWin: 0, grossLoss: 0 },
      "New York": { pnl: 0, trades: 0, wins: 0, grossWin: 0, grossLoss: 0 },
      "Asia / Tokyo": { pnl: 0, trades: 0, wins: 0, grossWin: 0, grossLoss: 0 },
      "London/NY Overlap": { pnl: 0, trades: 0, wins: 0, grossWin: 0, grossLoss: 0 },
    };

    sortedTrades.forEach((t) => {
      const sess = t.session || "New York";
      if (sessionMap[sess]) {
        const p = Number(t.netPnL) || 0;
        sessionMap[sess].pnl += p;
        sessionMap[sess].trades += 1;
        if (p > 0) {
          sessionMap[sess].wins += 1;
          sessionMap[sess].grossWin += p;
        } else {
          sessionMap[sess].grossLoss += Math.abs(p);
        }
      }
    });

    const sessionStats: SessionStat[] = Object.entries(sessionMap).map(([name, data]) => ({
      session: name as any,
      pnl: Number(data.pnl.toFixed(2)),
      trades: data.trades,
      winRate: data.trades > 0 ? Number(((data.wins / data.trades) * 100).toFixed(1)) : 0,
      profitFactor: data.grossLoss > 0 ? Number((data.grossWin / data.grossLoss).toFixed(2)) : data.grossWin > 0 ? 99 : 0,
    }));

    // Asset Class stats
    const assetMap: Record<string, { pnl: number; trades: number; wins: number; tickers: Record<string, number> }> = {
      "Indices": { pnl: 0, trades: 0, wins: 0, tickers: {} },
      "Forex": { pnl: 0, trades: 0, wins: 0, tickers: {} },
      "Crypto": { pnl: 0, trades: 0, wins: 0, tickers: {} },
      "Commodities": { pnl: 0, trades: 0, wins: 0, tickers: {} },
    };

    sortedTrades.forEach((t) => {
      const asset = t.assetClass || "Indices";
      if (assetMap[asset]) {
        const p = Number(t.netPnL) || 0;
        assetMap[asset].pnl += p;
        assetMap[asset].trades += 1;
        if (p > 0) assetMap[asset].wins += 1;
        const sym = t.ticker || "UNKNOWN";
        assetMap[asset].tickers[sym] = (assetMap[asset].tickers[sym] || 0) + 1;
      }
    });

    const assetStats: AssetStat[] = Object.entries(assetMap).map(([asset, data]) => {
      let topTicker = "-";
      let topCount = 0;
      Object.entries(data.tickers).forEach(([sym, count]) => {
        if (count > topCount) {
          topCount = count;
          topTicker = sym;
        }
      });
      return {
        assetClass: asset as any,
        pnl: Number(data.pnl.toFixed(2)),
        trades: data.trades,
        winRate: data.trades > 0 ? Number(((data.wins / data.trades) * 100).toFixed(1)) : 0,
        topTicker,
      };
    });

    // Setup stats
    const setupMap: Record<string, { trades: number; wins: number; pnl: number; totalR: number }> = {};
    sortedTrades.forEach((t) => {
      const s = t.setup || "Other";
      if (!setupMap[s]) setupMap[s] = { trades: 0, wins: 0, pnl: 0, totalR: 0 };
      const p = Number(t.netPnL) || 0;
      const r = Number(t.rMultiple) || 0;
      setupMap[s].trades += 1;
      setupMap[s].pnl += p;
      setupMap[s].totalR += r;
      if (p > 0) setupMap[s].wins += 1;
    });

    const setupStats: SetupStat[] = Object.entries(setupMap).map(([setup, data]) => ({
      setup,
      trades: data.trades,
      winRate: Number(((data.wins / data.trades) * 100).toFixed(1)),
      netPnL: Number(data.pnl.toFixed(2)),
      avgR: data.trades > 0 ? Number((data.totalR / data.trades).toFixed(2)) : 0,
    }));

    // Mistake stats
    const mistakeMap: Record<string, { count: number; loss: number }> = {};
    sortedTrades.forEach((t) => {
      const p = Number(t.netPnL) || 0;
      if (t.mistakeTags && Array.isArray(t.mistakeTags) && t.mistakeTags.length > 0) {
        t.mistakeTags.forEach((tag) => {
          if (!mistakeMap[tag]) mistakeMap[tag] = { count: 0, loss: 0 };
          mistakeMap[tag].count += 1;
          if (p < 0) {
            mistakeMap[tag].loss += Math.abs(p);
          }
        });
      }
    });

    const mistakeStats: MistakeStat[] = Object.entries(mistakeMap)
      .map(([tag, data]) => ({
        tag,
        count: data.count,
        totalCostPnL: Number(data.loss.toFixed(2)),
      }))
      .sort((a, b) => b.totalCostPnL - a.totalCostPnL);

    return {
      stats,
      pnlCurve,
      dayOfWeekStats,
      sessionStats,
      assetStats,
      setupStats,
      mistakeStats,
    };
  }, [trades]);
}
