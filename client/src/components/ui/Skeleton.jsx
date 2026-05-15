export function Skeleton({ className = "" }) {
  return <div className={`skeleton rounded-xl ${className}`} />;
}

export function StatCardSkeleton() {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-card p-6">
      <Skeleton className="mb-3 h-4 w-24" />
      <Skeleton className="h-8 w-32" />
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-card p-6">
      <Skeleton className="mb-6 h-5 w-40" />
      <Skeleton className="h-64 w-full" />
    </div>
  );
}

export function TableSkeleton({ rows = 5 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-14 w-full" />
      ))}
    </div>
  );
}

export default Skeleton;
