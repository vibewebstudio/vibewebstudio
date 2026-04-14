"use client";

import { useState, useRef, useEffect } from "react";

function renderText(text) {
  return text.split(/(\*\*[^*]+\*\*)/).map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} style={{ color: "#f9f5fd", fontWeight: 600 }}>{part.slice(2, -2)}</strong>;
    }
    return part.split("\n").map((line, j, arr) => (
      <span key={`${i}-${j}`}>{line}{j < arr.length - 1 && <br />}</span>
    ));
  });
}

function Bubble({ msg }) {
  const isUser = msg.role === "user";
  return (
    <div className={`flex gap-3 mb-4 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-lg flex-shrink-0 mt-1 overflow-hidden" style={{ background: "#0e0e13" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Vibe" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
        </div>
      )}
      <div className="max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed"
        style={isUser
          ? { background:"#874cff", color:"#fff", borderRadius:"1rem 1rem 0.25rem 1rem" }
          : { background:"#25252d", color:"#cdc2da", borderRadius:"1rem 1rem 1rem 0.25rem", border:"1px solid rgba(72,71,77,0.3)" }
        }>
        {renderText(msg.content)}
      </div>
    </div>
  );
}

function Typing() {
  return (
    <div className="flex gap-3 mb-4">
      <div className="w-8 h-8 rounded-lg flex-shrink-0 overflow-hidden" style={{ background: "#0e0e13" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.png" alt="Vibe" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
      </div>
      <div className="px-4 py-3 rounded-2xl flex items-center gap-1.5"
        style={{ background:"#25252d", border:"1px solid rgba(72,71,77,0.3)" }}>
        {[0,1,2].map(i => (
          <span key={i} style={{
            width:6, height:6, borderRadius:"50%", background:"#874cff", display:"inline-block",
            animation:"bounce 0.8s ease-in-out infinite", animationDelay:`${i*0.15}s`
          }}/>
        ))}
      </div>
    </div>
  );
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role:"assistant", content:"Hey! I'm Vibe ✨ — your guide to VibeWebStudio. Ask me anything about our services, pricing, or timeline!" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [unread, setUnread] = useState(true);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:"smooth" }); }, [messages, loading]);
  useEffect(() => {
    if (open) { setUnread(false); setTimeout(() => inputRef.current?.focus(), 300); }
  }, [open]);

  async function send(textOverride) {
    const text = (textOverride ?? input).trim();
    if (!text || loading) return;
    const updated = [...messages, { role:"user", content: text }];
    setMessages(updated);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ messages: updated.map(m => ({ role:m.role, content:m.content })) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMessages(prev => [...prev, { role:"assistant", content: data.reply }]);
    } catch {
      setMessages(prev => [...prev, { role:"assistant", content:"Oops, something went wrong 😅 Try again or fill out our contact form!" }]);
    } finally { setLoading(false); }
  }

  const suggestions = ["What do you build?", "How much does it cost?", "How long does it take?"];

  return (
    <>
      <style>{`@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}`}</style>

      {/* Panel */}
      <div style={{
        position:"fixed", bottom:"6rem", right:"1.5rem", zIndex:50,
        width:360, maxHeight:560, display:"flex", flexDirection:"column",
        borderRadius:"1rem", overflow:"hidden",
        border:"1px solid rgba(72,71,77,0.4)",
        boxShadow:"0 0 60px rgba(135,76,255,0.2)",
        background:"#0e0e13",
        transition:"all 0.3s cubic-bezier(0.175,0.885,0.32,1.275)",
        transform: open ? "scale(1) translateY(0)" : "scale(0.9) translateY(16px)",
        opacity: open ? 1 : 0, pointerEvents: open ? "auto" : "none",
        transformOrigin: "bottom right",
      }}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4"
          style={{ background:"linear-gradient(135deg,rgba(135,76,255,0.6),rgba(0,207,252,0.4))", borderBottom:"1px solid rgba(72,71,77,0.3)" }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl overflow-hidden flex-shrink-0" style={{ background: "#0e0e13" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="Vibe" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
            </div>
            <div>
              <p style={{ color:"#fff", fontWeight:700, fontSize:14, lineHeight:1 }}>Vibe</p>
              <p style={{ color:"rgba(255,255,255,0.7)", fontSize:11, marginTop:3 }}>VibeWebStudio AI · Online</p>
            </div>
          </div>
          <button onClick={() => setOpen(false)} style={{ color:"rgba(255,255,255,0.6)", background:"none", border:"none", cursor:"pointer", padding:4 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div style={{ flex:1, overflowY:"auto", padding:"1rem", maxHeight:340 }}>
          {messages.map((m,i) => <Bubble key={i} msg={m}/>)}
          {loading && <Typing/>}
          <div ref={bottomRef}/>
        </div>

        {/* Suggestions */}
        {messages.length <= 1 && (
          <div style={{ padding:"0 1rem 0.5rem", display:"flex", flexWrap:"wrap", gap:8 }}>
            {suggestions.map(s => (
              <button key={s} onClick={() => send(s)}
                style={{ fontSize:11, padding:"6px 12px", borderRadius:9999, background:"#25252d",
                  border:"1px solid rgba(72,71,77,0.5)", color:"#cdc2da", cursor:"pointer" }}>
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div style={{ padding:"0.75rem 1rem", borderTop:"1px solid rgba(72,71,77,0.3)", display:"flex", gap:8, alignItems:"flex-end", background:"#131319" }}>
          <textarea ref={inputRef} rows={1} value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if(e.key==="Enter"&&!e.shiftKey){ e.preventDefault(); send(); } }}
            placeholder="Ask me anything…"
            style={{ flex:1, background:"#25252d", border:"1px solid rgba(72,71,77,0.4)", borderRadius:12,
              padding:"10px 16px", fontSize:13, color:"#f9f5fd", resize:"none", outline:"none",
              maxHeight:80, fontFamily:"Inter,sans-serif" }}/>
          <button onClick={send} disabled={!input.trim()||loading}
            style={{ width:40, height:40, borderRadius:12, border:"none", cursor:"pointer",
              background:"linear-gradient(135deg,#874cff,#00cffc)", display:"flex", alignItems:"center",
              justifyContent:"center", flexShrink:0, opacity: (!input.trim()||loading) ? 0.4 : 1 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m22 2-7 20-4-9-9-4 20-7z"/>
            </svg>
          </button>
        </div>
      </div>

      {/* FAB */}
      <button onClick={() => setOpen(p=>!p)} style={{
        position:"fixed", bottom:"1.5rem", right:"5.5rem", zIndex:50,
        width:56, height:56, borderRadius:"1rem", border:"none", cursor:"pointer",
        background:"linear-gradient(135deg,#874cff,#00cffc)",
        boxShadow:"0 0 30px rgba(135,76,255,0.35)",
        display:"flex", alignItems:"center", justifyContent:"center",
        transition:"transform 0.3s cubic-bezier(0.175,0.885,0.32,1.275), box-shadow 0.3s ease",
      }}
        onMouseOver={e => { e.currentTarget.style.transform="scale(1.1)"; e.currentTarget.style.boxShadow="0 0 48px rgba(0,207,252,0.45)"; }}
        onMouseOut={e  => { e.currentTarget.style.transform="scale(1)";   e.currentTarget.style.boxShadow="0 0 30px rgba(135,76,255,0.35)"; }}>
        {open
          ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M18 6 6 18M6 6l12 12"/></svg>
          : <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>
        }
        {unread && !open && (
          <span style={{ position:"absolute", top:-4, right:-4, width:14, height:14,
            borderRadius:"50%", background:"#00cffc", border:"2px solid #0e0e13",
            animation:"bounce 2s ease-in-out infinite" }}/>
        )}
      </button>
    </>
  );
}