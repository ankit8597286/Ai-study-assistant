"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AlertTriangle, CheckCircle2, Clock3, Flag, Loader2, Send, XCircle } from "lucide-react";
import { startQuiz, submitQuiz } from "@/services/quizService";

export default function TestPage() {
  const { id } = useParams();
  const router = useRouter();
  const [quiz, setQuiz] = useState(null);
  const [attemptId, setAttemptId] = useState(null);
  const [answers, setAnswers] = useState({});
  const [remaining, setRemaining] = useState(0);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [confirmSubmit, setConfirmSubmit] = useState(false);
  const answersRef = useRef({});
  const startRequestedRef = useRef(false);

  useEffect(() => {
    if (!id || startRequestedRef.current) return;
    startRequestedRef.current = true;
    let active = true;
    (async () => {
      try {
        const data = await startQuiz(id);
        if (!active) return;
        setQuiz(data.quiz);
        setAttemptId(data.attemptId);
        const answerMap = {};
        (data.answers || []).forEach((answer) => {
          answerMap[String(answer.questionId)] = {
            selectedOption: answer.selectedOption ?? null,
            markedForReview: Boolean(answer.markedForReview),
          };
        });
        setAnswers(answerMap);
        answersRef.current = answerMap;
        setRemaining(Math.max(0, Math.floor((new Date(data.expiresAt).getTime() - Date.now()) / 1000)));
      } catch (err) {
        setError(err.response?.data?.message || "Unable to start this test.");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [id]);

  const attemptedCount = useMemo(() => Object.values(answers).filter((a) => a?.selectedOption !== null && a?.selectedOption !== undefined).length, [answers]);
  const reviewCount = useMemo(() => Object.values(answers).filter((a) => a?.markedForReview).length, [answers]);

  useEffect(() => {
    if (!quiz || !attemptId || submitting || remaining <= 0) return;
    const timer = setInterval(() => {
      setRemaining((value) => {
        if (value <= 1) {
          clearInterval(timer);
          handleSubmit(true);
          return 0;
        }
        return value - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [quiz, attemptId, submitting]);

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60).toString().padStart(2, "0");
    const sec = (seconds % 60).toString().padStart(2, "0");
    return `${min}:${sec}`;
  };

  const selectOption = (questionId, option) => {
    setAnswers((prev) => {
      const next = { ...prev, [String(questionId)]: { ...(prev[String(questionId)] || {}), selectedOption: option } };
      answersRef.current = next;
      return next;
    });
  };

  const toggleReview = (questionId) => {
    setAnswers((prev) => {
      const next = { ...prev, [String(questionId)]: { ...(prev[String(questionId)] || {}), markedForReview: !prev[String(questionId)]?.markedForReview } };
      answersRef.current = next;
      return next;
    });
  };

  async function handleSubmit(auto = false) {
    if (!attemptId || submitting) return;
    try {
      setSubmitting(true);
      const payload = Object.entries(answersRef.current).map(([questionId, answer]) => ({ questionId, ...answer }));
      const data = await submitQuiz(attemptId, payload);
      router.replace(`/quiz/result/${data.result.attemptId}`);
    } catch (err) {
      setSubmitting(false);
      setError(err.response?.data?.message || "Could not submit the test.");
      setConfirmSubmit(false);
    }
  }

  if (loading) return <Loading text="Preparing your test..." />;
  if (error) return <ErrorState message={error} />;
  if (!quiz) return null;

  const question = quiz.questions[current];
  const answer = answers[String(question.id)] || {};
  const isLast = current === quiz.questions.length - 1;

  return (
    <div className="min-h-screen pb-10">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-5">
          <div>
            <p className="text-cyan-300 text-sm font-semibold">LIVE TEST</p>
            <h1 className="text-2xl md:text-3xl font-black text-white mt-1">{quiz.title}</h1>
          </div>
          <div className={`flex items-center gap-2 px-5 py-3 rounded-2xl border font-black text-lg ${remaining <= 60 ? "bg-rose-500/15 border-rose-400/40 text-rose-200 animate-pulse" : "bg-white/10 border-white/10 text-white"}`}>
            <Clock3 size={20} /> {formatTime(remaining)}
          </div>
        </header>

        <div className="grid lg:grid-cols-[1fr_310px] gap-5">
          <main className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-5 md:p-8">
            <div className="flex items-center justify-between gap-3 mb-7">
              <span className="text-slate-300 text-sm font-semibold">Question {current + 1} of {quiz.questions.length}</span>
              <button onClick={() => toggleReview(question.id)} className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm border ${answer.markedForReview ? "bg-amber-400/15 border-amber-400/30 text-amber-200" : "bg-white/5 border-white/10 text-slate-300"}`}>
                <Flag size={15} /> {answer.markedForReview ? "Marked" : "Mark for review"}
              </button>
            </div>

            <div className="min-h-[170px]">
              <h2 className="text-white text-xl md:text-2xl font-bold leading-relaxed">{question.question}</h2>
              {question.topic && <p className="text-slate-500 text-xs mt-4">Topic: {question.topic}</p>}
            </div>

            <div className="space-y-3 mt-5">
              {question.options.map((option, index) => {
                const selected = answer.selectedOption === index;
                return (
                  <button key={index} onClick={() => selectOption(question.id, index)} className={`w-full text-left flex items-start gap-4 p-4 rounded-2xl border transition ${selected ? "bg-cyan-400/15 border-cyan-400/50 text-white" : "bg-white/5 border-white/10 text-slate-200 hover:bg-white/10"}`}>
                    <span className={`w-9 h-9 shrink-0 rounded-xl flex items-center justify-center font-bold ${selected ? "bg-cyan-400 text-slate-950" : "bg-white/10 text-slate-300"}`}>{String.fromCharCode(65 + index)}</span>
                    <span className="pt-1">{option}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex flex-col sm:flex-row justify-between gap-3 mt-8">
              <button disabled={current === 0} onClick={() => setCurrent((v) => v - 1)} className="px-5 py-3 rounded-2xl bg-white/5 border border-white/10 text-white disabled:opacity-30">← Previous</button>
              <button onClick={() => isLast ? setConfirmSubmit(true) : setCurrent((v) => v + 1)} className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-500 text-white font-bold">
                {isLast ? "Finish Test" : "Save & Next →"}
              </button>
            </div>
          </main>

          <aside className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-5 h-fit lg:sticky lg:top-6">
            <div className="grid grid-cols-3 gap-2 mb-5">
              <Stat label="Attempted" value={attemptedCount} icon={<CheckCircle2 size={15} />} cls="text-emerald-300" />
              <Stat label="Unattempted" value={quiz.questions.length - attemptedCount} icon={<XCircle size={15} />} cls="text-slate-300" />
              <Stat label="Review" value={reviewCount} icon={<Flag size={15} />} cls="text-amber-300" />
            </div>

            <div className="flex items-center justify-between mb-3"><h3 className="text-white font-bold">Questions</h3><span className="text-xs text-slate-500">{attemptedCount}/{quiz.questions.length}</span></div>
            <div className="grid grid-cols-5 gap-2">
              {quiz.questions.map((q, index) => {
                const a = answers[String(q.id)] || {};
                const answered = a.selectedOption !== null && a.selectedOption !== undefined;
                const review = a.markedForReview;
                return <button key={q.id} onClick={() => setCurrent(index)} className={`h-10 rounded-xl text-sm font-bold border transition ${current === index ? "bg-indigo-500 border-indigo-300 text-white" : review ? "bg-amber-400/15 border-amber-400/30 text-amber-200" : answered ? "bg-emerald-400/15 border-emerald-400/30 text-emerald-200" : "bg-white/5 border-white/10 text-slate-400"}`}>{index + 1}</button>;
              })}
            </div>

            <div className="mt-5 pt-4 border-t border-white/10 text-xs text-slate-400 space-y-2">
              <p>🟢 Attempted</p><p>⚪ Not attempted</p><p>🟡 Marked for review</p><p>🔵 Current question</p>
            </div>

            <button onClick={() => setConfirmSubmit(true)} className="mt-5 w-full py-3 rounded-2xl bg-rose-500/15 border border-rose-400/25 text-rose-200 font-bold hover:bg-rose-500/20 transition">Submit Test</button>
          </aside>
        </div>
      </div>

      {confirmSubmit && (
        <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-5">
          <div className="max-w-md w-full bg-slate-900 border border-white/10 rounded-3xl p-7 shadow-2xl">
            <AlertTriangle className="text-amber-300 mb-4" size={30} />
            <h2 className="text-white text-2xl font-bold">Submit this test?</h2>
            <p className="text-slate-400 mt-2">You have attempted {attemptedCount} of {quiz.questions.length} questions. Unattempted questions will receive 0 marks.</p>
            <div className="flex gap-3 mt-6"><button onClick={() => setConfirmSubmit(false)} className="flex-1 py-3 rounded-2xl bg-white/5 text-white">Continue</button><button onClick={() => handleSubmit(false)} disabled={submitting} className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-orange-500 text-white font-bold">{submitting ? "Submitting..." : "Submit Now"}</button></div>
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, icon, cls }) { return <div className="rounded-2xl bg-white/5 p-3 text-center"><div className={`flex justify-center ${cls}`}>{icon}</div><div className="text-white font-black text-lg mt-1">{value}</div><div className="text-[10px] text-slate-500">{label}</div></div>; }
function Loading({ text }) { return <div className="min-h-[70vh] flex items-center justify-center text-cyan-300 font-bold"><Loader2 className="animate-spin mr-3" />{text}</div>; }
function ErrorState({ message }) { return <div className="min-h-[70vh] flex items-center justify-center text-rose-200"><div className="bg-rose-500/10 border border-rose-400/20 rounded-3xl p-7">{message}</div></div>; }
