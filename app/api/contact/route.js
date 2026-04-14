import nodemailer from "nodemailer";

function createTransporter() {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
}

function studioEmailHTML({ name, email, company, projectType, budget, message }) {
  return `<!DOCTYPE html><html><head><style>
    body{font-family:Inter,sans-serif;background:#0e0e13;color:#e2e2e2;margin:0;padding:0}
    .wrap{max-width:600px;margin:40px auto;background:#19191f;border-radius:12px;overflow:hidden;border:1px solid rgba(72,71,77,0.3)}
    .hdr{background:linear-gradient(135deg,#874cff,#00cffc);padding:32px;text-align:center}
    .hdr h1{margin:0;font-size:22px;color:#fff}
    .hdr p{margin:8px 0 0;color:rgba(255,255,255,0.8);font-size:13px}
    .body{padding:32px}
    .label{font-size:10px;text-transform:uppercase;letter-spacing:.15em;color:#acaab1;margin-bottom:6px}
    .value{font-size:15px;color:#f9f5fd;background:#25252d;padding:12px 16px;border-radius:8px;border-left:3px solid #874cff;margin-bottom:18px}
    .msg{font-size:14px;color:#f9f5fd;background:#25252d;padding:16px;border-radius:8px;line-height:1.6;border-left:3px solid #00cffc;margin-bottom:18px}
    .foot{padding:20px 32px;border-top:1px solid #25252d;text-align:center;font-size:11px;color:#acaab1}
  </style></head><body><div class="wrap">
    <div class="hdr"><h1>🚀 New Project Inquiry</h1><p>Someone wants to build something awesome</p></div>
    <div class="body">
      <div class="label">From</div><div class="value">${name}</div>
      <div class="label">Email</div><div class="value"><a href="mailto:${email}" style="color:#bb9eff">${email}</a></div>
      ${company ? `<div class="label">Company</div><div class="value">${company}</div>` : ""}
      ${projectType ? `<div class="label">Project Type</div><div class="value">${projectType}</div>` : ""}
      ${budget ? `<div class="label">Budget</div><div class="value">${budget}</div>` : ""}
      <div class="label">Message</div><div class="msg">${message.replace(/\n/g, "<br/>")}</div>
    </div>
    <div class="foot">Reply directly to this email to respond to ${name}</div>
  </div></body></html>`;
}

function clientEmailHTML({ name }) {
  return `<!DOCTYPE html><html><head><style>
    body{font-family:Inter,sans-serif;background:#0e0e13;color:#e2e2e2;margin:0;padding:0}
    .wrap{max-width:600px;margin:40px auto;background:#19191f;border-radius:12px;overflow:hidden;border:1px solid rgba(72,71,77,0.3)}
    .hdr{background:linear-gradient(135deg,#004f54,#006a71);padding:40px 32px;text-align:center}
    .hdr h1{margin:0;font-size:26px;color:#fff}
    .hdr p{margin:12px 0 0;color:rgba(255,255,255,0.7)}
    .body{padding:40px 32px;text-align:center}
    .body p{font-size:15px;color:#cdc2da;line-height:1.7}
    .cyan{color:#00cffc;font-weight:600}
    .steps{margin:32px 0;text-align:left}
    .step{display:flex;align-items:flex-start;gap:16px;margin-bottom:20px}
    .num{min-width:32px;height:32px;border-radius:8px;background:linear-gradient(135deg,#874cff,#00cffc);display:flex;align-items:center;justify-content:center;font-weight:800;font-size:13px;color:#fff;flex-shrink:0}
    .txt{font-size:13px;color:#cdc2da;line-height:1.5;padding-top:6px}
    .foot{padding:20px 32px;border-top:1px solid #25252d;text-align:center;font-size:11px;color:#acaab1}
    .brand{font-size:18px;font-weight:900;color:#fff}
  </style></head><body><div class="wrap">
    <div class="hdr"><h1>We got you, ${name} ✅</h1><p>Your inquiry has been received</p></div>
    <div class="body">
      <p>Thanks for reaching out to <span class="cyan">VibeWebStudio</span>. We review every inquiry personally and will get back to you within <span class="cyan">24 hours</span>.</p>
      <div class="steps">
        <div class="step"><div class="num">01</div><div class="txt"><strong style="color:#f9f5fd">Review</strong> — We read your brief and assess project fit</div></div>
        <div class="step"><div class="num">02</div><div class="txt"><strong style="color:#f9f5fd">Discovery Call</strong> — We schedule a 30-min call to align on vision</div></div>
        <div class="step"><div class="num">03</div><div class="txt"><strong style="color:#f9f5fd">Proposal</strong> — You receive a custom project plan & timeline</div></div>
      </div>
    </div>
    <div class="foot"><div class="brand">VibeWebStudio</div><p style="margin-top:8px">The Digital Aurora · Building the future, one vibe at a time</p></div>
  </div></body></html>`;
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, company, projectType, budget, message } = body;

    if (!name || !email || !message) {
      return Response.json({ error: "Name, email, and message are required." }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json({ error: "Invalid email address." }, { status: 400 });
    }

    const transporter = createTransporter();

    await transporter.sendMail({
      from: `"VibeWebStudio Site" <${process.env.GMAIL_USER}>`,
      to: process.env.STUDIO_EMAIL || process.env.GMAIL_USER,
      replyTo: email,
      subject: `🚀 New Inquiry from ${name}${company ? ` · ${company}` : ""}`,
      html: studioEmailHTML({ name, email, company, projectType, budget, message }),
    });

    await transporter.sendMail({
      from: `"VibeWebStudio" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: `Hey ${name.split(" ")[0]}, we've received your inquiry ✅`,
      html: clientEmailHTML({ name }),
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error("[/api/contact]", error);
    return Response.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
