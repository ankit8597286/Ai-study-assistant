"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Clock3, MinusCircle, Trophy, XCircle } from "lucide-react";
import { getQuizHistory } from "@/services/quizService";

export default function QuizHistoryPage() {
  const router = useRouter();
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { getQuizHistory().then((data) => setAttempts(data.attempts || [])).catch(console.error).finally(() => setLoading(false)); }, []);

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-7"><div><p className="text-cyan-300 text-sm font-semibold">YOUR PROGRESS</p><h1 className="text-4xl font-black text-white mt-1">Test History</h1><p className="text-slate-400 mt-2">Review every generated test and your performance.</p></div><button onClick={() => router.push("/quiz")} className="px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-500 text-white font-bold">+ Create Test</button></div>

      {loading ? <div className="text-cyan-300 py-20 text-center">Loading history...</div> : attempts.length === 0 ? <div className="bg-white/10 border border-white/10 rounded-3xl p-12 text-center"><Trophy className="mx-auto text-cyan-300" size={42}/><h2 className="text-white text-2xl font-bold mt-4">No tests yet</h2><p className="text-slate-400 mt-2">Create your first AI-generated test.</p></div> : <div className="space-y-4">{attempts.map((item) => <button key={item.id} onClick={() => router.push(`/quiz/result/${item.id}`)} className="w-full text-left bg-white/10 hover:bg-white/[.13] border border-white/10 rounded-3xl p-5 transition"><div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5"><div className="min-w-0"><div className="flex items-center gap-2"><h2 className="text-white font-bold text-lg truncate">{item.title}</h2>{item.negativeMarks > 0 && <span className="text-[10px] px-2 py-1 rounded-full bg-rose-400/10 text-rose-200 border border-rose-400/20">-1 marking</span>}</div><div className="flex flex-wrap gap-4 mt-2 text-xs text-slate-500"><span>{item.questionCount} questions</span><span><Clock3 size={12} className="inline mr-1"/>{item.durationMinutes} min</span><span>{new Date(item.createdAt).toLocaleString()}</span></div></div><div className="grid grid-cols-4 gap-3 min-w-[320px]"><Metric icon={<Trophy size={14}/>} label="Score" value={`${formatNumber(item.score)}/${formatNumber(item.maxScore)}`} cls="text-cyan-200"/><Metric icon={<CheckCircle2 size={14}/>} label="Correct" value={item.correct} cls="text-emerald-200"/><Metric icon={<XCircle size={14}/>} label="Wrong" value={item.wrong} cls="text-rose-200"/><Metric icon={<MinusCircle size={14}/>} label="Accuracy" value={`${Number(item.percentage || 0).toFixed(0)}%`} cls="text-amber-200"/></div></div></button>)}</div>}
    </div>
  );
}

function Metric({ icon, label, value, cls }) { return <div className="bg-white/5 rounded-2xl p-3 text-center"><div className={`flex justify-center ${cls}`}>{icon}</div><div className="text-white font-bold text-sm mt-1">{value}</div><div className="text-slate-600 text-[10px]">{label}</div></div>; }
function formatNumber(value) { const n = Number(value || 0); return Number.isInteger(n) ? n : n.toFixed(2); }
