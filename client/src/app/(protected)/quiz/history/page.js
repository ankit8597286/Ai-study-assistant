"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Clock3, MinusCircle, Trophy, XCircle, ArrowUpRight, ClipboardCheck } from "lucide-react";
import { getQuizHistory } from "@/services/quizService";

export default function QuizHistoryPage() {
  const router = useRouter();
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getQuizHistory()
      .then((data) => setAttempts(data.attempts || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="relative pb-12">
      <section className="page-header reveal">
        <div>
          <span className="eyebrow"><ClipboardCheck size={13} /> Test history</span>
          <h1 className="mt-4 font-display text-4xl font-bold text-white sm:text-5xl">Your practice <span className="gradient-text">trail.</span></h1>
          <p className="mt-3 text-sm text-slate-500 sm:text-base">Review completed tests, scores and accuracy.</p>
        </div>
        <button onClick={() => router.push("/quiz")} className="btn-primary"><ClipboardCheck size={17} /> Create test</button>
      </section>

      {loading ? <Loading /> : attempts.length === 0 ? (
        <div className="glass-panel flex min-h-[360px] flex-col items-center justify-center text-center p-8">
          <div className="icon-tile"><Trophy size={24} /></div>
          <h2 className="mt-4 font-display text-2xl font-bold text-white">No tests yet</h2>
          <p className="mt-2 max-w-md text-sm leading-6 text-slate-600">Create an AI-generated test and your completed attempts will appear here.</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {attempts.map((item, i) => (
            <button key={item.id} onClick={() => router.push(`/quiz/result/${item.id}`)} className="glass-panel glass-panel-hover w-full text-left p-4 sm:p-5 reveal">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-center">
                <div className="flex min-w-0 flex-1 items-start gap-3">
                  <div className="icon-tile h-12 w-12 rounded-xl"><Trophy size={18} /></div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2"><h2 className="truncate font-display text-base font-bold text-white sm:text-lg">{item.title}</h2>{item.negativeMarks > 0 && <span className="status-pill text-rose-200 border-rose-300/10 bg-rose-300/5">Negative marking</span>}</div>
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-600">
                      <span>{item.questionCount} questions</span><span><Clock3 size={11} className="mr-1 inline" />{item.durationMinutes} min</span><span>{new Date(item.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 xl:w-[420px]">
                  <Metric icon={<Trophy size={13} />} label="Score" value={`${formatNumber(item.score)}/${formatNumber(item.maxScore)}`} cls="text-cyan-200" />
                  <Metric icon={<CheckCircle2 size={13} />} label="Correct" value={item.correct} cls="text-emerald-200" />
                  <Metric icon={<XCircle size={13} />} label="Wrong" value={item.wrong} cls="text-rose-200" />
                  <Metric icon={<MinusCircle size={13} />} label="Accuracy" value={`${Number(item.percentage || 0).toFixed(0)}%`} cls="text-amber-200" />
                </div>
                <ArrowUpRight size={17} className="hidden text-slate-700 xl:block" />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Metric({ icon, label, value, cls }) {
  return <div className="rounded-xl border border-white/6 bg-white/[.025] p-3 text-center"><div className={`flex justify-center ${cls}`}>{icon}</div><div className="mt-1 text-sm font-bold text-white">{value}</div><div className="text-[10px] text-slate-600">{label}</div></div>;
}
function formatNumber(value) { const n = Number(value || 0); return Number.isInteger(n) ? n : n.toFixed(2); }
function Loading() { return <div className="grid gap-3">{[1,2,3].map((i) => <div key={i} className="glass-panel shimmer h-28" />)}</div>; }
