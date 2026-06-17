export const DEFAULT_LIMITS = {
  today: 3,
  weekPriorities: 5,
  nextPerArea: 5,
  doingPerArea: 2,
} as const;

export type LimitKey = keyof typeof DEFAULT_LIMITS;
