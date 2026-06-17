"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { Task, Area, TaskPriority, TaskUrgency, TaskSize, TaskStatus, UpdateTaskInput } from "@/types";

interface TaskFormProps {
  task: Task;
  areas: Area[];
  onSave: (updates: UpdateTaskInput) => Promise<void>;
  onCancel: () => void;
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="text-xs font-medium text-text-secondary uppercase tracking-wide">
      {children}
    </label>
  );
}

const inputClass = "bg-bg-subtle border-border text-text-primary placeholder:text-text-muted focus-visible:ring-border-focus focus-visible:border-border-focus";
const triggerClass = "bg-bg-subtle border-border text-text-primary";

export function TaskForm({ task, areas, onSave, onCancel }: TaskFormProps) {
  const [title, setTitle]           = useState(task.title);
  const [description, setDesc]      = useState(task.description ?? "");
  const [areaId, setAreaId]         = useState(task.area_id ?? "");
  const [priority, setPriority]     = useState<TaskPriority>(task.priority);
  const [urgency, setUrgency]       = useState<TaskUrgency>(task.urgency);
  const [size, setSize]             = useState<TaskSize>(task.size);
  const [status, setStatus]         = useState<TaskStatus>(task.status);
  const [dueDate, setDueDate]       = useState(task.due_date ?? "");
  const [link, setLink]             = useState(task.link ?? "");
  const [saving, setSaving]         = useState(false);
  const [error, setError]           = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) { setError("O título é obrigatório."); return; }

    setSaving(true);
    setError(null);
    try {
      const updates: UpdateTaskInput = {
        title:       title.trim(),
        description: description.trim() || null,
        area_id:     areaId || null,
        priority,
        urgency,
        size,
        status,
        due_date:    dueDate || null,
        link:        link.trim() || null,
      };
      // completed_at logic when status changes
      if (status === "done" && task.status !== "done") {
        updates.completed_at = new Date().toISOString();
        updates.is_today = false;
      } else if (status !== "done" && task.status === "done") {
        updates.completed_at = null;
      }
      await onSave(updates);
    } catch {
      setError("Não foi possível salvar a tarefa.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Title */}
      <div className="flex flex-col gap-1.5">
        <FieldLabel>Título *</FieldLabel>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Título da tarefa"
          className={inputClass}
          autoFocus
        />
      </div>

      {/* Description */}
      <div className="flex flex-col gap-1.5">
        <FieldLabel>Descrição</FieldLabel>
        <Textarea
          value={description}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="Detalhes opcionais..."
          rows={3}
          className={cn(inputClass, "resize-none")}
        />
      </div>

      {/* Row: Area + Status */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <FieldLabel>Área</FieldLabel>
          <Select value={areaId || undefined} onValueChange={(v) => setAreaId(v ?? "")}>
            <SelectTrigger className={triggerClass}>
              <SelectValue placeholder="Sem área" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Sem área</SelectItem>
              {areas.map((a) => (
                <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <FieldLabel>Status</FieldLabel>
          <Select value={status} onValueChange={(v) => setStatus(v as TaskStatus)}>
            <SelectTrigger className={triggerClass}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="inbox">Inbox</SelectItem>
              <SelectItem value="backlog">Backlog</SelectItem>
              <SelectItem value="next">Próximo</SelectItem>
              <SelectItem value="doing">Fazendo</SelectItem>
              <SelectItem value="waiting">Aguardando</SelectItem>
              <SelectItem value="done">Concluído</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Row: Priority + Urgency + Size */}
      <div className="grid grid-cols-3 gap-3">
        <div className="flex flex-col gap-1.5">
          <FieldLabel>Prioridade</FieldLabel>
          <Select value={priority} onValueChange={(v) => setPriority(v as TaskPriority)}>
            <SelectTrigger className={triggerClass}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Baixa</SelectItem>
              <SelectItem value="medium">Média</SelectItem>
              <SelectItem value="high">Alta</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <FieldLabel>Urgência</FieldLabel>
          <Select value={urgency} onValueChange={(v) => setUrgency(v as TaskUrgency)}>
            <SelectTrigger className={triggerClass}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Baixa</SelectItem>
              <SelectItem value="medium">Média</SelectItem>
              <SelectItem value="high">Alta</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <FieldLabel>Tamanho</FieldLabel>
          <Select value={size} onValueChange={(v) => setSize(v as TaskSize)}>
            <SelectTrigger className={triggerClass}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">Pequena</SelectItem>
              <SelectItem value="medium">Média</SelectItem>
              <SelectItem value="large">Grande</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Row: Due date + Link */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <FieldLabel>Prazo</FieldLabel>
          <Input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className={cn(inputClass, "appearance-none")}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <FieldLabel>Link</FieldLabel>
          <Input
            type="url"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="https://..."
            className={inputClass}
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <p className="text-xs text-danger">{error}</p>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-2 pt-1">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={saving}
          className="border-border text-text-secondary hover:text-text-primary hover:bg-bg-elevated"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={saving || !title.trim()}
          className="bg-accent-brand text-bg-base hover:bg-accent-brand-hover"
        >
          {saving ? "Salvando..." : "Salvar"}
        </Button>
      </div>
    </form>
  );
}
