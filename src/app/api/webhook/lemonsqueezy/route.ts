import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-signature");
    const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;

    // Verify HMAC SHA256 signature if webhook secret is configured
    if (secret) {
      const hmac = crypto.createHmac("sha256", secret);
      const digest = Buffer.from(hmac.update(rawBody).digest("hex"), "utf8");
      const signatureBuffer = Buffer.from(signature || "", "utf8");

      if (digest.length !== signatureBuffer.length || !crypto.timingSafeEqual(digest, signatureBuffer)) {
        return NextResponse.json(
          { error: "Invalid Lemon Squeezy signature verification" },
          { status: 401 }
        );
      }
    }

    const payload = JSON.parse(rawBody);
    const eventName = payload.meta?.event_name;
    const customData = payload.meta?.custom_data || {};
    const userId = customData.user_id;
    const attributes = payload.data?.attributes || {};
    const userEmail = attributes.user_email;
    const subscriptionId = payload.data?.id;

    console.log(`[LemonSqueezy Webhook] Event: ${eventName} for ${userId || userEmail}`);

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    let supabase = null;
    if (supabaseUrl && serviceKey) {
      supabase = createClient(supabaseUrl, serviceKey);
    }

    if (
      eventName === "subscription_created" ||
      eventName === "subscription_updated" ||
      eventName === "order_created"
    ) {
      const status = attributes.status; // 'active', 'on_trial', 'paused', 'cancelled', 'expired'
      const isProActive = status === "active" || status === "on_trial";

      if (supabase) {
        const updatePayload: Record<string, any> = {
          subscription_tier: isProActive ? "pro" : "trial",
          payment_provider: "lemonsqueezy",
          subscription_id: String(subscriptionId),
          customer_id: String(attributes.customer_id || ""),
          updated_at: new Date().toISOString(),
        };

        if (userId && userId !== "anonymous") {
          await supabase.from("profiles").update(updatePayload).eq("id", userId);
        } else if (userEmail) {
          await supabase.from("profiles").update(updatePayload).eq("email", userEmail);
        }
      }
    } else if (eventName === "subscription_cancelled" || eventName === "subscription_expired") {
      if (supabase) {
        const updatePayload = {
          subscription_tier: "canceled",
          updated_at: new Date().toISOString(),
        };
        if (userId && userId !== "anonymous") {
          await supabase.from("profiles").update(updatePayload).eq("id", userId);
        } else if (userEmail) {
          await supabase.from("profiles").update(updatePayload).eq("email", userEmail);
        }
      }
    }

    return NextResponse.json({ received: true, event: eventName }, { status: 200 });
  } catch (err: any) {
    console.error("Lemon Squeezy webhook error:", err);
    return NextResponse.json(
      { error: err?.message || "Webhook processing failure" },
      { status: 500 }
    );
  }
}
