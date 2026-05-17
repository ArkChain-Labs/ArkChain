"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  ShoppingCart,
  LayoutGrid,
  ShieldCheck,
  FileText,
  Wallet,
} from "lucide-react";
import { useAccount } from "wagmi";
import { ProfileSwitcher } from "./profile-switcher";
import { useUserRole } from "@/lib/store/user-role";
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
  const nav = navByRole[role];

  return (
    <aside className="flex h-full w-60 shrink-0 flex-col bg-primary">
      {/* Logo */}
      <div className="flex items-center px-4 py-5">
        <img
          src="/logo-with-name.png"
          alt="ArkChain"
          className="h-7 w-auto"
          style={{ filter: "brightness(0) invert(1)", objectFit: "contain" }}
        />
      </div>

      {/* Profile switcher */}
      <div className="px-2 pb-3">
        <ProfileSwitcher />
      </div>

      <div className="mx-4 h-px bg-primary-foreground/10" />

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 space-y-0.5">
        {nav.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-primary-foreground/15 text-primary-foreground font-medium"
                  : "text-primary-foreground/70 hover:bg-primary-foreground/10 hover:text-primary-foreground"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Wallet indicator */}
      <div className="p-3 border-t border-primary-foreground/10">
        <div className="flex items-center gap-2 rounded-lg px-3 py-2 bg-primary-foreground/5">
          <Wallet className="h-3.5 w-3.5 text-primary-foreground/60 shrink-0" />
          <div className="min-w-0">
            {isConnected && address ? (
              <>
                <p className="text-[10px] text-primary-foreground/50 leading-tight">Conectado</p>
                <p className="text-xs font-mono text-primary-foreground/80 truncate">
                  {formatAddress(address)}
                </p>
              </>
            ) : (
              <p className="text-xs text-primary-foreground/50">Sin wallet conectada</p>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
