export type TaskStatus   = "inbox" | "backlog" | "next" | "doing" | "waiting" | "done" | "archived";
export type TaskPriority = "low" | "medium" | "high";
export type TaskUrgency  = "low" | "medium" | "high";
export type TaskSize     = "small" | "medium" | "large";

export type Database = {
  public: {
    Tables: {
      areas: {
        Row: {
          id:         string;
          name:       string;
          slug:       string;
          color:      string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?:         string;
          name:        string;
          slug:        string;
          color?:      string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?:         string;
          name?:       string;
          slug?:       string;
          color?:      string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      tasks: {
        Row: {
          id:               string;
          title:            string;
          description:      string | null;
          area_id:          string | null;
          status:           TaskStatus;
          priority:         TaskPriority;
          urgency:          TaskUrgency;
          size:             TaskSize;
          due_date:         string | null;
          link:             string | null;
          is_today:         boolean;
          is_week_priority: boolean;
          created_at:       string;
          updated_at:       string;
          completed_at:     string | null;
          archived_at:      string | null;
        };
        Insert: {
          id?:               string;
          title:             string;
          description?:      string | null;
          area_id?:          string | null;
          status?:           TaskStatus;
          priority?:         TaskPriority;
          urgency?:          TaskUrgency;
          size?:             TaskSize;
          due_date?:         string | null;
          link?:             string | null;
          is_today?:         boolean;
          is_week_priority?: boolean;
          created_at?:       string;
          updated_at?:       string;
          completed_at?:     string | null;
          archived_at?:      string | null;
        };
        Update: {
          title?:            string;
          description?:      string | null;
          area_id?:          string | null;
          status?:           TaskStatus;
          priority?:         TaskPriority;
          urgency?:          TaskUrgency;
          size?:             TaskSize;
          due_date?:         string | null;
          link?:             string | null;
          is_today?:         boolean;
          is_week_priority?: boolean;
          completed_at?:     string | null;
          archived_at?:      string | null;
        };
        Relationships: [];
      };
      work_days: {
        Row: {
          id:            string;
          date:          string;
          check_in_at:   string | null;
          check_out_at:  string | null;
          total_minutes: number;
          summary:       string | null;
          created_at:    string;
          updated_at:    string;
        };
        Insert: {
          id?:            string;
          date:           string;
          check_in_at?:   string | null;
          check_out_at?:  string | null;
          total_minutes?: number;
          summary?:       string | null;
          created_at?:    string;
          updated_at?:    string;
        };
        Update: {
          check_in_at?:   string | null;
          check_out_at?:  string | null;
          total_minutes?: number;
          summary?:       string | null;
        };
        Relationships: [];
      };
    };
    Views:     Record<string, { Row: Record<string, unknown>; Relationships: [] }>;
    Functions: Record<string, { Args: Record<string, unknown>; Returns: unknown }>;
    Enums: {
      task_status:   TaskStatus;
      task_priority: TaskPriority;
      task_urgency:  TaskUrgency;
      task_size:     TaskSize;
    };
  };
};
