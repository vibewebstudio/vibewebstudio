"use client";

import { useState, useRef, useEffect, useCallback } from "react";

// ─── Intent Engine ────────────────────────────────────────────────────────────
// Pricing kept in sync with ContactSection BUDGET_RANGES

const INTENTS = [
  {
    name: "greeting",
    keywords: ["hi","hello","hey","howdy","good morning","good afternoon","good evening","sup","whats up","greetings","yo","hiya","namaste"],
    replies: [
      "Hey there! 👋 I'm Vibe — your guide to VibeWebStudio. Ask me about our **services**, **pricing**, **timelines**, or how to **get started**. What's on your mind?",
      "Hello! Welcome to VibeWebStudio. 🚀 I'm here to help you explore services, pricing, and our process. What would you like to know?",
      "Hi! Great to have you here. Ask me anything — pricing, timelines, what we build, or how to kick off your project. I'm all yours! 😊",
    ],
    contextReplies: {},
  },
  {
    name: "pricing",
    keywords: ["price","cost","budget","rate","charge","fee","how much","expensive","cheap","afford","rates","quote","pricing","payment","pay","investment","worth","money","rupee","dollar","inr"],
    replies: [
      "Our pricing is project-based and built around your goals:\n\n• 🌐 **Landing page** — from ₹15,000\n• 💼 **Business website** — ₹40,000–₹1,50,000\n• 🛒 **E-commerce store** — ₹60,000–₹2,50,000\n• ⚙️ **Custom web app** — quoted on scope\n\nWant an exact number? Fill out our **contact form** — we'll send a detailed proposal in 24–48 hrs!",
      "Here's a rough guide:\n\n• Landing page from **₹15,000**\n• Full business website from **₹40,000**\n• E-commerce from **₹60,000**\n• Apps are scoped individually\n\nFor a precise quote tailored to your project, use our **contact form**. It only takes 2 minutes! 🎯",
    ],
    contextReplies: {
      timeline: "Given your timeline interest — pricing can also be affected by delivery speed. Rush projects may carry a small premium. Standard pricing starts from ₹15,000 for landing pages. Share your deadline in our **contact form** and we'll quote accordingly!",
      start_project: "Perfect timing to talk pricing! Exact cost depends on scope. Use our **contact form** to tell us about your project and we'll send a precise quote within 48 hours.",
    },
  },
  {
    name: "timeline",
    keywords: ["timeline","time","long","duration","deadline","how fast","when","days","weeks","months","quick","speed","fast","urgent","delivery","turnaround","eta","complete","finish","ready"],
    replies: [
      "Here's how our typical timelines look:\n\n• 📄 **Landing page** — 1–2 weeks\n• 💼 **Business website** — 3–5 weeks\n• 🛒 **E-commerce store** — 4–7 weeks\n• ⚙️ **Custom web app** — 6–12 weeks\n\nGot an urgent deadline? We offer rush delivery — mention it in the **contact form**!",
      "Fast turnarounds are our specialty! Landing pages in as little as 7 days, full websites in 3–5 weeks. Got a tight deadline? Mention it in the **contact form** and we'll do our best to accommodate. ⚡",
    ],
    contextReplies: {
      pricing: "Since pricing was on your mind — timelines are linked to budget too. Rush delivery may cost slightly more. Standard: landing page 1–2 weeks, full site 3–5 weeks. Tell us your deadline in the **contact form**!",
      start_project: "Ready to start? Landing pages take 1–2 weeks, full websites 3–5 weeks. Share your expected launch date in the **contact form** and we'll plan around it!",
    },
  },
  {
    name: "services",
    keywords: ["service","offer","build","create","make","develop","design","what do you do","do you","can you","capabilities","specialize","expertise","help with","web","website","app","ecommerce","seo","branding","landing","store","application","dashboard","saas"],
    replies: [
      "We build premium digital experiences! Here's what we offer:\n\n• 🎨 **UI/UX Design** — Beautiful, conversion-focused interfaces\n• 💻 **Web Development** — React, Next.js, modern stack\n• 🛒 **E-commerce** — Shopify, WooCommerce & custom stores\n• 📈 **SEO Optimization** — Rank higher, get found\n• 🔧 **Maintenance** — Ongoing support & updates\n\nWhat kind of project do you have in mind?",
      "VibeWebStudio covers the full digital spectrum:\n\n• Custom websites & landing pages\n• Web apps & SaaS dashboards\n• E-commerce stores\n• Brand identity & design systems\n• SEO & performance optimization\n\nWant to discuss your specific project? The **contact form** is the fastest way to reach us. 🚀",
    ],
    contextReplies: {},
  },
  {
    name: "portfolio",
    keywords: ["portfolio","work","project","example","previous","case study","samples","show me","see","done","built","made","client","past","reference","showcase"],
    replies: [
      "Our portfolio showcases real results for real businesses! 💼 Check out the **Projects section** on this page — it includes case studies, screenshots, and client wins. Want something tailored to your industry? Ask away!",
      "We've built everything from sleek SaaS dashboards to full e-commerce platforms. Scroll through the **Projects section** to see live examples. Have a specific style or industry in mind?",
    ],
    contextReplies: {},
  },
  {
    name: "contact",
    keywords: ["contact","email","reach","talk","call","connect","speak","get in touch","message","form","touch","discuss","consultation","meeting","response","reply","hear from","support"],
    replies: [
      "Reaching us is simple! 📬 Fill out the **contact form** on this page — we respond within 24 hours. Or email us directly at **vibewebstudio91@gmail.com**. Can't wait to hear about your project!",
      "Multiple ways to reach us:\n\n• 📋 **Contact form** — on this page (fastest)\n• 📧 **Email** — vibewebstudio91@gmail.com\n• ⏱ Response time — within 24 hours\n\nWe look forward to hearing from you! 😊",
    ],
    contextReplies: {},
  },
  {
    name: "start_project",
    keywords: ["start","begin","hire","work together","ready","lets go","let's go","kickoff","kick off","onboard","get started","move forward","proceed","book","commission","engage","project","collaborate","partnership"],
    replies: [
      "Exciting! Let's build something amazing. 🚀 Here's the process:\n\n1. Fill out our **contact form** with project details\n2. We review & schedule a brief call\n3. You receive a custom proposal in 24–48 hrs\n4. Project kicks off once aligned!\n\nReady? Hit the **contact form** below! 🎯",
      "Love the enthusiasm! The first step is our **contact form** — tell us about your goals, timeline, and budget. We'll send a tailored proposal within 48 hours and take it from there. Let's build! 💥",
    ],
    contextReplies: {
      pricing: "With pricing in mind — knowing your budget upfront really helps us scope things accurately. Mention it in the **contact form** and we'll build a proposal that fits. Let's kick off! 🚀",
      timeline: "With your timeline in mind — let's move fast! Fill out the **contact form** with your deadline and project details, and we'll prioritise your proposal. ⚡",
    },
  },
  {
    name: "tech_stack",
    keywords: ["technology","tech","stack","react","next","nextjs","wordpress","shopify","woocommerce","platform","framework","language","code","programming","html","css","javascript","typescript","node"],
    replies: [
      "We work with the best modern tech! 🛠️ Our core stack:\n\n• **Frontend** — Next.js, React, Tailwind CSS\n• **Backend** — Node.js, REST & GraphQL APIs\n• **E-commerce** — Shopify, WooCommerce\n• **CMS** — WordPress, Sanity, Contentful\n• **Hosting** — Vercel, Netlify, AWS\n\nWe pick the right tool for each project. Got a preference? Tell us in the **contact form**!",
    ],
    contextReplies: {},
  },
  {
    name: "revisions",
    keywords: ["revision","change","update","edit","modify","feedback","iteration","revision policy","how many","unlimited","changes","alter","tweak","adjust","rework"],
    replies: [
      "Every project includes **2–3 structured revision rounds** depending on the package. We work collaboratively, so most clients need minimal back-and-forth. Additional revisions are available at a small fee. Have specific requirements? Mention them in the **contact form**!",
    ],
    contextReplies: {},
  },
  {
    name: "quality",
    keywords: ["quality","good","best","reliable","trust","professional","experience","years","expert","skilled","team","who are you","about","guarantee","assurance"],
    replies: [
      "Quality is at the core of everything we do! ✨ VibeWebStudio delivers:\n\n• Pixel-perfect, modern designs\n• Clean, scalable code\n• SEO-optimized by default\n• Fast load times (Core Web Vitals compliant)\n• Post-launch support\n\nWe're not just vendors — we're your digital growth partners. 🤝",
      "We take quality seriously — every project goes through design review, code review & QA. Explore our **Projects** section to see the output quality for yourself!",
    ],
    contextReplies: {},
  },
];

