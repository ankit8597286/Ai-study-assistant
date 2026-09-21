"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AlertTriangle, CheckCircle2, Clock3, Flag, Loader2, Send, XCircle, Sparkles } from "lucide-react";
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

    const loadTest = async () => {
      try {
        setError("");
        const data = await startQuiz(decodeURIComponent(String(id)));
        if (!data?.quiz?.questions?.length || !data.attemptId || !data.expiresAt) {
          throw new Error("The backend returned an incomplete test. Please create the test again.");
        }

        const answerMap = {};
        (data.answers || []).forEach((answer) => {
          answerMap[String(answer.questionId)] = {
            selectedOption: answer.selectedOption ?? null,
            markedForReview: Boolean(answer.markedForReview),
          };
        });

        setQuiz(data.quiz);
        setAttemptId(data.attemptId);
        setAnswers(answerMap);
        answersRef.current = answerMap;
        setRemaining(Math.max(0, Math.floor((new Date(data.expiresAt).getTime() - Date.now()) / 1000)));
      } catch (err) {
        const status = err.response?.status;
        const message =
          err.userMessage ||
          err.response?.data?.message ||
          (status === 404
            ? "This test was not found. It may have been created in a different account or deleted."
            : status === 401
              ? "Your session has expired. Please sign in again."
              : "Unable to open this test. Please try again.");
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    loadTest();
  }, [id]);

  const attemptedCount = useMemo(() => Object.values(answers).filter((a) => a?.selectedOption !== null && a?.selectedOption !== undefined).length, [answers]);
  const reviewCount = useMemo(() => Object.values(answers).filter((a) => a?.markedForReview).length, [answers]);

  useEffect(() => {
    if (!quiz || !attemptId || submitting || remaining <= 0) return;
    const timer = setInterval(() => {
      setRemaining((value) => {
        if (value <= 1) { clearInterval(timer); handleSubmit(true); return 0; }
        return value - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [quiz, attemptId, submitting]);

  const formatTime = (seconds) => `${Math.floor(seconds / 60).toString().padStart(2, "0")}:${(seconds % 60).toString().padStart(2, "0")}`;

  const selectOption = (questionId, option) => {
    setAnswers((prev) => {
      const next = { ...prev, [String(questionId)]: { ...(prev[String(questionId)] || {}), selectedOption: option } };
      answersRef.current = next; return next;
    });
  };

  const toggleReview = (questionId) => {
    setAnswers((prev) => {
      const next = { ...prev, [String(questionId)]: { ...(prev[String(questionId)] || {}), markedForReview: !prev[String(questionId)]?.markedForReview } };
      answersRef.current = next; return next;
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
      setSubmitting(false); setError(err.response?.data?.message || "Could not submit the test."); setConfirmSubmit(false);
    }
  }

  if (loading) return <Loading text="Preparing your test…" />;
  if (error) return <ErrorState message={error} onBack={() => router.replace("/quiz")} onRetry={() => window.location.reload()} />;
  if (!quiz || !Array.isArray(quiz.questions) || quiz.questions.length === 0) return <ErrorState message="No questions are available for this test." onBack={() => router.replace("/quiz")} />;

  const question = quiz.questions[Math.min(current, quiz.questions.length - 1)];
  const answer = answers[String(question.id)] || {};
  const isLast = current === quiz.questions.length - 1;
  const danger = remaining <= 60;

  return (
    <div className="relative pb-10">
      <div className="ambient-orb orb-cyan -left-24 top-10" />
      <header className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0"><span className="eyebrow"><Sparkles size={13} /> Live test</span><h1 className="mt-3 truncate font-display text-2xl font-bold text-white sm:text-3xl">{quiz.title}</h1></div>
        <div className={`inline-flex w-fit items-center gap-2 rounded-2xl border px-4 py-3 font-display text-lg font-bold ${danger ? "border-rose-300/25 bg-rose-300/8 text-rose-200 pulse-soft" : "border-white/8 bg-white/[.04] text-white"}`}><Clock3 size={19} /> {formatTime(remaining)}</div>
      </header>

      <div className="grid gap-5 lg:grid-cols-[1fr_310px]">
        <main className="glass-panel p-5 sm:p-7">
          <div className="mb-6 flex items-center justify-between gap-3">
            <div><p className="text-xs font-semibold uppercase tracking-[.13em] text-slate-600">Question {current + 1} / {quiz.questions.length}</p><div className="mt-2 h-1.5 w-36 overflow-hidden rounded-full bg-white/[.05] sm:w-56"><div className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-violet-500 transition-all" style={{ width: `${((current+1)/quiz.questions.length)*100}%` }} /></div></div>
            <button onClick={() => toggleReview(question.id)} className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold ${answer.markedForReview ? "border-amber-300/20 bg-amber-300/8 text-amber-200" : "border-white/8 bg-white/[.03] text-slate-400"}`}><Flag size={14} /> {answer.markedForReview ? "Marked" : "Review"}</button>
          </div>

          <div className="min-h-[150px]"><h2 className="font-display text-xl font-semibold leading-8 text-white sm:text-2xl">{question.question}</h2>{question.topic && <p className="mt-4 text-xs text-slate-600">Topic · {question.topic}</p>}</div>

          <div className="mt-5 space-y-2.5">
            {question.options.map((option, index) => {
              const selected = answer.selectedOption === index;
              return <button key={index} onClick={() => selectOption(question.id, index)} className={`flex w-full items-start gap-3 rounded-2xl border p-3.5 text-left transition sm:p-4 ${selected ? "border-cyan-300/30 bg-cyan-300/[.07] text-white shadow-[0_0_28px_rgba(103,232,249,.05)]" : "border-white/7 bg-white/[.02] text-slate-300 hover:border-white/12 hover:bg-white/[.035]"}`}><span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl text-sm font-bold ${selected ? "bg-cyan-300 text-[#061018]" : "bg-white/[.06] text-slate-400"}`}>{String.fromCharCode(65 + index)}</span><span className="pt-1 text-sm leading-6">{option}</span></button>;
            })}
          </div>

          <div className="mt-7 flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between"><button disabled={current === 0} onClick={() => setCurrent((v) => v - 1)} className="btn-secondary disabled:opacity-25">← Previous</button><button onClick={() => isLast ? setConfirmSubmit(true) : setCurrent((v) => v + 1)} className="btn-primary">{isLast ? <>Finish test <Send size={16} /></> : <>Save & next <span>→</span></>}</button></div>
        </main>

        <aside className="glass-panel h-fit p-4 lg:sticky lg:top-20">
          <div className="grid grid-cols-3 gap-2">
            <Stat label="Attempted" value={attemptedCount} icon={<CheckCircle2 size={14} />} cls="text-emerald-300" />
            <Stat label="Open" value={quiz.questions.length - attemptedCount} icon={<XCircle size={14} />} cls="text-slate-300" />
            <Stat label="Review" value={reviewCount} icon={<Flag size={14} />} cls="text-amber-300" />
          </div>

          <div className="my-5 border-t border-white/7 pt-5"><div className="mb-3 flex items-center justify-between"><p className="text-sm font-semibold text-white">Question map</p><span className="text-[10px] text-slate-600">{attemptedCount}/{quiz.questions.length}</span></div><div className="grid grid-cols-5 gap-1.5">{quiz.questions.map((q, index) => { const a = answers[String(q.id)] || {}; const answered = a.selectedOption !== null && a.selectedOption !== undefined; const review = a.markedForReview; return <button key={q.id} onClick={() => setCurrent(index)} className={`h-9 rounded-xl border text-xs font-bold transition ${current === index ? "border-cyan-300/40 bg-cyan-300/10 text-cyan-100" : review ? "border-amber-300/15 bg-amber-300/6 text-amber-200" : answered ? "border-emerald-300/15 bg-emerald-300/6 text-emerald-200" : "border-white/7 bg-white/[.025] text-slate-600"}`}>{index + 1}</button>; })}</div></div>

          <div className="space-y-1.5 text-[11px] text-slate-600"><p>● Attempted</p><p>● Not attempted</p><p>● Marked for review</p></div>
          <button onClick={() => setConfirmSubmit(true)} className="btn-danger mt-5 w-full"><Send size={15} /> Submit test</button>
        </aside>
      </div>

      {confirmSubmit && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-4 backdrop-blur-md">
          <div className="glass-panel w-full max-w-md border-amber-300/12 p-6 sm:p-7">
            <div className="icon-tile mb-4 border-amber-300/15 bg-amber-300/5 text-amber-200"><AlertTriangle size={20} /></div>
            <h2 className="font-display text-2xl font-bold text-white">Submit this test?</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">You&apos;ve attempted {attemptedCount} of {quiz.questions.length}. Unattempted questions receive 0 marks.</p>
            <div className="mt-6 flex gap-2"><button onClick={() => setConfirmSubmit(false)} className="btn-secondary flex-1">Continue</button><button onClick={() => handleSubmit(false)} disabled={submitting} className="btn-primary flex-1">{submitting ? <><Loader2 size={16} className="animate-spin" />Submitting</> : <>Submit now <Send size={15} /></>}</button></div>
          </div>
        </div>
      )}
    </div>
  );
}
function Stat({ label, value, icon, cls }) { return <div className="rounded-xl border border-white/6 bg-white/[.025] p-3 text-center"><div className={`flex justify-center ${cls}`}>{icon}</div><div className="mt-1 text-base font-bold text-white">{value}</div><div className="text-[9px] text-slate-600">{label}</div></div>; }
function Loading({ text }) { return <div className="flex min-h-[65vh] items-center justify-center"><div className="glass-panel shimmer px-6 py-5 text-sm font-semibold text-cyan-200"><Loader2 size={16} className="mr-2 inline animate-spin" />{text}</div></div>; }
function ErrorState({ message, onBack, onRetry }) {
  return (
    <div className="flex min-h-[65vh] items-center justify-center p-4">
      <div className="glass-panel w-full max-w-lg p-7 text-center">
        <div className="mx-auto icon-tile border-rose-300/15 bg-rose-300/[.06] text-rose-200"><AlertTriangle size={22} /></div>
        <h2 className="mt-4 font-display text-xl font-bold text-white">Test could not be opened</h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">{message}</p>
        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          {onRetry && <button onClick={onRetry} className="btn-primary flex-1">Try again</button>}
          <button onClick={onBack} className="btn-secondary flex-1">Back to quiz</button>
        </div>
      </div>
    </div>
  );
}
