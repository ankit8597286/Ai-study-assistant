export default function Loading() {
  return (
    <div className="space-y-5 pb-10">
      <div className="glass-panel shimmer h-24" />
      <div className="grid gap-5 lg:grid-cols-[1fr_310px]">
        <div className="glass-panel shimmer min-h-[540px]" />
        <div className="glass-panel shimmer h-[380px]" />
      </div>
    </div>
  );
}
