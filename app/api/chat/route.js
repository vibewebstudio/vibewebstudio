import { chatLimiter, getIP } from "@/lib/ratelimit";

export async function POST(request) {
  // ── Rate limit ─────────────────────────────────────────────────────────
  const ip = getIP(request);
  const { success } = await chatLimiter.limit(ip);
  if (!success) {
    return Response.json(
      { error: "Too many requests. Please wait a moment." },
      { status: 429 }
    );
  }

  // ── Parse body ─────────────────────────────────────────────────────────
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { messages } = body ?? {};

  // ── AI logic (stubbed) ──────────────────────────────────────────────────
  // This endpoint is currently a stub for future Anthropic Claude integration.
  // Rate limiting and basic validation are enforced for security.

  if (!Array.isArray(messages) || messages.length === 0) {
    return Response.json({ error: "Messages are required." }, { status: 400 });
  }

  // For now, we return a generic response as the frontend currently handles
  // intents locally in ChatWidget.jsx.
  return Response.json({
    role: "assistant",
    content: "I'm processing your request. (AI integration pending)"
  });
}
