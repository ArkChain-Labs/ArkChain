"use client";

import { usePathname, useRouter } from "next/navigation";
import { ChevronRight, LogOut, Sun, Moon } from "lucide-react";
import { useDisconnect, useAccount } from "wagmi";
import { useTheme } from "@/lib/store/theme";

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
  const { dark, toggle } = useTheme();

  function handleDisconnect() {
    disconnect();
    router.push("/login");
  }

  return (
    <header className="flex h-12 items-center justify-between border-b border-border bg-background px-6">
      <nav className="flex items-center gap-1 text-sm">
        {crumbs.map((crumb, i) => (
          <span key={crumb} className="flex items-center gap-1">
            {i > 0 && <ChevronRight className="h-3 w-3 text-foreground-subtle" />}
            <span className={i === crumbs.length - 1 ? "font-medium text-foreground" : "text-foreground-subtle"}>
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
          onClick={toggle}
          title={dark ? "Modo claro" : "Modo oscuro"}
          className="flex items-center justify-center rounded border border-border w-7 h-7 text-foreground-muted hover:bg-surface hover:text-foreground transition-colors"
        >
          {dark ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
        </button>
        <button
          onClick={handleDisconnect}
          title="Desconectar wallet"
          className="flex items-center gap-1.5 rounded border border-border px-2.5 py-1 text-xs text-foreground-muted hover:border-danger hover:text-danger transition-colors"
        >
          <LogOut className="h-3 w-3" />
          Salir
        </button>
      </div>
    </header>
  );
}
