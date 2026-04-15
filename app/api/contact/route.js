import nodemailer from "nodemailer";

export async function POST(request) {
  // ── Parse & validate body ──────────────────────────────────────────────────
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { name, email, company, projectType, budget, message } = body ?? {};

  // Basic validation
  if (!name?.trim())    return Response.json({ error: "Name is required."    }, { status: 400 });
  if (!email?.trim())   return Response.json({ error: "Email is required."   }, { status: 400 });
  if (!message?.trim()) return Response.json({ error: "Message is required." }, { status: 400 });

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return Response.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  // ── Send email via Gmail SMTP ──────────────────────────────────────────────
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,  // your Gmail address, e.g. hello@vibewebstudio.in
        pass: process.env.GMAIL_PASS,  // Gmail App Password (not your login password)
      },
    });

    await transporter.sendMail({
      from:    `"VibeWebStudio Contact" <${process.env.GMAIL_USER}>`,
      to:      process.env.GMAIL_USER,   // sends to yourself
      replyTo: email,
      subject: `New Enquiry from ${name}${company ? ` — ${company}` : ""}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:auto;padding:24px;background:#0e0e13;color:#e8e6f0;border-radius:12px">
          <h2 style="color:#bb9eff;margin-top:0">New Contact Form Submission</h2>
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:8px 0;color:#9f9dac;width:140px">Name</td><td style="padding:8px 0">${name}</td></tr>
            <tr><td style="padding:8px 0;color:#9f9dac">Email</td><td style="padding:8px 0"><a href="mailto:${email}" style="color:#00cffc">${email}</a></td></tr>
            ${company    ? `<tr><td style="padding:8px 0;color:#9f9dac">Business</td><td style="padding:8px 0">${company}</td></tr>` : ""}
            ${projectType? `<tr><td style="padding:8px 0;color:#9f9dac">Project Type</td><td style="padding:8px 0">${projectType}</td></tr>` : ""}
            ${budget     ? `<tr><td style="padding:8px 0;color:#9f9dac">Budget</td><td style="padding:8px 0">${budget}</td></tr>` : ""}
          </table>
          <hr style="border:1px solid rgba(72,71,77,0.3);margin:16px 0"/>
          <h3 style="color:#bb9eff;margin-top:0">Message</h3>
          <p style="white-space:pre-wrap;line-height:1.6">${message}</p>
        </div>
      `,
    });

    console.log(`[contact] Email sent from: ${email}`);
    return Response.json({ success: true });
  } catch (err) {
    console.error("[contact] Email send error:", err?.message ?? err);
    return Response.json(
      { error: "Failed to send message. Please try again later." },
      { status: 502 }
    );
  }
}
