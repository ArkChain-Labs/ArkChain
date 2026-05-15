"use client";

import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const breadcrumbMap: Record<string, string[]> = {
  "/app/portafolio": ["App", "Portafolio"],
  "/app/marketplace": ["App", "Marketplace"],
  "/app/emisor/cap-table": ["Emisor", "Cap Table"],
  "/app/regulador/auditoria": ["Regulador", "Auditoría"],
  "/app/regulador/reportes": ["Regulador", "Reportes"],
};

export function Header() {
  const pathname = usePathname();
  const crumbs = breadcrumbMap[pathname] ?? ["App"];

  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-surface px-6">
      <nav className="flex items-center gap-1.5 text-sm">
        {crumbs.map((crumb, i) => (
          <span key={crumb} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight className="h-3.5 w-3.5 text-foreground-subtle" />}
            <span
              className={
                i === crumbs.length - 1
                  ? "font-medium text-foreground"
                  : "text-foreground-subtle"
              }
            >
              {crumb}
            </span>
          </span>
        ))}
      </nav>
      <ConnectButton
        showBalance={false}
        chainStatus="none"
        accountStatus="avatar"
      />
    </header>
  );
}
