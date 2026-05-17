"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, ShoppingCart, LayoutGrid, ShieldCheck, FileText, Wallet } from "lucide-react";
import { useAccount } from "wagmi";
import { ProfileSwitcher } from "./profile-switcher";
import { useUserRole } from "@/lib/store/user-role";
import { useTheme } from "@/lib/store/theme";
import { cn } from "@/lib/utils";
import { formatAddress } from "@/lib/format";

const navByRole = {
  investor: [
    { href: "/app/portafolio", label: "Portafolio", icon: BarChart3 },
    { href: "/app/marketplace", label: "Marketplace", icon: ShoppingCart },
  ],
  issuer: [
    { href: "/app/emisor/cap-table", label: "Cap Table", icon: LayoutGrid },
    { href: "/app/marketplace", label: "Marketplace", icon: ShoppingCart },
  ],
  regulator: [
    { href: "/app/regulador/auditoria", label: "Auditoría", icon: ShieldCheck },
    { href: "/app/regulador/reportes", label: "Reportes", icon: FileText },
  ],
};

export function Sidebar() {
  const pathname = usePathname();
  const { role } = useUserRole();
  const { address, isConnected } = useAccount();
  const { dark } = useTheme();
  const nav = navByRole[role];

  return (
    <aside className="flex h-full w-52 shrink-0 flex-col border-r border-border bg-background">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 py-5">
        <img
          src={dark ? "/logo_night.png" : "/logo.png"}
          alt="ArkChain"
          className="h-6 w-6 object-contain"
          style={dark ? undefined : { mixBlendMode: "multiply" }}
        />
        <span className="text-sm font-semibold text-foreground tracking-tight">ArkChain</span>
      </div>

      {/* Profile switcher */}
      <div className="px-2.5 pb-3">
        <ProfileSwitcher />
      </div>

      <div className="h-px bg-border mx-3" />

      {/* Nav */}
      <nav className="flex-1 px-2 py-2.5 space-y-px">
        {nav.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm transition-colors",
                active
                  ? "bg-foreground text-background font-medium"
                  : "text-foreground-muted hover:bg-surface hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Wallet */}
      <div className="p-2.5 border-t border-border">
        <div className="flex items-center gap-2 rounded-lg px-3 py-2.5 bg-surface">
          <Wallet className="h-3.5 w-3.5 text-foreground-subtle shrink-0" />
          <div className="min-w-0">
            {isConnected && address ? (
              <>
                <p className="text-[10px] text-foreground-subtle leading-tight">Conectado</p>
                <p className="text-xs font-mono text-foreground truncate">{formatAddress(address)}</p>
              </>
            ) : (
              <p className="text-xs text-foreground-subtle">Sin wallet</p>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
