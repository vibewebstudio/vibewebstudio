import nodemailer from "nodemailer";
import { chatLimiter, getIP } from "@/lib/ratelimit";

/** Prevent HTML injection in the email body */
function escapeHtml(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function POST(request) {
  // ── Rate limit ─────────────────────────────────────────────────────────
  const ip = getIP(request);
  const { success } = await chatLimiter.limit(ip);
  if (!success) {
    return Response.json(
      { error: "Too many requests. Please wait a minute and try again." },
      { status: 429 }
    );
  }

  try {
    // ── Parse body ─────────────────────────────────────────
    let body;
    try {
      body = await request.json();
    } catch {
      return Response.json({ error: "Invalid request body." }, { status: 400 });
    }
    const { name, email, company, projectType, budget, message } = body || {};

    // ── Validation ─────────────────────────────────────────
    if (!name?.trim())
      return Response.json({ error: "Name is required." }, { status: 400 });

    if (!email?.trim())
      return Response.json({ error: "Email is required." }, { status: 400 });

    if (!message?.trim())
      return Response.json({ error: "Message is required." }, { status: 400 });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Response.json(
        { error: "Enter a valid email address." },
        { status: 400 }
      );
    }

    // Basic length guards against abuse
    if (name.length > 100 || email.length > 200 || message.length > 5000) {
      return Response.json({ error: "Input too long." }, { status: 400 });
    }

    // ── SMTP Transport (FIXED FOR VERCEL) ──────────────────
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD || process.env.GMAIL_PASS,
      },
    });

    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeCompany = escapeHtml(company);
    const safeProjectType = escapeHtml(projectType);
    const safeBudget = escapeHtml(budget);
    const safeMessage = escapeHtml(message);

    // ── Send Email ─────────────────────────────────────────
    await transporter.sendMail({
      from: `"VibeWebStudio Contact" <${process.env.GMAIL_USER}>`,
      to: process.env.STUDIO_EMAIL,
      replyTo: email,
      subject: `New Enquiry from ${safeName}${safeCompany ? ` — ${safeCompany}` : ""}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:auto;padding:24px;background:#0e0e13;color:#e8e6f0;border-radius:12px">
          <h2 style="color:#bb9eff;margin-top:0">New Contact Form Submission</h2>

          <table style="width:100%;border-collapse:collapse">
            <tr>
              <td style="padding:8px 0;color:#9f9dac;width:140px">Name</td>
              <td style="padding:8px 0">${safeName}</td>
            </tr>

            <tr>
              <td style="padding:8px 0;color:#9f9dac">Email</td>
              <td style="padding:8px 0">
                <a href="mailto:${safeEmail}" style="color:#00cffc">${safeEmail}</a>
              </td>
            </tr>

            ${
              safeCompany
                ? `<tr><td style="padding:8px 0;color:#9f9dac">Business</td><td style="padding:8px 0">${safeCompany}</td></tr>`
                : ""
            }

            ${
              safeProjectType
                ? `<tr><td style="padding:8px 0;color:#9f9dac">Project Type</td><td style="padding:8px 0">${safeProjectType}</td></tr>`
                : ""
            }

            ${
              safeBudget
                ? `<tr><td style="padding:8px 0;color:#9f9dac">Budget</td><td style="padding:8px 0">${safeBudget}</td></tr>`
                : ""
            }
          </table>

          <hr style="border:1px solid rgba(72,71,77,0.3);margin:16px 0"/>

          <h3 style="color:#bb9eff;margin-top:0">Message</h3>
          <p style="white-space:pre-wrap;line-height:1.6;word-break:break-word">${safeMessage}</p>
        </div>
      `,
    });

    console.log(`[contact] Sent from ${email} (${ip})`);
    return Response.json({ success: true });

  } catch (err) {
    console.error("[contact] Email error:", err?.message || err);
    return Response.json(
      { error: "Failed to send message. Please try again later." },
      { status: 502 }
    );
  }
}
