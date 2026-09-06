import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-paystack-signature");
    const secret = process.env.PAYSTACK_SECRET_KEY;

    // Verify HMAC SHA512 signature if live secret key is set
    if (secret) {
      const hash = crypto.createHmac("sha512", secret).update(rawBody).digest("hex");
      if (hash !== signature) {
        return NextResponse.json(
          { error: "Invalid Paystack signature verification" },
          { status: 401 }
        );
      }
    }

    const event = JSON.parse(rawBody);
    console.log(`[Paystack Webhook] Event received: ${event.event}`);

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    let supabase = null;
    if (supabaseUrl && serviceKey) {
      supabase = createClient(supabaseUrl, serviceKey);
    }

    if (event.event === "charge.success" || event.event === "subscription.create") {
      const data = event.data;
      const customerEmail = data.customer?.email;
      const metadata = data.metadata || {};
      const userId = metadata.userId;
      const subscriptionCode = data.subscription_code || data.reference;

      console.log(`[Paystack Webhook] Promoting user ${userId || customerEmail} to PRO tier.`);

      if (supabase) {
        if (userId && userId !== "anonymous") {
          await supabase
            .from("profiles")
            .update({
              subscription_tier: "pro",
              payment_provider: "paystack",
              subscription_id: subscriptionCode,
              customer_id: data.customer?.customer_code || null,
              updated_at: new Date().toISOString(),
            })
            .eq("id", userId);
        } else if (customerEmail) {
          await supabase
            .from("profiles")
            .update({
              subscription_tier: "pro",
              payment_provider: "paystack",
              subscription_id: subscriptionCode,
              customer_id: data.customer?.customer_code || null,
              updated_at: new Date().toISOString(),
            })
            .eq("email", customerEmail);
        }
      }
    } else if (event.event === "subscription.disable" || event.event === "invoice.payment_failed") {
      const data = event.data;
      const customerEmail = data.customer?.email;
      const subscriptionCode = data.subscription_code;

      if (supabase && customerEmail) {
        await supabase
          .from("profiles")
          .update({
            subscription_tier: "canceled",
            updated_at: new Date().toISOString(),
          })
          .eq("email", customerEmail);
      }
    }

    return NextResponse.json({ received: true, event: event.event }, { status: 200 });
  } catch (err: any) {
    console.error("Paystack webhook error:", err);
    return NextResponse.json(
      { error: err?.message || "Webhook processing failure" },
      { status: 500 }
    );
  }
}
