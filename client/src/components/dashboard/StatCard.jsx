export default function StatCard({ title, value, icon: Icon }) {
  return (
    <div className="glass-panel glass-panel-hover reveal relative overflow-hidden p-5">
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-cyan-300/8 blur-3xl" />
      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.16em] text-slate-500">{title}</p>
          <p className="mt-3 font-display text-4xl font-bold text-white">{value}</p>
          <p className="mt-1 text-xs text-slate-600">Updated from your workspace</p>
        </div>
        <div className="icon-tile float-slow">
          <Icon size={22} />
        </div>
      </div>
    </div>
  );
}
