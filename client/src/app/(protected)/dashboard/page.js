"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FileText, BookOpenText, CalendarDays, FileUp, History,
  BrainCircuit, ArrowUpRight, Sparkles, Plus, Clock3,
} from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import { getDashboardStats } from "@/services/dashboardService";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [user, setUser] = useState(() => {
    if (typeof window === "undefined") return null;
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  });
  const [recentPDFs, setRecentPDFs] = useState([]);
  const [recentPlans, setRecentPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { router.push("/login"); return; }

    (async () => {
      try {
        const data = await getDashboardStats();
        setStats(data.stats);
        setRecentPDFs(data.recentPDFs || []);
        setRecentPlans(data.recentPlans || []);
      } catch (error) {
        console.error(error);
      } finally { setLoading(false); }
    })();
  }, [router]);

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="glass-panel shimmer px-6 py-5 text-sm font-semibold text-cyan-200">Preparing your dashboard…</div>
      </div>
    );
  }

  return (
    <div className="relative pb-10">
      <div className="ambient-orb orb-cyan -left-24 top-20" />
      <div className="ambient-orb orb-violet right-0 top-64" />

      <section className="page-header reveal">
        <div className="min-w-0">
          <span className="eyebrow"><Sparkles size={13} /> Learning workspace</span>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-bold leading-tight text-white sm:text-5xl">
            Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""}.
            <span className="gradient-text"> Keep the momentum going.</span>
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
            Your study material, summaries, flashcards, plans and tests are all one click away.
          </p>
        </div>
        <Link href="/upload" className="btn-primary shrink-0">
          <FileUp size={18} /> Upload material
        </Link>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="My PDFs" value={stats?.totalPDFs || 0} icon={FileText} />
        <StatCard title="My Summaries" value={stats?.totalPDFs || 0} icon={BookOpenText} />
        <StatCard title="Study Plans" value={stats?.totalPlans || 0} icon={CalendarDays} />
        <StatCard title="Flashcards" value={stats?.totalFlashcards || 0} icon={BrainCircuit} />
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-[1.08fr_.92fr]">
        <section className="glass-panel overflow-hidden p-5 sm:p-6 reveal reveal-delay-1">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.16em] text-slate-600">Recent material</p>
              <h2 className="mt-1 font-display text-xl font-bold text-white">Your latest PDFs</h2>
            </div>
            <Link href="/history" className="status-pill hover:border-cyan-300/20 hover:text-cyan-200">View all <ArrowUpRight size={13} /></Link>
          </div>

          <div className="mt-5 space-y-2.5">
            {recentPDFs.length > 0 ? recentPDFs.slice(0, 5).map((pdf, i) => (
              <div key={pdf._id || i} className="group flex items-center gap-3 rounded-2xl border border-white/6 bg-white/[.025] p-3.5 transition hover:border-white/10 hover:bg-white/[.045]">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-cyan-300/10 bg-cyan-300/5 text-cyan-200"><FileText size={18} /></div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-200">{pdf.fileName}</p>
                  <p className="mt-0.5 flex items-center gap-1 text-[11px] text-slate-600"><Clock3 size={11} /> Recently added</p>
                </div>
                <ArrowUpRight size={15} className="text-slate-700 transition group-hover:text-cyan-300" />
              </div>
            )) : (
              <EmptyState icon={FileText} text="No PDFs uploaded yet." action="/upload" label="Upload your first PDF" />
            )}
          </div>
        </section>

        <section className="glass-panel p-5 sm:p-6 reveal reveal-delay-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.16em] text-slate-600">Next up</p>
            <h2 className="mt-1 font-display text-xl font-bold text-white">Study plans</h2>
          </div>
          <div className="mt-5 space-y-2.5">
            {recentPlans.length > 0 ? recentPlans.slice(0, 4).map((plan, i) => (
              <div key={plan._id || i} className="flex items-center gap-3 rounded-2xl border border-white/6 bg-gradient-to-r from-violet-400/[.04] to-cyan-300/[.03] p-3.5">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-violet-300/10 bg-violet-300/5 text-violet-200"><CalendarDays size={18} /></div>
                <div className="min-w-0"><p className="truncate text-sm font-semibold text-slate-200">{plan.subject}</p><p className="mt-0.5 text-[11px] text-slate-600">AI-generated plan</p></div>
              </div>
            )) : (
              <EmptyState icon={CalendarDays} text="No plans generated yet." action="/planner" label="Create a study plan" />
            )}
          </div>
        </section>
      </div>

      <section className="mt-5 grid gap-3 sm:grid-cols-3 reveal reveal-delay-3">
        <QuickAction href="/upload" icon={FileUp} title="Upload PDF" text="Generate a smart summary" />
        <QuickAction href="/flashcards" icon={BrainCircuit} title="Practice" text="Review active recall cards" />
        <QuickAction href="/quiz" icon={Sparkles} title="Take a test" text="Turn any topic into MCQs" />
      </section>
    </div>
  );
}

function QuickAction({ href, icon: Icon, title, text }) {
  return (
    <Link href={href} className="glass-panel glass-panel-hover group flex items-center gap-3 p-4">
      <div className="icon-tile group-hover:scale-105 transition-transform"><Icon size={19} /></div>
      <div className="min-w-0 flex-1"><p className="font-semibold text-white">{title}</p><p className="mt-0.5 truncate text-xs text-slate-600">{text}</p></div>
      <Plus size={16} className="text-slate-700 group-hover:text-cyan-200" />
    </Link>
  );
}
function EmptyState({ icon: Icon, text, action, label }) {
  return (
    <div className="rounded-2xl border border-dashed border-white/8 p-5 text-center">
      <Icon size={25} className="mx-auto text-slate-600" />
      <p className="mt-2 text-xs text-slate-600">{text}</p>
      <Link href={action} className="mt-3 inline-block text-xs font-semibold text-cyan-200">{label} →</Link>
    </div>
  );
}
