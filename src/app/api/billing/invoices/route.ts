import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email") || "trader@synapsesinvestments.com";

    const sampleInvoices = [
      {
        id: "INV-2026-0049",
        date: new Date().toISOString(),
        description: "Synapses Institutional Pro (7-Week Trial Tokenization)",
        amount: 0.0,
        currency: "USD",
        status: "Paid",
        paymentMethod: "Visa ending in •••• 4242",
        receiptUrl: "/api/billing/invoice/INV-2026-0049",
        pdfAvailable: true,
      },
      {
        id: "INV-2026-0028",
        date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        description: "Direct Market Access (DMA) High-Speed Feed Subscription",
        amount: 29.0,
        currency: "USD",
        status: "Paid",
        paymentMethod: "Visa ending in •••• 4242",
        receiptUrl: "/api/billing/invoice/INV-2026-0028",
        pdfAvailable: true,
      },
      {
        id: "INV-2026-0012",
        date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        description: "Proprietary Desk Playbook & Replay Engine Access",
        amount: 29.0,
        currency: "USD",
        status: "Paid",
        paymentMethod: "Apple Pay (USD $29.00)",
        receiptUrl: "/api/billing/invoice/INV-2026-0012",
        pdfAvailable: true,
      },
    ];

    return NextResponse.json({
      success: true,
      invoices: sampleInvoices,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to fetch invoices." },
      { status: 500 }
    );
  }
}
