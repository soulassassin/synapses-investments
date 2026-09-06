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

    const apiKey = process.env.LEMONSQUEEZY_API_KEY;
    const storeId = process.env.LEMONSQUEEZY_STORE_ID;
    const variantId = plan === "annual" 
      ? process.env.LEMONSQUEEZY_ANNUAL_VARIANT_ID 
      : process.env.LEMONSQUEEZY_MONTHLY_VARIANT_ID;

    const origin = req.headers.get("origin") || req.nextUrl.origin;
    const redirectUrl = returnUrl || `${origin}/dashboard?payment=success&provider=lemonsqueezy`;

    // If Lemon Squeezy API keys and store ID are present, generate official hosted checkout
    if (apiKey && storeId && variantId) {
      const response = await fetch("https://api.lemonsqueezy.com/v1/checkouts", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/vnd.api+json",
          Accept: "application/vnd.api+json",
        },
        body: JSON.stringify({
          data: {
            type: "checkouts",
            attributes: {
              checkout_data: {
                email,
                custom: {
                  user_id: userId || "anonymous",
                  plan,
                },
              },
              product_options: {
                redirect_url: redirectUrl,
              },
            },
            relationships: {
              store: {
                data: {
                  type: "stores",
                  id: storeId.toString(),
                },
              },
              variant: {
                data: {
                  type: "variants",
                  id: variantId.toString(),
                },
              },
            },
          },
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.data?.attributes?.url) {
        return NextResponse.json(
          {
            success: false,
            error: data.errors?.[0]?.detail || "Lemon Squeezy checkout creation failed.",
          },
          { status: 400 }
        );
      }

      return NextResponse.json({
        success: true,
        checkout_url: data.data.attributes.url,
        mode: "live",
      });
    }

    // Sandbox / Simulation fallback
    const simulatedOrderId = `ls_sim_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const simulatedUrl = `${redirectUrl}&order_id=${simulatedOrderId}&simulated=true`;

    return NextResponse.json({
      success: true,
      checkout_url: simulatedUrl,
      mode: "sandbox",
      message: "Lemon Squeezy sandbox simulation active (Add LEMONSQUEEZY_API_KEY to enable live checkout).",
    });
  } catch (error: any) {
    console.error("Lemon Squeezy checkout error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Internal server error during international checkout initialization." },
      { status: 500 }
    );
  }
}
