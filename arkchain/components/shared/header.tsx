"use client";

import { usePathname, useRouter } from "next/navigation";
import { ChevronRight, LogOut } from "lucide-react";
import { useDisconnect, useAccount } from "wagmi";

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
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const router = useRouter();

  function handleDisconnect() {
    disconnect();
    router.push("/login");
  }

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

      <div className="flex items-center gap-3">
        {address && (
          <span className="hidden sm:block font-mono text-xs text-foreground-subtle">
            {address.slice(0, 6)}…{address.slice(-4)}
          </span>
        )}
        <button
          onClick={handleDisconnect}
          title="Desconectar wallet"
          className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground-muted hover:border-destructive hover:text-destructive transition-colors"
        >
          <LogOut className="h-3.5 w-3.5" />
          Salir
        </button>
      </div>
    </header>
  );
}
