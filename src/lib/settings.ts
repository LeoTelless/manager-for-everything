import { DEFAULT_LIMITS } from "./constants/limits";

export interface Settings {
  userName: string;
  limits: {
    today: number;
    weekPriorities: number;
    nextPerArea: number;
    doingPerArea: number;
  };
}

const STORAGE_KEY = "donelog_settings";

export const DEFAULT_SETTINGS: Settings = {
  userName: "",
  limits: { ...DEFAULT_LIMITS },
};

export function loadSettings(): Settings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw) as Partial<Settings>;
    return {
      userName: parsed.userName ?? DEFAULT_SETTINGS.userName,
      limits: {
        today:           parsed.limits?.today           ?? DEFAULT_SETTINGS.limits.today,
        weekPriorities:  parsed.limits?.weekPriorities  ?? DEFAULT_SETTINGS.limits.weekPriorities,
        nextPerArea:     parsed.limits?.nextPerArea      ?? DEFAULT_SETTINGS.limits.nextPerArea,
        doingPerArea:    parsed.limits?.doingPerArea     ?? DEFAULT_SETTINGS.limits.doingPerArea,
      },
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: Settings): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}
