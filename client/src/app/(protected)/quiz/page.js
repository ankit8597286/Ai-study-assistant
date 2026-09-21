"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BrainCircuit, Clock3, MinusCircle, Sparkles, Target, Trophy, FileText, WandSparkles } from "lucide-react";
import { generateQuiz } from "@/services/quizService";

export default function QuizPage() {
  const router = useRouter();
  const [mode, setMode] = useState("practice");
  const [form, setForm] = useState({ title: "", topic: "", syllabus: "", questionCount: 10, durationMinutes: 10, difficulty: "Mixed", marksPerQuestion: 4, negativeMarks: 1 });
  const [loading, setLoading] = useState(false);
  const [opening, setOpening] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    router.prefetch("/quiz/history");
  }, [router]);

  const negative = mode === "negative";
  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleGenerate = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.topic.trim() && !form.syllabus.trim()) { setError("Enter a topic or paste a syllabus first."); return; }
    try {
      setLoading(true);
      const data = await generateQuiz({
        ...form,
        questionCount: Number(form.questionCount),
        durationMinutes: Number(form.durationMinutes),
        marksPerQuestion: Number(form.marksPerQuestion),
        negativeMarks: negative ? 1 : 0,
        sourceType: form.topic.trim() ? "topic" : "syllabus",
      });

      const quizId = data?.quiz?.id || data?.quiz?._id;
      if (!quizId) throw new Error("Quiz was generated but no test ID was returned by the backend.");

      const testPath = `/quiz/test/${encodeURIComponent(String(quizId))}`;
      setOpening(true);
      router.prefetch(testPath);
      router.replace(testPath);
      // If navigation never completes, don't stay stuck on "Opening…".
      setTimeout(() => { setOpening(false); setError((e) => e || "The test was created but could not be opened. Check Test history."); }, 15000);
    } catch (err) {
      setOpening(false);
      setError(err.userMessage || err.response?.data?.message || err.message || "Could not generate the test. Please try again.");
    } finally { setLoading(false); }
  };

  return (
    <div className="relative pb-12">
      <div className="ambient-orb orb-cyan -left-24 top-10" /><div className="ambient-orb orb-violet right-0 top-[48%]" />
      <section className="page-header reveal">
        <div>
          <span className="eyebrow"><WandSparkles size={13} /> AI testing studio</span>
          <h1 className="mt-4 max-w-4xl font-display text-4xl font-bold text-white sm:text-5xl">Build a test for <span className="gradient-text">what you&apos;re learning.</span></h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">Choose a topic or syllabus, set the test rules, then start a timed MCQ session.</p>
        </div>
        <button onClick={() => router.push("/quiz/history")} className="btn-secondary shrink-0"><Trophy size={17} /> Test history</button>
      </section>

      <div className="grid gap-4 md:grid-cols-2 reveal reveal-delay-1">
        <ModeCard active={mode === "practice"} onClick={() => setMode("practice")} icon={BrainCircuit} title="Practice test" copy="No negative marking. Focus on learning." />
        <ModeCard active={mode === "negative"} onClick={() => setMode("negative")} icon={MinusCircle} title="Negative marking" copy="Train with 1 mark deducted for wrong answers." danger />
      </div>

      <form onSubmit={handleGenerate} className="glass-panel mt-5 p-5 sm:p-7 reveal reveal-delay-2">
        <div className="grid gap-7 lg:grid-cols-[1.25fr_.75fr]">
          <div className="space-y-5">
            <Field label="Test title"><input className="input-glass" value={form.title} onChange={(e) => update("title", e.target.value)} placeholder={negative ? "Mock Test 01" : "Data Structures Practice"} /></Field>
            <Field label="Topic"><input className="input-glass" value={form.topic} onChange={(e) => update("topic", e.target.value)} placeholder="e.g. Data Structures — Trees and Graphs" /></Field>
            <Field label="Or paste your syllabus"><textarea className="input-glass min-h-40 resize-none" rows={6} value={form.syllabus} onChange={(e) => update("syllabus", e.target.value)} placeholder="Paste units/topics here. AI will distribute questions across them." /></Field>
          </div>

          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Questions"><input type="number" min="1" max="50" className="input-glass" value={form.questionCount} onChange={(e) => update("questionCount", e.target.value)} /></Field>
              <Field label="Time (min)"><input type="number" min="1" max="300" className="input-glass" value={form.durationMinutes} onChange={(e) => update("durationMinutes", e.target.value)} /></Field>
            </div>
            <Field label="Difficulty"><select className="input-glass" value={form.difficulty} onChange={(e) => update("difficulty", e.target.value)}><option>Mixed</option><option>Easy</option><option>Medium</option><option>Hard</option></select></Field>
            <div className="rounded-2xl border border-white/8 bg-white/[.025] p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-white"><Target size={17} className="text-cyan-200" /> Marking scheme</div>
              <div className="mt-3 space-y-2 text-sm text-slate-500"><Line label="Correct" value={`+${form.marksPerQuestion}`} good /><Line label="Wrong" value={negative ? "-1" : "0"} danger={negative} /><Line label="Unattempted" value="0" /></div>
            </div>
            <div className="rounded-2xl border border-cyan-300/10 bg-cyan-300/[.035] p-4"><div className="flex items-center gap-2 text-sm font-semibold text-cyan-100"><Clock3 size={16} /> Timed exam mode</div><p className="mt-1 text-xs leading-5 text-slate-600">The timer uses the server start time, so refreshing cannot reset it.</p></div>
          </div>
        </div>

        {error && <div className="mt-5 rounded-2xl border border-rose-300/15 bg-rose-300/6 p-4 text-sm text-rose-200">{error}</div>}
        <button disabled={loading || opening} className="btn-primary mt-6 w-full py-3.5 sm:w-auto">{loading ? <><Sparkles size={18} className="animate-spin" /> Generating questions…</> : opening ? <><Sparkles size={18} className="animate-pulse" /> Opening your test…</> : <>Generate & start test <Sparkles size={17} /></>}</button>
      </form>
    </div>
  );
}
function Field({ label, children }) { return <div><label className="mb-1.5 block text-xs font-semibold text-slate-300">{label}</label>{children}</div>; }
function ModeCard({ active, onClick, icon: Icon, title, copy, danger }) { return <button type="button" onClick={onClick} className={`glass-panel text-left p-5 transition ${active ? (danger ? "border-rose-300/25 bg-rose-300/[.05]" : "border-cyan-300/25 bg-cyan-300/[.05]") : "hover:border-white/14"}`}><div className="flex items-center gap-3"><div className={`grid h-12 w-12 place-items-center rounded-2xl ${danger ? "bg-rose-300/8 text-rose-200" : "bg-cyan-300/8 text-cyan-200"}`}><Icon size={21} /></div><div><p className="font-semibold text-white">{title}</p><p className="mt-1 text-xs text-slate-600">{copy}</p></div></div></button>; }
function Line({ label, value, good, danger }) { return <div className="flex justify-between"><span>{label}</span><span className={good ? "text-emerald-300" : danger ? "text-rose-300" : "text-slate-300"}>{value}</span></div>; }
