"use client";

import { useReducer, useState } from "react";
import { createRipple, magnetic } from "@/lib/interactions";

// ── Form state managed with useReducer (replaces 8 useState calls) ──────────
const INITIAL = { name:"", email:"", company:"", projectType:"", budget:"", message:"" };

function formReducer(state, patch) {
  return { ...state, ...patch };
}

function validate(fields) {
  const errs = {};
  if (!fields.name?.trim())    errs.name    = "Name is required";
  if (!fields.email?.trim())   errs.email   = "Email is required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) errs.email = "Enter a valid email";
  if (!fields.message?.trim()) errs.message = "Tell us about your project";
  return errs;
}

function useContactForm() {
  const [form, dispatch]       = useReducer(formReducer, INITIAL);
  const [status, setStatus]    = useState("idle"); // idle | loading | success | error
  const [errors, setErrors]    = useState({});
  const [touched, setTouched]  = useState({});

  function update(field) {
    return (e) => dispatch({ [field]: e.target.value });
  }

  function touch(field) {
    setTouched((t) => ({ ...t, [field]: true }));
    const errs = validate(form);
    setErrors((e) => ({ ...e, [field]: errs[field] ?? "" }));
  }

  async function submit(e) {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length) {
      setErrors(errs);
      setTouched({ name:true, email:true, message:true });
      return;
    }
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method:  "POST",
        headers: {
          "Content-Type":   "application/json",
          "x-site-request": "1",          // CSRF guard expected by middleware
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setStatus("success");
      dispatch(INITIAL);
      setErrors({});
      setTouched({});
    } catch (err) {
      console.error("[contact form]", err);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 5000);
    }
  }

  return { form, update, touch, status, submit, errors, touched };
}

// ── Sub-components ────────────────────────────────────────────────────────────

function FieldErr({ field, errors, touched }) {
  if (!touched[field] || !errors[field]) return null;
  return (
    <span className="block text-xs mt-1.5" style={{ color:"#ff6b6b" }} role="alert">
      {errors[field]}
    </span>
  );
}

function errStyle(field, errors, touched) {
  return touched[field] && errors[field] ? { borderColor:"rgba(255,107,107,0.5)" } : {};
}

// ── Main section ─────────────────────────────────────────────────────────────

const PROJECT_TYPES = ["Landing Page", "Business Website", "E-Commerce", "Portfolio", "Other"];

// Aligned with chatbot pricing
const BUDGET_RANGES = [
  "₹15,000 – Landing Page",
  "₹40,000 – Business Site",
  "₹60,000 – E-Commerce",
  "Custom Budget",
];

