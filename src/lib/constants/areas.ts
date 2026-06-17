export const DEFAULT_AREAS = [
  { name: "Profissional", slug: "profissional" },
  { name: "Estudos", slug: "estudos" },
  { name: "Pessoal", slug: "pessoal" },
  { name: "Projetos", slug: "projetos" },
] as const;

export type AreaSlug = (typeof DEFAULT_AREAS)[number]["slug"];
