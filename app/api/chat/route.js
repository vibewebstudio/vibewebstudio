import { chatLimiter, getIP } from "@/lib/ratelimit";

/**
 * AI Chat Endpoint — Secured
 *
 * This route is now protected by rate limiting and is ready for AI integration.
 * The insecure email relay logic has been removed.
 */
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

  // ── Parse body ─────────────────────────────────────────────────────────
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { messages } = body ?? {};

  // ── Validation ─────────────────────────────────────────────────────────
  if (!Array.isArray(messages) || messages.length === 0) {
    return Response.json({ error: "Messages are required." }, { status: 400 });
  }

  // Basic length guard against abuse
  const lastMessage = messages[messages.length - 1]?.content;
  if (!lastMessage || typeof lastMessage !== "string" || lastMessage.length > 1000) {
    return Response.json({ error: "Invalid or too long message." }, { status: 400 });
  }

  try {
    /**
     * AI INTEGRATION POINT
     * For production, initialize your Anthropic client here:
     *
     * import Anthropic from "@anthropic-ai/sdk";
     * const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
     * const response = await anthropic.messages.create({ ... });
     * return Response.json({ content: response.content[0].text });
     */

    // Placeholder response for now
    return Response.json({
      content: "I'm sorry, my AI processing is currently being upgraded for better security. Please use our contact form for any inquiries!",
    });

  } catch (err) {
    console.error("[chat] API error:", err?.message ?? err);
    return Response.json(
      { error: "Failed to process chat. Please try again later." },
      { status: 500 }
    );
  }
}
