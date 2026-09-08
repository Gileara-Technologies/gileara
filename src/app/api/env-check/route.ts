import { NextResponse } from "next/server";

/**
 * GET /api/env-check — diagnostic endpoint to verify which env vars
 * are reaching the worker. Returns presence (not values) of each var.
 * 
 * Use this to debug "secret not found" issues in production.
 */
export async function GET() {
  return NextResponse.json({
    timestamp: new Date().toISOString(),
    env: {
      // Google Calendar
      GOOGLE_CLIENT_EMAIL: !!process.env.GOOGLE_CLIENT_EMAIL,
      GOOGLE_PRIVATE_KEY: !!process.env.GOOGLE_PRIVATE_KEY,
      GOOGLE_CALENDAR_ID: !!process.env.GOOGLE_CALENDAR_ID,
      
      // Newsletter
      NEWSLETTER_ENABLED: process.env.NEWSLETTER_ENABLED || "(not set)",
      RESEND_API_KEY: !!process.env.RESEND_API_KEY,
      RESEND_AUDIENCE_ID: !!process.env.RESEND_AUDIENCE_ID,
      
      // Other
      CONTACT_EMAIL: !!process.env.CONTACT_EMAIL,
      MAINTENANCE_MODE: process.env.MAINTENANCE_MODE || "(empty)",
    },
    note: "True means the var is set (but value is hidden). False means missing.",
  });
}
