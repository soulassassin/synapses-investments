import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const invoiceId = params.id || "INV-2026-0049";
  const dateStr = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Receipt - ${invoiceId} | Synapses Investments</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background: #090a0f;
      color: #e4e4e7;
      padding: 40px;
      margin: 0;
    }
    .invoice-card {
      max-width: 750px;
      margin: 0 auto;
      background: #111318;
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 20px;
      padding: 40px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.8);
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid rgba(255,255,255,0.1);
      padding-bottom: 24px;
      margin-bottom: 30px;
    }
    .brand-title {
      font-size: 20px;
      font-weight: 900;
      letter-spacing: 2px;
      color: #ffffff;
      margin: 0;
    }
    .brand-sub {
      font-size: 11px;
      color: #10b981;
      font-family: monospace;
      margin-top: 4px;
    }
    .badge-paid {
      background: rgba(16, 185, 129, 0.15);
      color: #34d399;
      border: 1px solid rgba(16, 185, 129, 0.3);
      padding: 6px 14px;
      border-radius: 9999px;
      font-size: 11px;
      font-weight: 700;
      font-family: monospace;
      text-transform: uppercase;
    }
    .meta-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      font-size: 12px;
      font-family: monospace;
      margin-bottom: 30px;
    }
    .meta-label {
      color: #71717a;
      text-transform: uppercase;
      margin-bottom: 4px;
    }
    .meta-value {
      color: #ffffff;
      font-weight: 600;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
      margin-bottom: 30px;
    }
    th {
      text-align: left;
      padding: 12px;
      color: #a1a1aa;
      border-bottom: 1px solid rgba(255,255,255,0.1);
      font-family: monospace;
      text-transform: uppercase;
      font-size: 11px;
    }
    td {
      padding: 16px 12px;
      border-bottom: 1px solid rgba(255,255,255,0.05);
    }
    .total-section {
      text-align: right;
      border-top: 1px solid rgba(255,255,255,0.15);
      padding-top: 20px;
      font-family: monospace;
    }
    .total-row {
      display: flex;
      justify-content: flex-end;
      gap: 30px;
      margin-bottom: 8px;
      font-size: 13px;
    }
    .grand-total {
      font-size: 20px;
      font-weight: 900;
      color: #10b981;
      margin-top: 12px;
    }
    .footer-note {
      text-align: center;
      margin-top: 40px;
      font-size: 11px;
      color: #52525b;
      font-family: monospace;
    }
    .print-btn {
      background: #ffffff;
      color: #000000;
      font-weight: 700;
      font-size: 12px;
      font-family: monospace;
      border: none;
      padding: 10px 20px;
      border-radius: 10px;
      cursor: pointer;
      display: block;
      margin: 20px auto 0;
    }
    @media print {
      body { background: #ffffff; color: #000000; padding: 0; }
      .invoice-card { background: #ffffff; border: none; box-shadow: none; padding: 0; }
      .brand-title, .meta-value { color: #000000; }
      .print-btn { display: none; }
    }
  </style>
</head>
<body>
  <div class="invoice-card">
    <div class="header">
      <div>
        <h1 class="brand-title">SYNAPSES INVESTMENTS</h1>
        <div class="brand-sub">QUANTITATIVE TRADING DESK ARCHITECTURE</div>
      </div>
      <div class="badge-paid">✓ Paid & Verified</div>
    </div>

    <div class="meta-grid">
      <div>
        <div class="meta-label">Billed To</div>
        <div class="meta-value">Authorized Proprietary Trader</div>
        <div style="color: #a1a1aa; margin-top: 2px;">Synapses Execution Black Box</div>
      </div>
      <div>
        <div class="meta-label">Invoice Number</div>
        <div class="meta-value">${invoiceId}</div>
        <div style="color: #a1a1aa; margin-top: 2px;">Date: ${dateStr}</div>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>Description</th>
          <th>Billing Rail</th>
          <th style="text-align: right;">Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <strong>Synapses Institutional Pro (49-Day Full Access Trial)</strong><br>
            <span style="font-size: 11px; color: #71717a;">Automated MT4/MT5 Broker Sync, Replay Simulator, Mistake Auditor & Vault</span>
          </td>
          <td style="font-family: monospace; color: #a1a1aa;">Visa Tokenized • 7-Wk Free</td>
          <td style="text-align: right; font-family: monospace; font-weight: 700; color: #10b981;">$0.00</td>
        </tr>
      </tbody>
    </table>

    <div class="total-section">
      <div class="total-row">
        <span style="color: #71717a;">Subtotal:</span>
        <span>$0.00</span>
      </div>
      <div class="total-row">
        <span style="color: #71717a;">Applied Promo:</span>
        <span style="color: #34d399;">-$29.00 (49-Day 100% Free Trial)</span>
      </div>
      <div class="total-row">
        <span style="color: #71717a;">Tax / VAT (0%):</span>
        <span>$0.00</span>
      </div>
      <div class="total-row grand-total">
        <span>Amount Charged Today:</span>
        <span>$0.00</span>
      </div>
    </div>

    <div class="footer-note">
      Synapses Investments LLC • 256-Bit SSL Encrypted • Level 1 PCI-DSS Compliant<br>
      Thank you for trading with quantitative precision.
    </div>

    <button class="print-btn" onclick="window.print()">Print / Save as PDF</button>
  </div>
</body>
</html>`;

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
    },
  });
}
