import Anthropic from "@anthropic-ai/sdk";
import { chatLimiter, getIP } from "@/lib/ratelimit";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are Vibe, the friendly AI assistant for VibeWebStudio — a premium web design and development studio.

Your role is to help potential clients learn about VibeWebStudio's services, pricing, timelines, and process.

Key facts about VibeWebStudio:
- We build high-quality websites, web apps, and e-commerce stores
- Services include: Web Design, Web Development, E-commerce, SEO, Branding, and Maintenance
- Typical project timelines: Landing pages 1–2 weeks, full websites 3–6 weeks, web apps 6–12 weeks
- Pricing is project-based and depends on scope — clients should reach out for a custom quote via the contact form
- We work with small businesses, startups, and entrepreneurs
- Website: vibewebstudio.in
- Contact email: vibewebstudio91@gmail.com

Guidelines:
- Keep replies concise and friendly (2–4 sentences max unless more detail is genuinely needed)
- Always encourage users to fill out the contact form for quotes or detailed project discussions
- Do not invent specific prices — say pricing depends on scope and offer to connect them with the team
- If asked something unrelated to VibeWebStudio/web services, politely redirect to what you can help with
- Use plain text only — no markdown headers or bullet points in replies`;

export async function POST(request) {
  // ── 1. Rate limit ──────────────────────────────────────────────────────────
  const ip     = getIP(request);
  const result = await chatLimiter.limit(ip);

  if (!result.success) {
    return Response.json(
      { error: "You're sending messages too quickly. Please wait a moment." },
      {
        status: 429,
        headers: {
          "X-RateLimit-Limit":     String(result.limit),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset":     String(result.reset),
          "Retry-After":           "60",
        },
      }
    );
  }

  // ── 2. Parse body ──────────────────────────────────────────────────────────
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { messages } = body ?? {};

  if (!Array.isArray(messages) || messages.length === 0) {
    return Response.json({ error: "messages array is required." }, { status: 400 });
  }

  // Sanitise: only keep role + content, enforce limits
  const sanitised = messages
    .filter((m) => m?.role === "user" || m?.role === "assistant")
    .slice(-20) // keep last 20 turns maximum
    .map((m) => ({
      role:    m.role,
      content: String(m.content ?? "").slice(0, 1000),
    }));

  if (sanitised.length === 0) {
    return Response.json({ error: "No valid messages provided." }, { status: 400 });
  }

  // ── 3. Call Anthropic ──────────────────────────────────────────────────────
  try {
    const response = await client.messages.create({
      model:      "claude-3-5-haiku-20241022",
      max_tokens: 512,
      system:     SYSTEM_PROMPT,
      messages:   sanitised,
    });

    const reply = response.content?.[0]?.text ?? "Sorry, I couldn't generate a response. Please try again.";
    return Response.json({ reply });

  } catch (err) {
    console.error("[chat] Anthropic error:", err?.message ?? err);
    return Response.json(
      { error: "AI service temporarily unavailable. Please try again or reach out via the contact form." },
      { status: 502 }
    );
  }
}