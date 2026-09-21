"use client";

import { useState } from "react";
import {
  UploadCloud, FileText, Sparkles, CheckCircle2, Download,
  X, Loader2, ShieldCheck, ArrowRight, BrainCircuit,
} from "lucide-react";
import api from "@/services/api";
import { downloadSummaryPDF } from "@/utils/downloadPDF";
import toast from "react-hot-toast";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState("");
  const [dragging, setDragging] = useState(false);

  const chooseFile = (next) => {
    // Accepts a FileList, an array, or a single File (input change + drag/drop).
    const candidate = next instanceof File ? next : Array.from(next || [])[0];
    if (!candidate) return;
    const fileName = candidate.name?.toLowerCase() || "";
    const fileType = candidate.type?.toLowerCase() || "";
    if (fileType !== "application/pdf" && !fileName.endsWith(".pdf")) {
      toast.error("Please select a PDF file.");
      return;
    }
    if (candidate.size > MAX_FILE_SIZE) {
      toast.error("PDFs must be 10 MB or smaller.");
      return;
    }
    setFile(candidate);
    setSummary("");
  };

  const handleUpload = async () => {
    if (!file || loading) return;
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("pdf", file);
      const res = await api.post("/pdf/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 120000,
      });
      setSummary(res.data.pdf.summary || "");
      toast.success("Your summary is ready.");
    } catch (error) {
      toast.error(error.userMessage || error.response?.data?.message || "Upload failed. Please try again.");
    } finally { setLoading(false); }
  };

  return (
    <div className="relative pb-12">
      <div className="ambient-orb orb-cyan -left-24 top-10" />
      <div className="ambient-orb orb-violet right-0 top-56" />

      <section className="page-header reveal">
        <div>
          <span className="eyebrow"><Sparkles size={13} /> AI document engine</span>
          <h1 className="mt-4 font-display text-4xl font-bold text-white sm:text-5xl">Turn a PDF into <span className="gradient-text">study-ready notes.</span></h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">Upload a lecture, chapter, notes or syllabus. The AI Study Assistant extracts the text and generates a student-friendly summary.</p>
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-[1.1fr_.9fr]">
        <section className="glass-panel reveal reveal-delay-1 p-5 sm:p-7">
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => { e.preventDefault(); setDragging(false); chooseFile(e.dataTransfer.files); }}
            className={`relative overflow-hidden rounded-[1.35rem] border-2 border-dashed p-7 text-center transition-all sm:p-10 ${
              dragging ? "border-cyan-300/60 bg-cyan-300/[.07]" : "border-white/10 bg-white/[.02] hover:border-cyan-300/25 hover:bg-white/[.035]"
            }`}
          >
            <div className="pointer-events-none absolute -left-16 top-0 h-40 w-40 rounded-full bg-cyan-300/8 blur-3xl" />
            <div className="relative mx-auto grid h-20 w-20 place-items-center rounded-3xl border border-cyan-300/15 bg-gradient-to-br from-cyan-300/10 to-violet-400/10 text-cyan-200 shadow-[0_0_40px_rgba(103,232,249,.07)] float-slow">
              <UploadCloud size={34} />
            </div>

            <h2 className="mt-6 font-display text-2xl font-bold text-white">Drop your PDF here</h2>
            <p className="mt-2 text-sm text-slate-600">or choose a file from your device</p>

            <label className="btn-secondary mt-6 inline-flex cursor-pointer">
              <FileText size={17} /> Choose PDF
              <input type="file" accept=".pdf,application/pdf" onChange={(e) => { chooseFile(e.target.files); e.target.value = ""; }} className="hidden" />
            </label>
            <p className="mt-4 text-[11px] text-slate-700">PDF only · maximum 10 MB</p>
          </div>

          {file && (
            <div className="mt-4 flex items-center gap-3 rounded-2xl border border-cyan-300/10 bg-cyan-300/[.035] p-3.5">
              <div className="icon-tile"><FileText size={18} /></div>
              <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-white">{file.name}</p><p className="text-[11px] text-slate-600">{(file.size / 1024 / 1024).toFixed(2)} MB</p></div>
              <button onClick={() => { setFile(null); setSummary(""); }} className="grid h-9 w-9 place-items-center rounded-xl text-slate-600 hover:bg-white/[.05] hover:text-white"><X size={17} /></button>
            </div>
          )}

          <button onClick={handleUpload} disabled={!file || loading} className="btn-primary mt-5 w-full py-3.5 disabled:opacity-45">
            {loading ? <><Loader2 size={18} className="animate-spin" /> AI is reading your PDF…</> : <>Analyze with AI <ArrowRight size={18} /></>}
          </button>

          {loading && (
            <div className="mt-5 overflow-hidden rounded-2xl border border-white/8 bg-white/[.025] p-4">
              <div className="shimmer h-2 overflow-hidden rounded-full bg-white/[.06]"><div className="h-full w-[68%] rounded-full bg-gradient-to-r from-cyan-300 to-violet-400" /></div>
              <p className="mt-3 text-center text-xs text-slate-600">Extracting content → understanding concepts → drafting summary</p>
            </div>
          )}
        </section>

        <aside className="space-y-5">
          <section className="glass-panel reveal reveal-delay-2 p-6">
            <div className="flex items-center gap-3"><div className="icon-tile"><ShieldCheck size={19} /></div><div><p className="font-semibold text-white">Simple workflow</p><p className="text-xs text-slate-600">Designed to stay out of your way.</p></div></div>
            <div className="mt-5 space-y-3">
              <Step n="01" title="Upload" text="Choose a PDF from your device." />
              <Step n="02" title="Analyze" text="The backend extracts and sends text to your AI provider." />
              <Step n="03" title="Revise" text="Read, download and reuse the generated summary." />
            </div>
          </section>
          <section className="glass-panel reveal reveal-delay-3 p-6">
            <div className="flex items-center gap-3"><div className="icon-tile"><BrainCircuit size={19} /></div><div><p className="font-semibold text-white">Built for students</p><p className="text-xs text-slate-600">Keep concepts clear and revision focused.</p></div></div>
            <p className="mt-4 text-sm leading-6 text-slate-500">Use your generated summaries as a first pass, then revisit the source PDF for details, formulas and examples.</p>
          </section>
        </aside>
      </div>

      {summary && (
        <section className="glass-panel mt-5 overflow-hidden p-5 sm:p-7 reveal">
          <div className="flex flex-col gap-4 border-b border-white/8 pb-5 sm:flex-row sm:items-center sm:justify-between">
            <div><span className="status-pill text-cyan-200"><CheckCircle2 size={14} /> Summary ready</span><h2 className="mt-3 font-display text-2xl font-bold text-white">AI Summary</h2></div>
            <button onClick={() => downloadSummaryPDF(file?.name || "summary", summary)} className="btn-success"><Download size={17} /> Download PDF</button>
          </div>
          <div className="mt-6 whitespace-pre-wrap text-sm leading-7 text-slate-300 sm:text-[15px]">{summary}</div>
        </section>
      )}
    </div>
  );
}
function Step({ n, title, text }) {
  return <div className="flex gap-3"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl border border-white/8 bg-white/[.03] text-[10px] font-bold text-cyan-200">{n}</span><div><p className="text-sm font-semibold text-white">{title}</p><p className="mt-0.5 text-xs leading-5 text-slate-600">{text}</p></div></div>;
}
