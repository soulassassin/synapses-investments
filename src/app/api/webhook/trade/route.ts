import { NextResponse } from "next/server";
import { Trade } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const queryAcc = url.searchParams.get("acc");

    let payload: any = {};
    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      payload = await req.json();
    } else {
      const text = await req.text();
      try {
        payload = JSON.parse(text);
      } catch {
        payload = { message: text };
      }
    }

    const ticker = (payload.ticker || payload.symbol || "NAS100").toUpperCase();
    const rawAction = (payload.action || payload.side || payload.direction || "BUY").toUpperCase();
    const direction: Trade["direction"] = rawAction.includes("SELL") || rawAction.includes("SHORT") ? "SHORT" : "LONG";
    const price = parseFloat(payload.price || payload.close || payload.entryPrice) || 20000;
    const size = parseFloat(payload.size || payload.quantity || payload.contracts || payload.lots) || 1.0;
    const account = payload.account || queryAcc || "TradingView Feed";
    const pnl = parseFloat(payload.pnl || payload.profit) || 0;

    const entryTime = new Date().toISOString().replace("T", " ").slice(0, 16);

    const newTrade: Trade = {
      id: `WEBHOOK-${Date.now().toString().slice(-6)}`,
      ticker,
      assetClass: ticker.includes("USD") && !ticker.includes("BTC") ? "Forex" : ticker.includes("BTC") ? "Crypto" : "Indices",
      direction,
      entryDate: entryTime,
      exitDate: entryTime,
      session: "New York",
      entryPrice: price,
      exitPrice: direction === "LONG" ? price + 25 : price - 25,
      stopLoss: direction === "LONG" ? price - 30 : price + 30,
      takeProfit: direction === "LONG" ? price + 60 : price - 60,
      positionSize: size,
      grossPnL: pnl,
      netPnL: pnl,
      commission: -7.0 * size,
      swap: 0,
      slippagePips: 0.5,
      spreadPips: 1.0,
      rMultiple: 2.0,
      strategy: payload.strategy || "TradingView Pine Script Alert",
      setup: "Webhook Order Trigger",
      mistakeTags: [],
      marketCondition: "Trending Bullish",
      emotion: {
        confidence: 5,
        stress: 1,
        discipline: 5,
        preTradeState: "Focused",
        postTradeState: "Satisfied",
        notes: `Executed via Real-Time Webhook alert from TradingView. Order size: ${size}.`,
      },
      account,
    };

    return NextResponse.json({
      success: true,
      message: `Webhook trade ingested for ${ticker} (${direction}) on ${account}`,
      trade: newTrade,
    });
  } catch (error: any) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Invalid webhook payload" },
      { status: 400 }
    );
  }
}

export async function GET(req: Request) {
  return NextResponse.json({
    status: "HEALTHY",
    endpoint: "Synapses TradingView Real-Time Webhook Ingestion API",
    instructions: "Send POST requests with JSON payload: { ticker, action, price, contracts, account }",
  });
}
