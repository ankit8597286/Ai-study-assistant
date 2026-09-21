"use client";

import { useEffect, useState } from "react";
import { FileText, CalendarDays, Search, Sparkles, Download, Eye, X, Trash2, BrainCircuit, Loader2 } from "lucide-react";
import api from "@/services/api";
import { downloadSummaryPDF } from "@/utils/downloadPDF";
import { deletePDF } from "@/services/pdfService";
import { useRouter } from "next/navigation";

export default function SummaryPage() {
  const [summaries, setSummaries] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedSummary, setSelectedSummary] = useState(null);
  const [message, setMessage] = useState("");
  const [generatingId, setGeneratingId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/pdf/history");
        setSummaries(res.data.pdfs || []);
      } catch (error) { console.error(error); }
      finally { setLoading(false); }
    })();
  }, []);

  const filtered = summaries.filter((item) => item.fileName?.toLowerCase().includes(search.toLowerCase()));

  const handleDelete = async (id) => {
    try {
      await deletePDF(id);
      setSummaries((prev) => prev.filter((item) => item._id !== id));
    } catch (error) { console.error(error); }
  };

  const handleGenerateFlashcards = async (item) => {
    try {
      setGeneratingId(item._id);
      setMessage("Generating flashcards…");
      await api.post("/ai/flashcards", { fileName: item.fileName, text: item.text });
      setMessage("Flashcards generated. Opening your deck…");
      router.prefetch("/flashcards");
      router.push("/flashcards");
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to generate flashcards.");
    } finally { setGeneratingId(null); }
  };

  return (
    <div className="relative pb-12">
      <div className="ambient-orb orb-violet -left-24 top-20" />
      <section className="page-header reveal">
        <div>
          <span className="eyebrow"><Sparkles size={13} /> Your AI notes</span>
          <h1 className="mt-4 font-display text-4xl font-bold text-white sm:text-5xl">Summary <span className="gradient-text">library.</span></h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">Search, read, download or turn a summary into flashcards.</p>
        </div>
        <div className="relative w-full sm:w-80">
          <Search size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600" />
          <input className="input-glass pl-10" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by file name…" />
        </div>
      </section>

      {message && <div className="mb-5 rounded-2xl border border-cyan-300/12 bg-cyan-300/5 p-4 text-sm text-cyan-100 reveal">{message}</div>}

      {loading ? <Loading /> : filtered.length === 0 ? (
        <div className="glass-panel flex min-h-[350px] flex-col items-center justify-center p-8 text-center">
          <div className="icon-tile"><FileText size={24} /></div>
          <h2 className="mt-4 font-display text-2xl font-bold text-white">{search ? "No summaries match" : "No summaries yet"}</h2>
          <p className="mt-2 max-w-md text-sm leading-6 text-slate-600">{search ? "Try a different file name." : "Upload a PDF first, then your generated summaries will appear here."}</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filtered.map((item, index) => (
            <article key={item._id} className="glass-panel glass-panel-hover p-5 sm:p-6 reveal">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex min-w-0 items-center gap-4">
                  <div className="icon-tile h-14 w-14 rounded-2xl"><FileText size={21} /></div>
                  <div className="min-w-0">
                    <h2 className="truncate font-display text-lg font-bold text-white sm:text-xl">{item.fileName}</h2>
                    <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-600"><CalendarDays size={12} /> {new Date(item.createdAt).toLocaleString()}</p>
                  </div>
                </div>
                <span className="status-pill md:self-start"><span className="h-1.5 w-1.5 rounded-full bg-cyan-300" /> AI generated</span>
              </div>

              <div className="mt-5 rounded-2xl border border-white/6 bg-white/[.025] p-4 sm:p-5">
                <p className="line-clamp-5 whitespace-pre-wrap text-sm leading-7 text-slate-400">{item.summary || "No summary text available."}</p>
                <div className="mt-5 flex flex-wrap gap-2 border-t border-white/6 pt-4">
                  <button onClick={() => setSelectedSummary(item)} className="btn-primary"><Eye size={16} /> View full</button>
                  <button onClick={() => downloadSummaryPDF(item.fileName, item.summary)} className="btn-secondary"><Download size={16} /> Download</button>
                  <button onClick={() => handleGenerateFlashcards(item)} disabled={generatingId === item._id} className="btn-secondary">
                    {generatingId === item._id ? <><Loader2 size={16} className="animate-spin" /> Generating</> : <><BrainCircuit size={16} /> Flashcards</>}
                  </button>
                  <button onClick={() => handleDelete(item._id)} className="btn-danger ml-auto"><Trash2 size={16} /> Delete</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {selectedSummary && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/72 p-4 backdrop-blur-md">
          <div className="glass-panel max-h-[88vh] w-full max-w-4xl overflow-hidden border-cyan-300/15">
            <div className="flex items-center justify-between gap-4 border-b border-white/8 p-5 sm:p-6">
              <div className="min-w-0"><p className="eyebrow w-fit">AI Summary</p><h2 className="mt-2 truncate font-display text-xl font-bold text-white sm:text-2xl">{selectedSummary.fileName}</h2></div>
              <button onClick={() => setSelectedSummary(null)} className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/[.04] text-slate-400 hover:text-white"><X size={19} /></button>
            </div>
            <div className="max-h-[70vh] overflow-y-auto whitespace-pre-wrap p-5 text-sm leading-7 text-slate-300 sm:p-7">{selectedSummary.summary}</div>
          </div>
        </div>
      )}
    </div>
  );
}
function Loading() { return <div className="grid gap-3">{[1,2,3].map((i) => <div key={i} className="glass-panel shimmer h-40" />)}</div>; }
