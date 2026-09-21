"use client";

import { useEffect, useState } from "react";
import { BrainCircuit, ChevronLeft, ChevronRight, RotateCcw, Sparkles, Layers3, MousePointer2 } from "lucide-react";
import { getFlashcards } from "@/services/flashcardService";

export default function FlashcardsPage() {
  const [flashcards, setFlashcards] = useState([]);
  const [cardIndex, setCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await getFlashcards();
        if (res.flashcards?.length) setFlashcards(res.flashcards[0].flashcards || []);
      } catch (error) { console.error(error); }
      finally { setLoading(false); }
    })();
  }, []);

  const nextCard = () => { if (cardIndex < flashcards.length - 1) { setCardIndex((v) => v + 1); setShowAnswer(false); } };
  const prevCard = () => { if (cardIndex > 0) { setCardIndex((v) => v - 1); setShowAnswer(false); } };

  if (loading) return <LoadingState text="Loading your flashcards…" />;
  if (!flashcards.length) {
    return (
      <div className="flex min-h-[65vh] items-center justify-center px-4">
        <div className="glass-panel max-w-md p-8 text-center">
          <div className="icon-tile mx-auto"><BrainCircuit size={25} /></div>
          <h2 className="mt-4 font-display text-2xl font-bold text-white">No flashcards yet</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">Generate flashcards from one of your summaries to start active recall.</p>
        </div>
      </div>
    );
  }

  const current = flashcards[cardIndex];
  const progress = ((cardIndex + 1) / flashcards.length) * 100;

  return (
    <div className="relative pb-12">
      <div className="ambient-orb orb-cyan left-0 top-20" />
      <div className="ambient-orb orb-pink right-0 top-[45%]" />

      <section className="page-header reveal">
        <div>
          <span className="eyebrow"><BrainCircuit size={13} /> Active recall</span>
          <h1 className="mt-4 font-display text-4xl font-bold text-white sm:text-5xl">Flip. Recall. <span className="gradient-text">Remember.</span></h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">Tap the card to reveal the answer. Use the arrows to move through the deck.</p>
        </div>
        <div className="status-pill"><Layers3 size={14} /> {cardIndex + 1} / {flashcards.length}</div>
      </section>

      <div className="mx-auto max-w-4xl reveal reveal-delay-1">
        <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-white/[.05]">
          <div className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-cyan-400 to-violet-500 transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>

        <button
          onClick={() => setShowAnswer((v) => !v)}
          className="glass-panel glass-panel-hover relative flex min-h-[390px] w-full items-center justify-center overflow-hidden p-7 text-center sm:min-h-[470px] sm:p-12"
        >
          <div className="absolute left-0 top-0 h-32 w-32 rounded-full bg-cyan-300/8 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-40 w-40 rounded-full bg-violet-500/8 blur-3xl" />
          <div className="relative max-w-3xl">
            <span className={`status-pill ${showAnswer ? "text-emerald-200 border-emerald-300/15 bg-emerald-300/5" : "text-cyan-200"}`}>
              {showAnswer ? "Answer" : "Question"}
            </span>
            <p className="mt-6 font-display text-2xl font-semibold leading-relaxed text-white sm:text-3xl">{showAnswer ? current.answer : current.question}</p>
            <p className="mt-7 flex items-center justify-center gap-2 text-xs text-slate-600"><MousePointer2 size={13} /> Click to flip</p>
          </div>
        </button>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          <button onClick={prevCard} disabled={cardIndex === 0} className="btn-secondary disabled:opacity-30"><ChevronLeft size={18} /> Previous</button>
          <button onClick={() => setShowAnswer((v) => !v)} className="btn-primary"><RotateCcw size={17} /> Flip</button>
          <button onClick={nextCard} disabled={cardIndex === flashcards.length - 1} className="btn-secondary disabled:opacity-30">Next <ChevronRight size={18} /></button>
        </div>
      </div>
    </div>
  );
}
function LoadingState({ text }) { return <div className="flex min-h-[65vh] items-center justify-center"><div className="glass-panel shimmer px-6 py-5 text-sm font-semibold text-cyan-200"><Sparkles size={16} className="mr-2 inline animate-pulse" />{text}</div></div>; }