const FALLBACKS = [
  "Hmm, I'm not sure about that one! 🤔 I can help with **pricing**, **services**, **timelines**, **portfolio**, or **getting started**. What would you like to explore?",
  "That's a bit outside what I know — but our team can definitely help! Try the **contact form** for direct answers, or ask me about our **services**, **pricing**, or **timelines**.",
  "Good question, but that one's best answered by our team! 🙋 Use the **contact form** and we'll get back to you within 24 hours. Meanwhile, I can tell you about services, pricing, or timelines!",
];

const SUGGESTION_SETS = {
  default:      ["What do you build?", "How much does it cost?", "How long does it take?"],
  pricing:      ["What's included?", "How long does it take?", "Let's start a project"],
  timeline:     ["How much does it cost?", "What services do you offer?", "Get in touch"],
  services:     ["How much does it cost?", "See your portfolio", "Start a project"],
  portfolio:    ["How much does it cost?", "How long does it take?", "Hire you"],
  start_project:["How much does it cost?", "How long does it take?", "Contact the team"],
  contact:      ["What do you build?", "How much does it cost?", "Start a project"],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function normalize(text) { return text.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim(); }
function scoreIntent(intent, normalized) {
  return intent.keywords.reduce((acc, kw) => normalized.includes(kw) ? acc + kw.split(" ").length : acc, 0);
}
function resolveIntent(input, lastIntent) {
  const normalized = normalize(input);
  let best = null, bestScore = 0;
  for (const intent of INTENTS) {
    const score = scoreIntent(intent, normalized);
    if (score > bestScore) { bestScore = score; best = intent; }
  }
  if (!best || bestScore === 0) return { intent: null, reply: pick(FALLBACKS) };
  if (lastIntent && best.contextReplies?.[lastIntent]) return { intent: best.name, reply: best.contextReplies[lastIntent] };
  return { intent: best.name, reply: pick(best.replies) };
}
function typingDelay(text) { return Math.min(600 + text.length * 8, 2000); }

// ─── Text renderer (supports **bold** and \n) ─────────────────────────────────
function renderText(text) {
  return text.split(/(\*\*[^*]+\*\*)/).map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} style={{ color:"#f0edf5", fontWeight:600 }}>{part.slice(2,-2)}</strong>;
    }
    return part.split("\n").map((line, j, arr) => (
      <span key={`${i}-${j}`}>{line}{j < arr.length - 1 && <br />}</span>
    ));
  });
}

