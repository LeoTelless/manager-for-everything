// ─── Enums de domínio ────────────────────────────────────────────────────────

export type TaskStatus =
  | "inbox"
  | "backlog"
  | "next"
  | "doing"
  | "waiting"
  | "done"
  | "archived";

export type TaskPriority = "low" | "medium" | "high";

export type TaskUrgency = "low" | "medium" | "high";

export type TaskSize = "small" | "medium" | "large";

// ─── Entidades principais ─────────────────────────────────────────────────────

export interface Area {
  id: string;
  name: string;
  slug: string;
  color: string | null;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  area_id: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  urgency: TaskUrgency;
  size: TaskSize;
  due_date: string | null;
  link: string | null;
  is_today: boolean;
  is_week_priority: boolean;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
  archived_at: string | null;
}

export interface WorkDay {
  id: string;
  date: string;
  check_in_at: string | null;
  check_out_at: string | null;
  total_minutes: number;
  summary: string | null;
  created_at: string;
  updated_at: string;
}

// ─── Tipos compostos ──────────────────────────────────────────────────────────

export interface TaskWithArea extends Task {
  area: Area | null;
}

// ─── Tipos de formulário ──────────────────────────────────────────────────────

export type CreateTaskInput = Pick<Task, "title"> &
  Partial<
    Pick<
      Task,
      | "description"
      | "area_id"
      | "priority"
      | "urgency"
      | "size"
      | "due_date"
      | "link"
      | "status"
    >
  >;

export type UpdateTaskInput = Partial<
  Pick<
    Task,
    | "title"
    | "description"
    | "area_id"
    | "status"
    | "priority"
    | "urgency"
    | "size"
    | "due_date"
    | "link"
    | "is_today"
    | "is_week_priority"
    | "completed_at"
    | "archived_at"
  >
>;
