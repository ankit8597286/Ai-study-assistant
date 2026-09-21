"use client";

import { useState } from "react";
import { Mail, UserRound, ShieldCheck, Sparkles } from "lucide-react";

export default function ProfilePage() {
  const [user] = useState(() => {
    if (typeof window === "undefined") return null;
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  });

  const initial = user?.name?.charAt(0)?.toUpperCase() || "A";

  return (
    <div className="relative pb-12">
      <section className="page-header reveal">
        <div>
          <span className="eyebrow"><UserRound size={13} /> Your account</span>
          <h1 className="mt-4 font-display text-4xl font-bold text-white sm:text-5xl">Your <span className="gradient-text">profile.</span></h1>
          <p className="mt-3 text-sm text-slate-500 sm:text-base">A quick view of the account connected to your study workspace.</p>
        </div>
      </section>

      <section className="glass-panel overflow-hidden p-6 sm:p-8 reveal reveal-delay-1">
        <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-cyan-300/7 blur-3xl" />
        <div className="relative flex flex-col gap-7 md:flex-row md:items-center">
          <div className="relative grid h-28 w-28 shrink-0 place-items-center rounded-[2rem] bg-gradient-to-br from-cyan-300 to-violet-500 font-display text-5xl font-bold text-[#061018] shadow-[0_0_45px_rgba(103,232,249,.12)]">
            {initial}
            <span className="absolute -bottom-2 -right-2 grid h-9 w-9 place-items-center rounded-xl border-4 border-[#0d1022] bg-emerald-300 text-[#062016]"><ShieldCheck size={16} /></span>
          </div>
          <div className="min-w-0">
            <span className="status-pill text-emerald-200"><span className="h-1.5 w-1.5 rounded-full bg-emerald-300" /> Active learner</span>
            <h2 className="mt-3 truncate font-display text-3xl font-bold text-white">{user?.name || "Student"}</h2>
            <p className="mt-1 flex items-center gap-2 text-sm text-slate-500"><Mail size={14} />{user?.email || "No email available"}</p>
          </div>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <InfoCard icon={Sparkles} title="AI workspace" text="Summaries, flashcards, planner and tests." />
          <InfoCard icon={UserRound} title="Account identity" text="Managed through your existing authentication flow." />
        </div>
      </section>
    </div>
  );
}
function InfoCard({ icon: Icon, title, text }) { return <div className="flex gap-3 rounded-2xl border border-white/6 bg-white/[.025] p-4"><div className="icon-tile h-11 w-11 rounded-xl"><Icon size={18} /></div><div><p className="font-semibold text-white">{title}</p><p className="mt-1 text-xs leading-5 text-slate-600">{text}</p></div></div>; }
