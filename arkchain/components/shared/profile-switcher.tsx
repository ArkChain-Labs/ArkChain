"use client";

import { useRouter } from "next/navigation";
import { ChevronDown, User, Building2, ShieldCheck } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUserRole } from "@/lib/store/user-role";
import { UserRole } from "@/lib/types";
import { cn } from "@/lib/utils";

const roles: { value: UserRole; label: string; sublabel: string; icon: React.ElementType; path: string }[] = [
  { value: "investor", label: "Inversionista", sublabel: "Vista personal", icon: User, path: "/app/portafolio" },
  { value: "issuer", label: "Emisor", sublabel: "FintechMX", icon: Building2, path: "/app/emisor/cap-table" },
  { value: "regulator", label: "Regulador", sublabel: "CNBV México", icon: ShieldCheck, path: "/app/regulador/auditoria" },
];

export function ProfileSwitcher() {
  const { role, setRole } = useUserRole();
  const router = useRouter();
  const current = roles.find((r) => r.value === role) ?? roles[0];
  const Icon = current.icon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-primary-hover/20 transition-colors outline-none">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary-foreground/15">
          <Icon className="h-3.5 w-3.5 text-primary-foreground" />
        </div>
        <div className="flex-1 min-w-0 text-left">
          <p className="font-medium text-primary-foreground text-xs leading-tight truncate">{current.label}</p>
          <p className="text-primary-foreground/60 text-[10px] leading-tight truncate">{current.sublabel}</p>
        </div>
        <ChevronDown className="h-3.5 w-3.5 text-primary-foreground/60 shrink-0" />
      </DropdownMenuTrigger>
      <DropdownMenuContent side="right" align="start" className="w-52 bg-surface-elevated border-border">
        {roles.map((r) => {
          const RIcon = r.icon;
          return (
            <DropdownMenuItem
              key={r.value}
              className={cn(
                "flex items-center gap-2.5 cursor-pointer",
                role === r.value && "bg-primary/5 font-medium"
              )}
              onClick={() => {
                setRole(r.value);
                router.push(r.path);
              }}
            >
              <RIcon className="h-4 w-4 text-foreground-muted" />
              <div>
                <p className="text-sm">{r.label}</p>
                <p className="text-xs text-foreground-subtle">{r.sublabel}</p>
              </div>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
