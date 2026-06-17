"use client";

import { TaskCard, type TaskAction } from "./TaskCard";
import type { Task, Area } from "@/types";

interface TodayTaskListProps {
  tasks: Task[];
  areas: Area[];
  onMarkDoing: (id: string) => void;
  onMarkDone: (id: string) => void;
  onRemoveFromToday: (id: string) => void;
  onEdit: (task: Task) => void;
}

export function TodayTaskList({
  tasks,
  areas,
  onMarkDoing,
  onMarkDone,
  onRemoveFromToday,
  onEdit,
}: TodayTaskListProps) {
  const areaMap = Object.fromEntries(areas.map((a) => [a.id, a]));

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <p className="text-sm text-text-secondary">Nenhuma tarefa para hoje</p>
        <p className="text-xs text-text-muted mt-1">
          Marque tarefas como "Hoje" no Inbox ou Kanbans
        </p>
      </div>
    );
  }

  function getActions(task: Task): TaskAction[] {
    const actions: TaskAction[] = [];
    if (task.status !== "doing") {
      actions.push({ label: "Marcar como Fazendo", onClick: () => onMarkDoing(task.id) });
    }
    actions.push({ label: "Marcar como Concluída", onClick: () => onMarkDone(task.id) });
    actions.push({ label: "Remover de Hoje",       onClick: () => onRemoveFromToday(task.id) });
    actions.push({ label: "Editar",                onClick: () => onEdit(task) });
    return actions;
  }

  return (
    <div className="flex flex-col gap-2">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          area={task.area_id ? areaMap[task.area_id] : null}
          actions={getActions(task)}
          onClick={() => onEdit(task)}
        />
      ))}
    </div>
  );
}
