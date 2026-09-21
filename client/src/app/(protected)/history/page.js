"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FileText, CalendarDays, Clock3, ArrowUpRight, Search, Inbox } from "lucide-react";
import { getPDFHistory } from "@/services/pdfService";

export default function HistoryPage() {
  const [pdfs, setPdfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    (async () => {
      try { setPdfs(await getPDFHistory()); }
      catch (error) { console.error(error); }
      finally { setLoading(false); }
    })();
  }, []);

  const filtered = pdfs.filter((pdf) => pdf.fileName?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="relative pb-12">
      <section className="page-header reveal">
        <div>
          <span className="eyebrow"><Inbox size={13} /> Your library</span>
          <h1 className="mt-4 font-display text-4xl font-bold text-white sm:text-5xl">PDF <span className="gradient-text">history.</span></h1>
          <p className="mt-3 text-sm text-slate-500 sm:text-base">Revisit your uploaded study materials and generated summaries.</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} className="input-glass pl-10" placeholder="Search PDFs…" />
        </div>
      </section>

      {loading ? <Loading /> : filtered.length === 0 ? (
        <div className="glass-panel flex min-h-[330px] flex-col items-center justify-center text-center p-8 reveal">
          <div className="icon-tile"><FileText size={24} /></div>
          <h2 className="mt-4 font-display text-2xl font-bold text-white">{search ? "No matching PDFs" : "Your library is empty"}</h2>
          <p className="mt-2 text-sm text-slate-600">{search ? "Try another search term." : "Upload a PDF to see it here."}</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filtered.map((pdf, index) => (
            <article key={pdf._id} className={`glass-panel glass-panel-hover reveal reveal-delay-${Math.min(index + 1, 4)} p-5 sm:p-6`}>
              <div className="flex flex-col gap-4 md:flex-row md:items-center">
                <div className="flex min-w-0 items-center gap-4">
                  <div className="icon-tile h-14 w-14 rounded-2xl"><FileText size={22} /></div>
                  <div className="min-w-0">
                    <h2 className="truncate font-display text-lg font-bold text-white">{pdf.fileName}</h2>
                    <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-600">
                      <span className="flex items-center gap-1"><CalendarDays size={12} /> {new Date(pdf.createdAt).toLocaleDateString()}</span>
                      <span className="flex items-center gap-1"><Clock3 size={12} /> AI summary available</span>
                    </div>
                  </div>
                </div>
                <span className="status-pill md:ml-auto text-cyan-200"><span className="h-1.5 w-1.5 rounded-full bg-cyan-300" /> AI Summary</span>
              </div>
              <div className="mt-5 rounded-2xl border border-white/6 bg-white/[.025] p-4 sm:p-5">
                <p className="line-clamp-4 whitespace-pre-wrap text-sm leading-7 text-slate-400">{pdf.summary || "No summary preview available."}</p>
                <div className="mt-4 flex items-center justify-between border-t border-white/6 pt-4">
                  <span className="text-[11px] text-slate-700">Saved in your study library</span>
                  <Link href="/summary" className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-200 hover:text-white">Open summaries <ArrowUpRight size={14} /></Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
function Loading() { return <div className="grid gap-3">{[1,2,3].map((i) => <div key={i} className="glass-panel shimmer h-32" />)}</div>; }
