"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  Inbox,
  Star,
  LayoutGrid,
  History,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/hoje",         label: "Hoje",         icon: CalendarDays },
  { href: "/inbox",        label: "Inbox",        icon: Inbox },
  { href: "/prioridades",  label: "Prioridades",  icon: Star },
  { href: "/kanbans",      label: "Kanbans",      icon: LayoutGrid },
  { href: "/historico",    label: "Histórico",    icon: History },
  { href: "/configuracoes",label: "Config",       icon: Settings },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      className="flex items-center border-t border-border bg-bg-surface"
      aria-label="Navegação mobile"
    >
      {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
        const isActive = pathname === href || pathname.startsWith(href + "/");
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[10px]",
              "transition-colors duration-100",
              isActive
                ? "text-accent-brand"
                : "text-text-muted hover:text-text-secondary"
            )}
            aria-current={isActive ? "page" : undefined}
          >
            <Icon className="h-5 w-5" aria-hidden="true" />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
