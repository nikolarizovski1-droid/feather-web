import { NextRequest, NextResponse } from "next/server";
import { resend } from "@/lib/resend";

const EMAIL_REGEX = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, source } = body as { email?: string; source?: string };

    if (!email || !EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 },
      );
    }

    const audienceId = process.env.RESEND_AUDIENCE_ID;
    if (!audienceId) {
      console.log(`[email-capture] ${email} from ${source ?? "unknown"} (no audience configured)`);
      return NextResponse.json({ success: true });
    }

    // firstName stores the capture source (e.g. "blog-post", "playbook-landing")
    // Resend contacts don't support custom fields yet, so this is the best option
    await resend.contacts.create({
      audienceId,
      email,
      unsubscribed: false,
      firstName: source ?? "website",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[email-capture] Error:", error);
    return NextResponse.json(
      { error: "Failed to save email" },
      { status: 500 },
    );
  }
}
