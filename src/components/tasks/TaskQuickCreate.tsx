"use client";

import { useState, useRef } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface TaskQuickCreateProps {
  onSubmit: (title: string) => Promise<void>;
  placeholder?: string;
  className?: string;
}

export function TaskQuickCreate({
  onSubmit,
  placeholder = "Adicionar tarefa...",
  className,
}: TaskQuickCreateProps) {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    const title = value.trim();
    if (!title || loading) return;

    setLoading(true);
    try {
      await onSubmit(title);
      setValue("");
      inputRef.current?.focus();
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
    if (e.key === "Escape") {
      setValue("");
      inputRef.current?.blur();
    }
  }

  return (
    <form onSubmit={handleSubmit} className={cn("flex items-center gap-2", className)}>
      <div className="relative flex-1">
        <Plus className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={loading}
          className={cn(
            "w-full rounded-md border border-border bg-bg-subtle py-2.5 pl-9 pr-4",
            "text-sm text-text-primary placeholder:text-text-muted",
            "transition-colors duration-100",
            "focus:outline-none focus:border-border-focus focus:ring-2 focus:ring-border-focus/20",
            "disabled:opacity-50"
          )}
        />
      </div>
    </form>
  );
}
