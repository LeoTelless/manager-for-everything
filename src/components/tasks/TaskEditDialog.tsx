"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TaskForm } from "./TaskForm";
import type { Task, Area, UpdateTaskInput } from "@/types";

interface TaskEditDialogProps {
  task: Task | null;
  areas: Area[];
  open: boolean;
  onClose: () => void;
  onSave: (id: string, updates: UpdateTaskInput) => Promise<void>;
}

export function TaskEditDialog({
  task,
  areas,
  open,
  onClose,
  onSave,
}: TaskEditDialogProps) {
  if (!task) return null;

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent
        className="bg-bg-surface border-border text-text-primary sm:max-w-lg"
        showCloseButton
      >
        <DialogHeader>
          <DialogTitle className="text-text-primary">Editar tarefa</DialogTitle>
        </DialogHeader>
        <TaskForm
          task={task}
          areas={areas}
          onSave={(updates) => onSave(task.id, updates)}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
}