// ─── Bubble ───────────────────────────────────────────────────────────────────
function Bubble({ msg }) {
  const isUser = msg.role === "user";
  return (
    <div style={{ display:"flex", gap:10, marginBottom:16, flexDirection:isUser?"row-reverse":"row", alignItems:"flex-end" }}>
      {!isUser && (
        <div style={{ width:28, height:28, borderRadius:8, flexShrink:0, overflow:"hidden", background:"#1a1a22", border:"1px solid rgba(255,255,255,0.08)" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
        </div>
      )}
      <div style={isUser
        ? { maxWidth:"76%", padding:"9px 14px", borderRadius:"12px 12px 3px 12px", background:"#ffffff", color:"#0f0f13", fontSize:13, lineHeight:1.6, fontWeight:400 }
        : { maxWidth:"84%", padding:"10px 14px", borderRadius:"3px 12px 12px 12px", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.07)", color:"rgba(255,255,255,0.82)", fontSize:13, lineHeight:1.65 }
      }>
        {renderText(msg.content)}
      </div>
    </div>
  );
}

function Typing() {
  return (
    <div style={{ display:"flex", gap:10, marginBottom:16, alignItems:"flex-end" }}>
      <div style={{ width:28, height:28, borderRadius:8, flexShrink:0, background:"#1a1a22", border:"1px solid rgba(255,255,255,0.08)", overflow:"hidden" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.png" alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
      </div>
      <div style={{ padding:"10px 16px", borderRadius:"3px 12px 12px 12px", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.07)", display:"flex", alignItems:"center", gap:5 }}>
        {[0,1,2].map((i) => (
          <span key={i} style={{ width:5, height:5, borderRadius:"50%", background:"rgba(255,255,255,0.4)", display:"inline-block", animation:"vws-dot 1.2s ease-in-out infinite", animationDelay:`${i*0.2}s` }} />
        ))}
      </div>
    </div>
  );
}

// ─── Styles (DM Sans removed — loaded via next/font in layout.jsx) ────────────
const STYLES = `
  @keyframes vws-fade-up  { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
  @keyframes vws-dot      { 0%,80%,100%{opacity:0.2;transform:scale(0.85)} 40%{opacity:1;transform:scale(1)} }
  @keyframes vws-panel-in { from{opacity:0;transform:scale(0.96) translateY(8px)} to{opacity:1;transform:scale(1) translateY(0)} }
  @keyframes vws-badge-pulse { 0%,100%{box-shadow:0 0 0 0 rgba(99,179,237,0.5)} 50%{box-shadow:0 0 0 5px rgba(99,179,237,0)} }

  .vws-wrap * { box-sizing:border-box; font-family:var(--font-dm,'Inter',sans-serif); }

  .vws-bubble-ai   { animation:vws-fade-up 0.22s ease both; }
  .vws-bubble-user { animation:vws-fade-up 0.18s ease both; }

  .vws-suggestion {
    font-size:12px; padding:6px 13px; border-radius:6px;
    background:transparent; border:1px solid rgba(255,255,255,0.1);
    color:rgba(255,255,255,0.5); cursor:pointer;
    transition:all 0.15s ease; letter-spacing:0.01em;
    white-space:nowrap; flex-shrink:0;
  }
  .vws-suggestion:hover { background:rgba(255,255,255,0.06); border-color:rgba(255,255,255,0.2); color:rgba(255,255,255,0.8); }

  .vws-input {
    flex:1; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08);
    border-radius:8px; padding:10px 14px; font-size:13px; color:#f0edf5;
    resize:none; outline:none; max-height:80px; line-height:1.5;
    transition:border-color 0.2s ease;
    font-family:var(--font-dm,'Inter',sans-serif);
  }
  .vws-input::placeholder { color:rgba(255,255,255,0.25); }
  .vws-input:focus { border-color:rgba(255,255,255,0.2); }

  .vws-send {
    width:38px; height:38px; border-radius:8px; border:none; cursor:pointer;
    background:#fff; display:flex; align-items:center; justify-content:center;
    flex-shrink:0; transition:all 0.15s ease;
  }
  .vws-send:hover:not(:disabled) { background:#e8e4f0; transform:scale(1.04); }
  .vws-send:disabled { opacity:0.25; cursor:default; }

  .vws-fab {
    position:fixed; bottom:1.5rem; right:1.5rem; z-index:9999;
    width:52px; height:52px; border-radius:14px; border:none; cursor:pointer;
    background:#ffffff; display:flex; align-items:center; justify-content:center;
    box-shadow:0 4px 24px rgba(0,0,0,0.35), 0 1px 4px rgba(0,0,0,0.2);
    transition:transform 0.2s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s ease;
  }
  .vws-fab:hover { transform:scale(1.06); box-shadow:0 6px 32px rgba(0,0,0,0.45), 0 1px 4px rgba(0,0,0,0.2); }

  .vws-suggestions-row { display:flex; gap:6px; overflow-x:auto; padding-bottom:2px; scrollbar-width:none; }
  .vws-suggestions-row::-webkit-scrollbar { display:none; }
  .vws-messages::-webkit-scrollbar       { width:4px; }
  .vws-messages::-webkit-scrollbar-track  { background:transparent; }
  .vws-messages::-webkit-scrollbar-thumb  { background:rgba(255,255,255,0.1); border-radius:4px; }
`;

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ChatWidget() {
  const [open, setOpen]               = useState(false);
  const [messages, setMessages]       = useState([{
    role: "assistant",
    content: "Hi, I'm Vibe — your guide to VibeWebStudio. Ask me about our **services**, **pricing**, **timelines**, or just say hi! 👋",
  }]);
  const [input, setInput]             = useState("");
  const [loading, setLoading]         = useState(false);
  const [unread, setUnread]           = useState(true);
  const [lastIntent, setLastIntent]   = useState(null);
  const [suggestions, setSuggestions] = useState(SUGGESTION_SETS.default);
  const bottomRef = useRef(null);
  const inputRef  = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:"smooth" }); }, [messages, loading]);
  useEffect(() => {
    if (open) { setUnread(false); setTimeout(() => inputRef.current?.focus(), 280); }
  }, [open]);

  const send = useCallback(async (textOverride) => {
    const text = (textOverride ?? input).trim();
    if (!text || loading || text.length > 500) return;
    setMessages((prev) => [...prev, { role:"user", content:text }]);
    setInput("");
    setLoading(true);
    const { intent, reply } = resolveIntent(text, lastIntent);
    await new Promise((res) => setTimeout(res, typingDelay(reply)));
    setMessages((prev) => [...prev, { role:"assistant", content:reply }]);
    setLoading(false);
    if (intent) { setLastIntent(intent); setSuggestions(SUGGESTION_SETS[intent] ?? SUGGESTION_SETS.default); }
    else { setSuggestions(SUGGESTION_SETS.default); }
  }, [input, loading, lastIntent]);

  return (
    <div className="vws-wrap">
      <style>{STYLES}</style>

      {/* Chat Panel */}
      <div style={{
        position:"fixed", bottom:"5.5rem", right:"1.5rem", zIndex:9998,
        width:364, maxHeight:580, display:"flex", flexDirection:"column",
        borderRadius:16, overflow:"hidden",
        background:"#0f0f14", border:"1px solid rgba(255,255,255,0.08)",
        boxShadow:"0 24px 80px rgba(0,0,0,0.6), 0 2px 12px rgba(0,0,0,0.4)",
        transition:"opacity 0.22s ease, transform 0.22s cubic-bezier(0.34,1.2,0.64,1)",
        transform: open ? "scale(1) translateY(0)" : "scale(0.97) translateY(10px)",
        opacity: open ? 1 : 0,
        pointerEvents: open ? "auto" : "none",
        transformOrigin:"bottom right",
        animation: open ? "vws-panel-in 0.22s ease both" : "none",
      }}>
        {/* Header */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 16px", borderBottom:"1px solid rgba(255,255,255,0.06)", background:"#13131a", flexShrink:0 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:32, height:32, borderRadius:9, overflow:"hidden", background:"#1e1e28", border:"1px solid rgba(255,255,255,0.08)", flexShrink:0 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
            </div>
            <div>
              <p style={{ color:"#f0edf5", fontWeight:600, fontSize:13, lineHeight:1, margin:0, letterSpacing:"-0.01em" }}>Vibe</p>
              <div style={{ display:"flex", alignItems:"center", gap:5, marginTop:3 }}>
                <span style={{ width:6, height:6, borderRadius:"50%", background:"#68d391", display:"inline-block" }} />
                <p style={{ color:"rgba(255,255,255,0.35)", fontSize:11, margin:0, letterSpacing:"0.02em" }}>VibeWebStudio · Instant replies</p>
              </div>
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close chat"
            style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:7, color:"rgba(255,255,255,0.4)", cursor:"pointer", width:28, height:28, display:"flex", alignItems:"center", justifyContent:"center", transition:"all 0.15s ease" }}
            onMouseOver={(e) => { e.currentTarget.style.background="rgba(255,255,255,0.1)"; e.currentTarget.style.color="rgba(255,255,255,0.8)"; }}
            onMouseOut={(e)  => { e.currentTarget.style.background="rgba(255,255,255,0.05)"; e.currentTarget.style.color="rgba(255,255,255,0.4)"; }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
        </div>

        {/* Messages */}
        <div className="vws-messages" style={{ flex:1, overflowY:"auto", padding:"16px 14px 0" }}>
          {messages.map((m, i) => <Bubble key={i} msg={m} />)}
          {loading && <Typing />}
          <div ref={bottomRef} />
        </div>

        {/* Suggestions — always visible (not just first 3 messages) */}
        <div style={{ padding:"8px 14px 0", flexShrink:0 }}>
          <div className="vws-suggestions-row">
            {suggestions.map((s) => (
              <button key={s} className="vws-suggestion" onClick={() => send(s)} disabled={loading}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div style={{ padding:"12px 14px", borderTop:"1px solid rgba(255,255,255,0.06)", display:"flex", gap:8, alignItems:"flex-end", background:"#0f0f14", flexShrink:0 }}>
          <textarea
            ref={inputRef}
            className="vws-input"
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value.slice(0, 500))}
            onKeyDown={(e) => { if (e.key==="Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
            placeholder="Ask anything…"
            aria-label="Type your message"
          />
          <button className="vws-send" onClick={() => send()} disabled={!input.trim() || loading} aria-label="Send message">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0f0f14" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m22 2-7 20-4-9-9-4 20-7z"/></svg>
          </button>
        </div>
      </div>

      {/* FAB */}
      <button className="vws-fab" onClick={() => setOpen((p) => !p)} aria-label={open ? "Close chat" : "Open chat"} aria-expanded={open}>
        {open ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0f0f14" strokeWidth="2.5" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#0f0f14" aria-hidden="true"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>
        )}
        {unread && !open && (
          <span style={{ position:"absolute", top:-4, right:-4, width:13, height:13, borderRadius:"50%", background:"#63b3ed", border:"2px solid #fff", animation:"vws-badge-pulse 2.5s ease-in-out infinite" }} aria-hidden="true" />
        )}
      </button>
    </div>
  );
}
