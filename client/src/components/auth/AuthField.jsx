"use client";

export default function AuthField({ icon: Icon, label, error = false, children }) {
  return (
    <div className="space-y-2">
      <label className="block text-xs font-bold uppercase tracking-[0.12em] text-slate-300">
        {label}
      </label>
      <div
        className={`group relative rounded-2xl border transition-all duration-200 ${
          error
            ? "border-rose-300/35 bg-rose-300/[.045]"
            : "border-white/10 bg-white/[.045] hover:border-white/16 focus-within:border-cyan-300/35 focus-within:bg-white/[.06] focus-within:shadow-[0_0_0_4px_rgba(103,232,249,.06),0_18px_40px_rgba(0,0,0,.14)]"
        }`}
      >
        <span className="pointer-events-none absolute left-4 top-1/2 z-10 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-xl border border-white/[.07] bg-white/[.035] text-slate-500 transition-colors group-focus-within:text-cyan-200">
          <Icon size={16} strokeWidth={2.2} />
        </span>
        <div className="auth-field-input">{children}</div>
      </div>
    </div>
  );
}
