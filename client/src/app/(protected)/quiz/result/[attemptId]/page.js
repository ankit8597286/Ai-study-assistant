"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, CircleHelp, MinusCircle, RotateCcw, XCircle } from "lucide-react";
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

  if (loading) return <div className="min-h-[70vh] flex items-center justify-center text-cyan-300 font-bold">Loading result...</div>;
  if (!result) return <div className="text-rose-200 p-8">Result not found.</div>;

  const percentage = Number(result.percentage || 0);
  const displayPercentage = `${percentage.toFixed(1)}%`;

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-7">
        <div><p className="text-cyan-300 text-sm font-semibold">TEST COMPLETED</p><h1 className="text-3xl md:text-4xl font-black text-white mt-1">{result.title}</h1></div>
        <div className="flex gap-2"><button onClick={() => router.push("/quiz")} className="px-4 py-2.5 rounded-xl bg-white/10 border border-white/10 text-white inline-flex items-center gap-2"><RotateCcw size={17}/> New Test</button><button onClick={() => router.push("/quiz/history")} className="px-4 py-2.5 rounded-xl bg-cyan-400/10 border border-cyan-400/20 text-cyan-200">History</button></div>
      </div>

      <section className="bg-white/10 border border-white/10 rounded-3xl p-7 md:p-10 text-center">
        <div className="mx-auto w-40 h-40 rounded-full border-[10px] border-cyan-400/20 flex items-center justify-center relative">
          <div><div className="text-4xl font-black text-white">{displayPercentage}</div><div className="text-xs text-slate-400">percentage</div></div>
        </div>
        <div className="mt-5 text-2xl font-black text-white">{formatNumber(result.score)} / {formatNumber(result.maxScore)} Marks</div>
        <p className="text-slate-400 mt-1">{result.status === "expired" ? "Auto-submitted when time expired" : "Your final score"}</p>
      </section>

      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-5">
        <Card title="Correct" value={result.correct} icon={<CheckCircle2 />} cls="text-emerald-300" />
        <Card title="Wrong" value={result.wrong} icon={<XCircle />} cls="text-rose-300" />
        <Card title="Unattempted" value={result.unattempted} icon={<CircleHelp />} cls="text-slate-300" />
        <Card title="Review" value={result.markedForReview} icon={<RotateCcw />} cls="text-amber-300" />
        <Card title="Negative" value={`-${formatNumber(result.negativeScore)}`} icon={<MinusCircle />} cls="text-rose-200" />
      </div>

      <section className="bg-white/10 border border-white/10 rounded-3xl p-6 mt-6">
        <div className="flex items-center justify-between gap-4 mb-5"><h2 className="text-white text-xl font-bold">Question Review</h2><span className="text-slate-500 text-sm">Correct answers and explanations</span></div>
        <div className="space-y-4">
          {result.questions.map((q) => (
            <div key={q.id} className="rounded-2xl bg-white/5 border border-white/10 p-5">
              <div className="flex gap-3"><span className="w-8 h-8 shrink-0 rounded-xl bg-white/10 text-slate-300 flex items-center justify-center font-bold">{q.number}</span><h3 className="text-white font-semibold leading-relaxed">{q.question}</h3></div>
              <div className="grid md:grid-cols-2 gap-2 mt-4">
                {q.options.map((option, index) => {
                  const correct = index === q.correctOption;
                  const selected = index === q.selectedOption;
                  return <div key={index} className={`p-3 rounded-xl border text-sm ${correct ? "bg-emerald-400/10 border-emerald-400/30 text-emerald-200" : selected ? "bg-rose-400/10 border-rose-400/30 text-rose-200" : "bg-white/5 border-white/5 text-slate-400"}`}><span className="font-bold mr-2">{String.fromCharCode(65 + index)}.</span>{option}{correct && " ✓"}{selected && !correct && " ✕"}</div>;
                })}
              </div>
              <div className="mt-4 rounded-xl bg-indigo-400/10 border border-indigo-400/20 p-4 text-sm text-indigo-100"><div className="font-semibold flex gap-2"><CircleHelp size={16}/> Explanation</div><p className="mt-1 text-indigo-100/70">{q.explanation || "No explanation was provided."}</p></div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Card({ title, value, icon, cls }) { return <div className="bg-white/10 border border-white/10 rounded-2xl p-4"><div className={cls}>{icon}</div><div className="text-white text-2xl font-black mt-2">{value}</div><div className="text-slate-500 text-sm">{title}</div></div>; }
function formatNumber(value) { const n = Number(value || 0); return Number.isInteger(n) ? n : n.toFixed(2); }
