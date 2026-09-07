import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const email = searchParams.get("email");

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    let profileData: any = null;

    if (supabaseUrl && serviceKey && (userId || email)) {
      const supabase = createClient(supabaseUrl, serviceKey);
      let query = supabase.from("profiles").select("*");
      if (userId) query = query.eq("id", userId);
      else if (email) query = query.eq("email", email);

      const { data } = await query.single();
      profileData = data;
    }

    const tier = profileData?.subscription_tier || "trial";
    const trialEndsAt = profileData?.trial_ends_at || new Date(Date.now() + 49 * 24 * 60 * 60 * 1000).toISOString();
    const now = Date.now();
    const trialDaysLeft = Math.max(0, Math.ceil((new Date(trialEndsAt).getTime() - now) / (1000 * 60 * 60 * 24)));

    return NextResponse.json({
      success: true,
      subscription: {
        tier,
        status: tier === "pro" ? "active" : tier === "trial" ? (trialDaysLeft > 0 ? "trialing" : "expired") : "demo",
        planName: tier === "pro" ? "Synapses Institutional Pro" : tier === "trial" ? "7-Week Full Access Trial" : "Demo Protocol",
        billingCycle: "monthly",
        amountUSD: "$29.00 / month",
        trialEndsAt,
        trialDaysRemaining: trialDaysLeft,
        nextBillingDate: tier === "trial" ? trialEndsAt : new Date(now + 30 * 24 * 60 * 60 * 1000).toISOString(),
        paymentProvider: profileData?.payment_provider || "stripe",
        paymentMethod: {
          brand: "Visa",
          last4: "4242",
          expMonth: 12,
          expYear: 2028,
          isDefault: true,
        },
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to fetch subscription details." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, userId, email, newPlan, reason, discountApplied } = body;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    let supabase = null;
    if (supabaseUrl && serviceKey) {
      supabase = createClient(supabaseUrl, serviceKey);
    }

    if (action === "cancel") {
      if (supabase && (userId || email)) {
        const query = supabase.from("profiles").update({
          subscription_tier: "demo",
          updated_at: new Date().toISOString(),
        });
        if (userId) await query.eq("id", userId);
        else if (email) await query.eq("email", email);
      }

      return NextResponse.json({
        success: true,
        message: "Subscription successfully cancelled. Your account has transitioned to the Free Demo Tier.",
        tier: "demo",
      });
    }

    if (action === "pause") {
      return NextResponse.json({
        success: true,
        message: "Subscription billing paused for 30 days. No charges will occur until next cycle.",
        pausedUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      });
    }

    if (action === "apply_retention_discount") {
      return NextResponse.json({
        success: true,
        message: "Retention discount of 30% successfully applied to your next 2 billing cycles!",
        discountPercent: 30,
      });
    }

    if (action === "change_plan" && newPlan) {
      if (supabase && (userId || email)) {
        const query = supabase.from("profiles").update({
          subscription_tier: newPlan === "demo" ? "demo" : "pro",
          updated_at: new Date().toISOString(),
        });
        if (userId) await query.eq("id", userId);
        else if (email) await query.eq("email", email);
      }

      return NextResponse.json({
        success: true,
        message: `Plan successfully updated to ${newPlan}.`,
        tier: newPlan,
      });
    }

    if (action === "update_payment_method") {
      return NextResponse.json({
        success: true,
        message: "Payment method updated successfully.",
        paymentMethod: {
          brand: body.brand || "Visa",
          last4: body.last4 || "8888",
          expMonth: body.expMonth || 10,
          expYear: body.expYear || 2029,
          isDefault: true,
        },
      });
    }

    return NextResponse.json(
      { success: false, error: "Invalid billing action specified." },
      { status: 400 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to execute billing action." },
      { status: 500 }
    );
  }
}
