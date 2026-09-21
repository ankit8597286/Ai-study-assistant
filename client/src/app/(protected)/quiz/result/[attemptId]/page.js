"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, CircleHelp, MinusCircle, RotateCcw, XCircle, Trophy, Sparkles } from "lucide-react";
import { getQuizResult } from "@/services/quizService";

export default function ResultPage() {
  const { attemptId } = useParams();
  const router = useRouter();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!attemptId) return;
    getQuizResult(attemptId).then((data) => setResult(data.result)).catch(console.error).finally(() => setLoading(false));
  }, [attemptId]);

  if (loading) return <Loading />;
  if (!result) return <div className="glass-panel p-8 text-center text-rose-200">Result not found.</div>;

  const percentage = Number(result.percentage || 0);
  const ring = Math.max(0, Math.min(100, percentage));

  return (
    <div className="relative pb-12">
      <div className="ambient-orb orb-cyan right-0 top-10" />
      <section className="page-header reveal">
        <div className="min-w-0">
          <button onClick={() => router.push("/quiz/history")} className="mb-4 inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-cyan-200"><ArrowLeft size={14} /> Back to history</button>
          <span className="eyebrow"><Trophy size={13} /> Test completed</span>
          <h1 className="mt-4 truncate font-display text-3xl font-bold text-white sm:text-4xl">{result.title}</h1>
        </div>
        <div className="flex gap-2"><button onClick={() => router.push("/quiz")} className="btn-primary"><RotateCcw size={16} /> New test</button><button onClick={() => router.push("/quiz/history")} className="btn-secondary">History</button></div>
      </section>

      <section className="glass-panel relative overflow-hidden p-6 sm:p-9 reveal">
        <div className="absolute right-0 top-0 h-56 w-56 rounded-full bg-cyan-300/7 blur-3xl" />
        <div className="relative grid gap-8 lg:grid-cols-[.65fr_1.35fr] lg:items-center">
          <div className="flex flex-col items-center text-center">
            <div className="relative grid h-44 w-44 place-items-center rounded-full" style={{ background: `conic-gradient(#67e8f9 ${ring}%, rgba(255,255,255,.08) 0)` }}>
              <div className="grid h-[154px] w-[154px] place-items-center rounded-full bg-[#0b0e1a]">
                <div><div className="font-display text-4xl font-bold text-white">{percentage.toFixed(1)}%</div><div className="mt-1 text-xs text-slate-600">accuracy</div></div>
              </div>
            </div>
            <p className="mt-5 text-2xl font-bold text-white">{formatNumber(result.score)} <span className="text-slate-600">/ {formatNumber(result.maxScore)}</span></p>
            <p className="mt-1 text-sm text-slate-600">{result.status === "expired" ? "Auto-submitted when time expired" : "Final score"}</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <Card title="Correct" value={result.correct} icon={<CheckCircle2 />} cls="text-emerald-300" />
            <Card title="Wrong" value={result.wrong} icon={<XCircle />} cls="text-rose-300" />
            <Card title="Unattempted" value={result.unattempted} icon={<CircleHelp />} cls="text-slate-300" />
            <Card title="Review" value={result.markedForReview} icon={<RotateCcw />} cls="text-amber-300" />
            <Card title="Negative" value={`-${formatNumber(result.negativeScore)}`} icon={<MinusCircle />} cls="text-rose-200" />
          </div>
        </div>
      </section>

      <section className="mt-5">
        <div className="mb-4 flex items-center gap-3"><div className="icon-tile h-10 w-10 rounded-xl"><Sparkles size={17} /></div><div><h2 className="font-display text-xl font-bold text-white">Question review</h2><p className="text-xs text-slate-600">Correct answers and explanations</p></div></div>
        <div className="space-y-3">
          {result.questions.map((q) => (
            <article key={q.id} className="glass-panel p-5 sm:p-6 reveal">
              <div className="flex gap-3"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl border border-white/8 bg-white/[.03] text-sm font-bold text-slate-300">{q.number}</span><h3 className="pt-1 text-sm font-semibold leading-6 text-white sm:text-base">{q.question}</h3></div>
              <div className="mt-4 grid gap-2 md:grid-cols-2">
                {q.options.map((option, index) => {
                  const correct = index === q.correctOption;
                  const selected = index === q.selectedOption;
                  const cls = correct ? "border-emerald-300/15 bg-emerald-300/6 text-emerald-200" : selected ? "border-rose-300/15 bg-rose-300/6 text-rose-200" : "border-white/6 bg-white/[.02] text-slate-500";
                  return <div key={index} className={`rounded-xl border p-3 text-sm ${cls}`}><span className="mr-2 font-bold">{String.fromCharCode(65 + index)}.</span>{option}{correct && " ✓"}{selected && !correct && " ✕"}</div>;
                })}
              </div>
              <div className="mt-4 rounded-xl border border-violet-300/10 bg-violet-300/[.035] p-4"><div className="flex items-center gap-2 text-xs font-semibold text-violet-100"><CircleHelp size={15} /> Explanation</div><p className="mt-1 text-sm leading-6 text-violet-100/55">{q.explanation || "No explanation was provided."}</p></div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
function Card({ title, value, icon, cls }) { return <div className="rounded-2xl border border-white/7 bg-white/[.025] p-4"><div className={cls}>{icon}</div><div className="mt-2 text-xl font-bold text-white">{value}</div><div className="text-xs text-slate-600">{title}</div></div>; }
function formatNumber(value) { const n = Number(value || 0); return Number.isInteger(n) ? n : n.toFixed(2); }
function Loading() { return <div className="flex min-h-[65vh] items-center justify-center"><div className="glass-panel shimmer px-6 py-5 text-sm font-semibold text-cyan-200">Loading result…</div></div>; }
