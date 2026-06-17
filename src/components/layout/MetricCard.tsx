import { cn } from "@/lib/utils";

interface MetricCardProps {
  label: string;
  value: string | number;
  mono?: boolean;
  className?: string;
}

export function MetricCard({ label, value, mono, className }: MetricCardProps) {
  return (
    <div
      className={cn(
        "rounded-md border border-border bg-bg-surface px-4 py-3",
        className
      )}
    >
      <p className="text-xs text-text-muted uppercase tracking-wide">{label}</p>
      <p
        className={cn(
          "mt-1 text-2xl font-bold text-text-primary tabular-nums",
          mono && "font-mono"
        )}
      >
        {value}
      </p>
    </div>
  );
}
