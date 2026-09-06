import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, userId, plan = "monthly", returnUrl } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email address is required for checkout initialization." },
        { status: 400 }
      );
    }

    const paystackSecret = process.env.PAYSTACK_SECRET_KEY;
    const origin = req.headers.get("origin") || req.nextUrl.origin;
    const callbackUrl = returnUrl || `${origin}/dashboard?payment=success&provider=paystack`;

    // Pricing in ZAR cents (kobo equivalent)
    // Monthly: R499 -> 49900 cents | Annual: R4,790 -> 479000 cents
    const amountInCents = plan === "annual" ? 479000 : 49900;
    const planName = plan === "annual" ? "Synapses Institutional Pro (Annual)" : "Synapses Institutional Pro (Monthly)";

    // If Paystack live or test key is provided, initiate real transaction
    if (paystackSecret && paystackSecret.startsWith("sk_")) {
      const response = await fetch("https://api.paystack.co/transaction/initialize", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${paystackSecret}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          amount: amountInCents,
          currency: "ZAR",
          callback_url: callbackUrl,
          metadata: {
            userId: userId || "anonymous",
            plan,
            planName,
            source: "synapses_terminal_paywall",
          },
          channels: ["card", "bank", "eft", "qr"],
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.status) {
        return NextResponse.json(
          {
            success: false,
            error: data.message || "Paystack transaction initialization failed.",
          },
          { status: 400 }
        );
      }

      return NextResponse.json({
        success: true,
        authorization_url: data.data.authorization_url,
        access_code: data.data.access_code,
        reference: data.data.reference,
        mode: "live",
      });
    }

    // Sandbox / Development simulation mode
    const simulatedReference = `pstk_sim_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const simulatedRedirect = `${callbackUrl}&ref=${simulatedReference}&simulated=true`;

    return NextResponse.json({
      success: true,
      authorization_url: simulatedRedirect,
      access_code: `code_${simulatedReference}`,
      reference: simulatedReference,
      mode: "sandbox",
      message: "Paystack sandbox simulation active (Add PAYSTACK_SECRET_KEY in production to enable live processing).",
    });
  } catch (error: any) {
    console.error("Paystack checkout error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Internal server error during payment initialization." },
      { status: 500 }
    );
  }
}
