"use client";

import { useEffect, useState } from "react";
import { LogIn, LogOut, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { WorkDay } from "@/types";

interface CheckInOutCardProps {
  workDay: WorkDay | null;
  onCheckIn: () => Promise<void>;
  onCheckOut: () => Promise<void>;
  loading?: boolean;
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatMinutes(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}h${String(m).padStart(2, "0")}min`;
}

function LiveTimer({ checkInAt }: { checkInAt: string }) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    function tick() {
      const diff = Math.floor((Date.now() - new Date(checkInAt).getTime()) / 60000);
      setElapsed(diff);
    }
    tick();
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, [checkInAt]);

  return (
    <span className="font-mono text-2xl font-bold text-text-primary tabular-nums">
      {formatMinutes(elapsed)}
    </span>
  );
}

export function CheckInOutCard({
  workDay,
  onCheckIn,
  onCheckOut,
  loading,
}: CheckInOutCardProps) {
  const hasCheckIn  = !!workDay?.check_in_at;
  const hasCheckOut = !!workDay?.check_out_at;

  return (
    <div
      className={cn(
        "rounded-lg bg-bg-surface p-6",
        hasCheckIn && !hasCheckOut
          ? "border-l-[3px] border-success"
          : "border border-border"
      )}
    >
      {/* No check-in yet */}
      {!hasCheckIn && (
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-text-primary">Iniciar dia de trabalho</p>
            <p className="text-xs text-text-muted mt-0.5">Registre sua entrada para acompanhar o tempo</p>
          </div>
          <Button
            onClick={onCheckIn}
            disabled={loading}
            className="gap-2 bg-accent-brand text-bg-base hover:bg-accent-brand-hover"
          >
            <LogIn className="h-4 w-4" />
            Check-in
          </Button>
        </div>
      )}

      {/* Active session */}
      {hasCheckIn && !hasCheckOut && workDay?.check_in_at && (
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-success" />
              <span className="text-xs text-text-secondary">
                Entrada: <span className="text-text-primary font-medium">{formatTime(workDay.check_in_at)}</span>
              </span>
            </div>
            <LiveTimer checkInAt={workDay.check_in_at} />
          </div>
          <Button
            onClick={onCheckOut}
            disabled={loading}
            variant="outline"
            className="gap-2 border-border text-text-secondary hover:text-text-primary hover:bg-bg-elevated"
          >
            <LogOut className="h-4 w-4" />
            Check-out
          </Button>
        </div>
      )}

      {/* Day closed */}
      {hasCheckIn && hasCheckOut && workDay?.check_in_at && workDay?.check_out_at && (
        <div className="flex items-center gap-6">
          <div className="flex flex-col gap-0.5">
            <span className="text-xs text-text-muted uppercase tracking-wide">Entrada</span>
            <span className="text-sm font-medium text-text-primary">{formatTime(workDay.check_in_at)}</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-xs text-text-muted uppercase tracking-wide">Saída</span>
            <span className="text-sm font-medium text-text-primary">{formatTime(workDay.check_out_at)}</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-xs text-text-muted uppercase tracking-wide">Total</span>
            <span className="font-mono text-lg font-bold text-text-primary">
              {formatMinutes(workDay.total_minutes)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
