"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loadSettings, saveSettings, DEFAULT_SETTINGS, type Settings } from "@/lib/settings";

function NumberInput({
  id,
  label,
  description,
  value,
  min,
  max,
  onChange,
}: {
  id: string;
  label: string;
  description: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm text-text-primary">
        {label}
      </label>
      <p className="text-xs text-text-muted">{description}</p>
      <Input
        id={id}
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={(e) => {
          const v = parseInt(e.target.value, 10);
          if (!isNaN(v) && v >= min && v <= max) onChange(v);
        }}
        className="w-24 bg-bg-subtle border-border text-text-primary"
      />
    </div>
  );
}

export function ConfiguracoesClient() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [saved, setSaved] = useState(false);

  // Load from localStorage on mount (T-50)
  useEffect(() => {
    setSettings(loadSettings());
  }, []);

  function updateLimit(key: keyof Settings["limits"], value: number) {
    setSettings((prev) => ({
      ...prev,
      limits: { ...prev.limits, [key]: value },
    }));
    setSaved(false);
  }

  function handleSave() {
    saveSettings(settings); // T-52: persist to localStorage
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function handleReset() {
    setSettings(DEFAULT_SETTINGS);
    saveSettings(DEFAULT_SETTINGS);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="flex flex-col gap-8 max-w-md">
      {/* User name */}
      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-medium uppercase tracking-wide text-text-muted">
          Perfil
        </h2>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="userName" className="text-sm text-text-primary">
            Seu nome
          </label>

          <Input
            id="userName"
            type="text"
            value={settings.userName}
            onChange={(e) => {
              setSettings((prev) => ({ ...prev, userName: e.target.value }));
              setSaved(false);
            }}
            placeholder="Como gostaria de ser chamado?"
            className="bg-bg-subtle border-border text-text-primary placeholder:text-text-muted"
          />
        </div>
      </section>

      {/* Limits */}
      <section className="flex flex-col gap-4">
        <div>
          <h2 className="text-sm font-medium uppercase tracking-wide text-text-muted">
            Limites
          </h2>
          <p className="mt-0.5 text-xs text-text-muted">
            Esses valores controlam as regras de WIP em toda a aplicação
          </p>
        </div>

        <div className="flex flex-col gap-5 rounded-lg border border-border bg-bg-surface p-4">
          <NumberInput
            id="limitToday"
            label="Tarefas em Hoje"
            description="Máximo de tarefas marcadas como 'Hoje' ao mesmo tempo"
            value={settings.limits.today}
            min={1}
            max={10}
            onChange={(v) => updateLimit("today", v)}
          />
          <NumberInput
            id="limitWeek"
            label="Prioridades semanais"
            description="Máximo de tarefas na lista de Prioridades da semana"
            value={settings.limits.weekPriorities}
            min={1}
            max={10}
            onChange={(v) => updateLimit("weekPriorities", v)}
          />
          <NumberInput
            id="limitNext"
            label="Próximo por área"
            description="Máximo de tarefas em 'Próximo' por área no Kanban"
            value={settings.limits.nextPerArea}
            min={1}
            max={20}
            onChange={(v) => updateLimit("nextPerArea", v)}
          />
          <NumberInput
            id="limitDoing"
            label="Fazendo por área"
            description="Máximo de tarefas em 'Fazendo' por área no Kanban"
            value={settings.limits.doingPerArea}
            min={1}
            max={10}
            onChange={(v) => updateLimit("doingPerArea", v)}
          />
        </div>
      </section>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <Button
          onClick={handleSave}
          className="bg-accent-brand text-bg-base hover:bg-accent-brand-hover"
        >
          {saved ? "Salvo!" : "Salvar configurações"}
        </Button>
        <Button
          variant="outline"
          onClick={handleReset}
          className="border-border text-text-secondary hover:text-text-primary"
        >
          Restaurar padrões
        </Button>
      </div>
    </div>
  );
}
