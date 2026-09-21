"use client";

import { useState } from "react";
import api from "@/services/api";
import { CalendarDays, Clock3, BookOpenText, Sparkles, WandSparkles, Download, ArrowRight, CheckCircle2 } from "lucide-react";
import { generatePlanner } from "@/services/plannerService";
import toast from "react-hot-toast";

export default function PlannerPage() {
  const [subject, setSubject] = useState("");
  const [examDate, setExamDate] = useState("");
  const [hoursPerDay, setHoursPerDay] = useState("");
  const [plan, setPlan] = useState("");
  const [loading, setLoading] = useState(false);

  const generatePlan = async () => {
    if (!subject.trim() || !examDate || !hoursPerDay) return;
    try {
      setLoading(true);
      const res = await generatePlanner({ subject, examDate, hoursPerDay });
      setPlan(res.planner.plan);
    } catch (error) {
      toast.error(error.userMessage || error.response?.data?.message || "Could not generate the study plan.");
    } finally { setLoading(false); }
  };

  const downloadPDF = async () => {
    try {
      const res = await api.post("/planner/download-pdf", { plan }, { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url; link.download = "study-plan.pdf";
      document.body.appendChild(link); link.click(); link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) { console.error(error); }
  };

  return (
    <div className="relative pb-12">
      <div className="ambient-orb orb-violet -left-20 top-20" />
      <div className="ambient-orb orb-cyan right-0 top-[42%]" />

      <section className="page-header reveal">
        <div>
          <span className="eyebrow"><WandSparkles size={13} /> Smart planning</span>
          <h1 className="mt-4 font-display text-4xl font-bold text-white sm:text-5xl">Build a plan you can <span className="gradient-text">actually follow.</span></h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">Tell the assistant what you&apos;re preparing for, when the exam is, and how much time you have each day.</p>
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-[.86fr_1.14fr]">
        <section className="glass-panel p-5 sm:p-7 reveal reveal-delay-1">
          <div className="flex items-center gap-3 border-b border-white/8 pb-5">
            <div className="icon-tile"><CalendarDays size={19} /></div>
            <div><p className="font-semibold text-white">Plan inputs</p><p className="text-xs text-slate-600">A few details are enough to start.</p></div>
          </div>

          <div className="mt-6 space-y-5">
            <Field icon={BookOpenText} label="Subject or exam">
              <input className="input-glass pl-11" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g. Data Structures" />
            </Field>
            <Field icon={CalendarDays} label="Exam date">
              <input className="input-glass pl-11" type="date" value={examDate} onChange={(e) => setExamDate(e.target.value)} />
            </Field>
            <Field icon={Clock3} label="Study hours per day">
              <input className="input-glass pl-11" type="number" min="0.5" step="0.5" value={hoursPerDay} onChange={(e) => setHoursPerDay(e.target.value)} placeholder="2" />
            </Field>

            <button onClick={generatePlan} disabled={loading || !subject.trim() || !examDate || !hoursPerDay} className="btn-primary w-full py-3.5 disabled:opacity-45">
              {loading ? <><Sparkles size={18} className="animate-pulse" /> Creating your plan…</> : <>Generate study plan <ArrowRight size={18} /></>}
            </button>
          </div>
        </section>

        <section className={`glass-panel min-h-[470px] overflow-hidden p-5 sm:p-7 ${plan ? "reveal" : ""}`}>
          {!plan ? (
            <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
              <div className="relative grid h-20 w-20 place-items-center rounded-[1.7rem] border border-violet-300/12 bg-violet-300/5 text-violet-200">
                <div className="absolute inset-0 rounded-[1.7rem] border border-violet-300/10 pulse-soft" />
                <CalendarDays size={32} />
              </div>
              <h2 className="mt-6 font-display text-2xl font-bold text-white">Your plan will appear here</h2>
              <p className="mt-2 max-w-md text-sm leading-6 text-slate-600">Once generated, you&apos;ll get a structured schedule you can read, revise and export as a PDF.</p>
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-4 border-b border-white/8 pb-5 sm:flex-row sm:items-center sm:justify-between">
                <div><span className="status-pill text-emerald-200"><CheckCircle2 size={14} /> Plan ready</span><h2 className="mt-3 font-display text-2xl font-bold text-white">Your AI study plan</h2></div>
                <button onClick={downloadPDF} className="btn-secondary"><Download size={17} /> Export PDF</button>
              </div>
              <div className="mt-6 whitespace-pre-wrap text-sm leading-7 text-slate-300">{plan}</div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
function Field({ icon: Icon, label, children }) {
  return <div><label className="mb-1.5 block text-xs font-semibold text-slate-300">{label}</label><div className="relative"><Icon size={17} className="pointer-events-none absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-slate-600" />{children}</div></div>;
}
