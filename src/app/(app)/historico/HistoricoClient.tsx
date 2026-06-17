"use client";

import { HistoryDayCard } from "@/components/layout/HistoryDayCard";
import { MetricCard } from "@/components/layout/MetricCard";
import type { WorkDay, Task } from "@/types";

interface DayEntry {
  workDay: WorkDay;
  completedTasks: Task[];
}

interface HistoricoClientProps {
  days: DayEntry[];
  weekMinutes: number;
  weekCompleted: number;
}

function formatMinutes(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}h${String(m).padStart(2, "0")}min`;
}

export function HistoricoClient({ days, weekMinutes, weekCompleted }: HistoricoClientProps) {
  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      {/* Week metrics (T-49, T-53) */}
      <div className="grid grid-cols-2 gap-3">
        <MetricCard
          label="Tempo na semana"
          value={weekMinutes > 0 ? formatMinutes(weekMinutes) : "—"}
          mono
        />
        <MetricCard label="Concluídas na semana" value={weekCompleted} />
      </div>

      {/* Day list (T-46, T-47, T-48) */}
      {days.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16 text-center">
          <p className="text-sm text-text-secondary">Nenhum dia registrado ainda</p>
          <p className="text-xs text-text-muted mt-1">
            Faça check-in na tela Hoje para começar a registrar seu histórico
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {days.map(({ workDay, completedTasks }) => (
            <HistoryDayCard
              key={workDay.id}
              workDay={workDay}
              completedTasks={completedTasks}
            />
          ))}
        </div>
      )}
    </div>
  );
}
