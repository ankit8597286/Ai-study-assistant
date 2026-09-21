"use client";

import { Sparkles, ShieldCheck } from "lucide-react";

export default function AuthShell({
  badge,
  title,
  copy,
  visualTitle,
  visualItems,
  children,
  footer = "AI Study Assistant · Developed by Ankit Kumar",
}) {
  return (
    <main className="auth-page">
      <div className="auth-orb auth-orb-one" />
      <div className="auth-orb auth-orb-two" />

      <div className="auth-shell">
        <section className="auth-visual">
          <div>
            <div className="mb-10 flex items-center gap-3">
              <div className="brand-mark">
                <Sparkles size={21} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[.22em] text-cyan-200/80">AI Study</p>
                <p className="font-display text-lg font-bold text-white">Assistant</p>
              </div>
            </div>

            <div className="auth-badge">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-200 shadow-[0_0_14px_rgba(103,232,249,.9)]" />
              {badge}
            </div>
            <h1 className="mt-5 max-w-xl font-display text-5xl font-bold leading-[1.02] text-white xl:text-6xl">
              {title}
            </h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-slate-400">{copy}</p>
          </div>

          <div className="mt-12 grid gap-3">
            <p className="text-[10px] font-bold uppercase tracking-[.22em] text-slate-600">{visualTitle}</p>
            {visualItems.map(([Icon, heading, description], index) => (
              <div key={heading} className="auth-feature" style={{ animationDelay: `${index * 70 + 80}ms` }}>
                <div className="icon-tile"><Icon size={18} /></div>
                <div className="min-w-0">
                  <p className="font-semibold text-white">{heading}</p>
                  <p className="mt-1 text-sm leading-5 text-slate-500">{description}</p>
                </div>
              </div>
            ))}

            <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-600">
              <ShieldCheck size={14} className="text-emerald-300/80" />
              Your password stays on the secure backend.
            </div>
          </div>
        </section>

        <section className="auth-form-side">
          <div className="auth-card">
            {children}
            <p className="mt-7 border-t border-white/[.07] pt-5 text-center text-[10px] text-slate-600">{footer}</p>
          </div>
        </section>
      </div>
    </main>
  );
}