export default function ContactSection() {
  const { form, update, touch, status, submit, errors, touched } = useContactForm();

  const isLoading = status === "loading";
  const isSuccess = status === "success";
  const isError   = status === "error";

  return (
    <section id="contact" style={{ background:"var(--c-sc-low)", padding:"9rem 1.5rem", position:"relative", overflow:"hidden" }}>
      <div aria-hidden="true" style={{ position:"absolute", width:700, height:700, borderRadius:"50%", top:"50%", left:"50%", transform:"translate(-50%,-50%)", background:"radial-gradient(circle, rgba(0,207,252,0.04) 0%, transparent 65%)", pointerEvents:"none" }} />

      <div className="max-w-4xl mx-auto" style={{ position:"relative", zIndex:1 }}>
        <div className="contact-card relative rounded-3xl overflow-hidden p-8 md:p-14 reveal"
          style={{ background:"var(--c-sc)", border:"1px solid rgba(72,71,77,0.2)" }}>

          <div className="orb" aria-hidden="true" style={{ width:400, height:400, top:-120, right:-120, background:"rgba(187,158,255,0.08)" }} />
          <div className="orb" aria-hidden="true" style={{ width:280, height:280, bottom:-100, left:-80, background:"rgba(0,207,252,0.07)", animationDelay:"2s" }} />

          {/* Heading */}
          <div className="relative z-10 text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div style={{ height:2, width:32, background:"linear-gradient(90deg,transparent,var(--c-secondary))", borderRadius:2 }} />
              <span className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color:"var(--c-secondary)" }}>Get in Touch</span>
              <div style={{ height:2, width:32, background:"linear-gradient(90deg,var(--c-secondary),transparent)", borderRadius:2 }} />
            </div>
            <h2 className="font-headline font-black tracking-tighter mb-4" style={{ fontSize:"clamp(2rem,5vw,3rem)", color:"var(--c-on-surface)" }}>
              Let&apos;s Build Your Website
            </h2>
            <p className="text-sm mb-1" style={{ color:"var(--c-on-sv)" }}>
              Tell us a little about your project and we&apos;ll get back to you within 24 hours.
            </p>
            <p className="text-sm font-bold" style={{ color:"var(--c-secondary)" }}>
              ⚡ Currently accepting 2 new projects this month.
            </p>
          </div>

          {/* ── Success state: hides form ─── */}
          {isSuccess ? (
            <div className="relative z-10 text-center py-16 rounded-2xl"
              style={{ background:"rgba(170,255,220,0.08)", border:"1px solid rgba(170,255,220,0.25)" }}>
              <div style={{ fontSize:"3rem", marginBottom:"1rem" }}>✅</div>
              <h3 className="font-headline font-bold text-2xl mb-2" style={{ color:"var(--c-tertiary)" }}>
                Message Received!
              </h3>
              <p className="text-sm mb-6" style={{ color:"var(--c-on-sv)" }}>
                We&apos;ll get back to you within 24 hours. Check your inbox!
              </p>
              <button
                onClick={() => {/* status auto-resets to idle — button is just UX polish */}}
                className="btn-ghost px-8 py-3 rounded-full font-headline font-bold text-sm"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            /* ── Form ─── */
            <form className="relative z-10 space-y-5" onSubmit={submit} noValidate aria-label="Contact form">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Name */}
                <div>
                  <label htmlFor="cf-name" className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color:"var(--c-on-sv)" }}>
                    Your Name *
                  </label>
                  <input
                    id="cf-name" type="text" placeholder="Jane Smith" required
                    value={form.name} onChange={update("name")} onBlur={() => touch("name")}
                    aria-invalid={!!(errors.name && touched.name)}
                    aria-describedby={errors.name && touched.name ? "cf-name-err" : undefined}
                    className="input-field w-full px-4 py-3 rounded-xl"
                    style={errStyle("name", errors, touched)}
                  />
                  {touched.name && errors.name && (
                    <span id="cf-name-err" className="block text-xs mt-1.5" style={{ color:"#ff6b6b" }} role="alert">{errors.name}</span>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="cf-email" className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color:"var(--c-on-sv)" }}>
                    Email Address *
                  </label>
                  <input
                    id="cf-email" type="email" placeholder="you@yourbusiness.com" required
                    value={form.email} onChange={update("email")} onBlur={() => touch("email")}
                    aria-invalid={!!(errors.email && touched.email)}
                    aria-describedby={errors.email && touched.email ? "cf-email-err" : undefined}
                    className="input-field w-full px-4 py-3 rounded-xl"
                    style={errStyle("email", errors, touched)}
                  />
                  {touched.email && errors.email && (
                    <span id="cf-email-err" className="block text-xs mt-1.5" style={{ color:"#ff6b6b" }} role="alert">{errors.email}</span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Business */}
                <div>
                  <label htmlFor="cf-company" className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color:"var(--c-on-sv)" }}>
                    Business Name
                  </label>
                  <input
                    id="cf-company" type="text" placeholder="Your business (optional)"
                    value={form.company} onChange={update("company")}
                    className="input-field w-full px-4 py-3 rounded-xl"
                  />
                </div>

                {/* Project type */}
                <div>
                  <label htmlFor="cf-type" className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color:"var(--c-on-sv)" }}>
                    Project Type
                  </label>
                  <select
                    id="cf-type" value={form.projectType} onChange={update("projectType")}
                    className="input-field w-full px-4 py-3 rounded-xl"
                    style={{ appearance:"none", cursor:"pointer" }}
                  >
                    <option value="">Select type…</option>
                    {PROJECT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              {/* Budget toggle buttons */}
              <div>
                <p className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color:"var(--c-on-sv)" }}>
                  Budget Range
                </p>
                <div className="flex flex-wrap gap-3" role="group" aria-label="Select a budget range">
                  {BUDGET_RANGES.map((b) => {
                    const isActive = form.budget === b;
                    return (
                      <button
                        key={b} type="button"
                        onClick={(e) => { createRipple(e); update("budget")({ target:{ value: isActive ? "" : b } }); }}
                        aria-pressed={isActive}
                        className="px-4 py-2 rounded-full text-xs font-bold"
                        style={{
                          border:     isActive ? "1px solid var(--c-primary)" : "1px solid rgba(72,71,77,0.35)",
                          background: isActive ? "rgba(187,158,255,0.15)" : "transparent",
                          color:      isActive ? "var(--c-primary)"          : "var(--c-on-sv)",
                          position: "relative", overflow: "hidden",
                          boxShadow: isActive ? "0 0 12px rgba(187,158,255,0.15)" : "none",
                          transition: "all 0.2s ease",
                        }}
                      >
                        {b}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Message */}
              <div>
                <label htmlFor="cf-message" className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color:"var(--c-on-sv)" }}>
                  Tell Us About Your Project *
                </label>
                <textarea
                  id="cf-message" rows={4}
                  placeholder="What kind of website do you need? Who is it for? What do you want visitors to do?"
                  required value={form.message} onChange={update("message")} onBlur={() => touch("message")}
                  aria-invalid={!!(errors.message && touched.message)}
                  aria-describedby={errors.message && touched.message ? "cf-msg-err" : undefined}
                  className="input-field w-full px-4 py-3 rounded-xl resize-none"
                  style={errStyle("message", errors, touched)}
                />
                {touched.message && errors.message && (
                  <span id="cf-msg-err" className="block text-xs mt-1.5" style={{ color:"#ff6b6b" }} role="alert">{errors.message}</span>
                )}
              </div>

              {/* Error banner */}
              {isError && (
                <div className="text-center py-3 px-5 rounded-xl" style={{ background:"rgba(255,107,107,0.1)", border:"1px solid rgba(255,107,107,0.25)" }}>
                  <p className="text-sm font-semibold" style={{ color:"#ff6b6b" }}>
                    ❌ Something went wrong — please try again or email us directly.
                  </p>
                </div>
              )}

              <p className="text-xs text-center" style={{ color:"var(--c-on-sv)" }}>
                🔒 We&apos;ll get back to you within 24 hours. No spam, no pressure.
              </p>

              <button
                type="submit"
                onClick={createRipple}
                disabled={isLoading}
                {...(!isLoading ? magnetic : {})}
                aria-live="polite"
                className="btn-primary cta-ring relative w-full py-5 rounded-full font-headline font-bold text-lg disabled:opacity-60"
              >
                {isLoading ? "Sending…" : "Send My Project Brief"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
