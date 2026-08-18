"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  BrainCircuit,
  Clock3,
  FileText,
  MinusCircle,
  Sparkles,
  Target,
  Trophy,
} from "lucide-react";
import { generateQuiz } from "@/services/quizService";

export default function QuizPage() {
  const router = useRouter();
  const [mode, setMode] = useState("practice");
  const [form, setForm] = useState({
    title: "",
    topic: "",
    syllabus: "",
    questionCount: 10,
    durationMinutes: 10,
    difficulty: "Mixed",
    marksPerQuestion: 4,
    negativeMarks: 1,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const negative = mode === "negative";

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleGenerate = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.topic.trim() && !form.syllabus.trim()) {
      setError("Enter a topic or syllabus first.");
      return;
    }

    try {
      setLoading(true);
      const data = await generateQuiz({
        ...form,
        negativeMarks: negative ? 1 : 0,
        sourceType: form.topic.trim() ? "topic" : "syllabus",
      });
      router.push(`/quiz/test/${data.quiz.id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Could not generate the test. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-cyan-300 text-sm mb-4">
              <Sparkles size={15} /> AI-powered testing
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white">Quiz & Tests</h1>
            <p className="text-slate-300 mt-2 max-w-2xl">
              Turn any topic or syllabus into a timed MCQ test and instantly analyse your performance.
            </p>
          </div>
          <button
            onClick={() => router.push("/quiz/history")}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 text-white transition"
          >
            <Trophy size={18} /> Test History
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <button
            type="button"
            onClick={() => setMode("practice")}
            className={`text-left p-5 rounded-3xl border transition ${mode === "practice" ? "bg-cyan-400/15 border-cyan-400/40" : "bg-white/5 border-white/10 hover:bg-white/10"}`}
          >
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-cyan-400/15 text-cyan-300"><BrainCircuit /></div>
              <div>
                <h2 className="text-white text-xl font-bold">Practice Test</h2>
                <p className="text-slate-400 text-sm">No negative marking</p>
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setMode("negative")}
            className={`text-left p-5 rounded-3xl border transition ${mode === "negative" ? "bg-rose-400/15 border-rose-400/40" : "bg-white/5 border-white/10 hover:bg-white/10"}`}
          >
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-rose-400/15 text-rose-300"><MinusCircle /></div>
              <div>
                <h2 className="text-white text-xl font-bold">Negative Marking Series</h2>
                <p className="text-slate-400 text-sm">1 mark deducted for every wrong answer</p>
              </div>
            </div>
          </button>
        </div>

        <form onSubmit={handleGenerate} className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl">
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-5">
              <div>
                <label className="text-slate-200 text-sm font-semibold">Test title (optional)</label>
                <input value={form.title} onChange={(e) => update("title", e.target.value)} placeholder={negative ? "CUET PG Mock Test 01" : "Data Structures Practice"} className="quiz-input mt-2" />
              </div>

              <div>
                <label className="text-slate-200 text-sm font-semibold">Topic</label>
                <input value={form.topic} onChange={(e) => update("topic", e.target.value)} placeholder="e.g. Data Structures - Trees and Graphs" className="quiz-input mt-2" />
              </div>

              <div>
                <label className="text-slate-200 text-sm font-semibold">Or paste your syllabus</label>
                <textarea value={form.syllabus} onChange={(e) => update("syllabus", e.target.value)} placeholder="Paste units/topics here. AI will distribute questions across them." rows={6} className="quiz-input mt-2 resize-none" />
              </div>
            </div>

            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Questions">
                  <input type="number" min="1" max="50" value={form.questionCount} onChange={(e) => update("questionCount", e.target.value)} className="quiz-input" />
                </Field>
                <Field label="Time (min)">
                  <input type="number" min="1" max="300" value={form.durationMinutes} onChange={(e) => update("durationMinutes", e.target.value)} className="quiz-input" />
                </Field>
              </div>

              <Field label="Difficulty">
                <select value={form.difficulty} onChange={(e) => update("difficulty", e.target.value)} className="quiz-input">
                  <option>Mixed</option><option>Easy</option><option>Medium</option><option>Hard</option>
                </select>
              </Field>

              <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                <div className="flex items-center gap-2 text-white font-semibold"><Target size={18} className="text-cyan-300" /> Marking scheme</div>
                <div className="mt-3 text-sm text-slate-300 space-y-2">
                  <div className="flex justify-between"><span>Correct</span><span className="text-emerald-300">+4</span></div>
                  <div className="flex justify-between"><span>Wrong</span><span className={negative ? "text-rose-300" : "text-slate-300"}>{negative ? "-1" : "0"}</span></div>
                  <div className="flex justify-between"><span>Unattempted</span><span>0</span></div>
                </div>
              </div>

              <div className="rounded-2xl bg-cyan-400/10 border border-cyan-400/20 p-4 text-sm text-cyan-100">
                <div className="flex items-center gap-2 font-semibold"><Clock3 size={17} /> Timed exam mode</div>
                <p className="mt-1 text-cyan-100/70">The timer continues from the server start time, so refreshing cannot reset it.</p>
              </div>
            </div>
          </div>

          {error && <div className="mt-5 p-4 rounded-2xl bg-rose-500/10 border border-rose-400/20 text-rose-200">{error}</div>}

          <button disabled={loading} className="mt-7 w-full md:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-500 text-white font-bold shadow-lg hover:scale-[1.01] transition disabled:opacity-50">
            {loading ? "Generating Questions..." : "Generate & Start Test →"}
          </button>
        </form>
      </div>

      <style jsx>{`
        .quiz-input { width: 100%; border-radius: 1rem; border: 1px solid rgba(255,255,255,.1); background: rgba(255,255,255,.06); color: white; padding: .85rem 1rem; outline: none; }
        .quiz-input:focus { border-color: rgba(34,211,238,.6); box-shadow: 0 0 0 3px rgba(34,211,238,.08); }
        .quiz-input::placeholder { color: rgb(100 116 139); }
        select.quiz-input option { background: #1e1b4b; color: white; }
      `}</style>
    </div>
  );
}

function Field({ label, children }) {
  return <div><label className="text-slate-200 text-sm font-semibold block mb-2">{label}</label>{children}</div>;
}
