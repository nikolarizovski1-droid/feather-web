import { NextRequest, NextResponse } from "next/server";
import { resend } from "@/lib/resend";

const FROM_EMAIL = "Feather <hello@feathermenu.com>";

interface SendEmailRequest {
  to: string;
  subject: string;
  html: string;
  sequence?: string;
  emailNumber?: number;
}

export async function POST(req: NextRequest) {
  // Simple auth: require the same API key as a bearer token
  // In production, n8n will call this with the key
  const authHeader = req.headers.get("authorization");
  const expectedKey = process.env.RESEND_API_KEY;

  if (!authHeader || authHeader !== `Bearer ${expectedKey}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await req.json()) as SendEmailRequest;
    const { to, subject, html, sequence, emailNumber } = body;

    if (!to || !subject || !html) {
      return NextResponse.json(
        { error: "to, subject, and html are required" },
        { status: 400 },
      );
    }

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html,
    });

    if (error) {
      console.error("[email-send] Resend error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log(
      `[email-send] Sent: ${sequence ?? "manual"}#${emailNumber ?? 0} to ${to} (id: ${data?.id})`,
    );

    return NextResponse.json({ success: true, id: data?.id });
  } catch (error) {
    console.error("[email-send] Error:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 },
    );
  }
}
