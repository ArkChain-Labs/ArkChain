"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { ShieldCheck, Info } from "lucide-react";
import Link from "next/link";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

const quotes = [
  "El secundario que LATAM lleva 10 años esperando.",
  "Privacidad institucional. Auditabilidad total.",
  "Compliance nativo, no como parche.",
];

export default function LoginPage() {
  const { isConnected } = useAccount();
  const router = useRouter();

  useEffect(() => {
    if (isConnected) router.push("/app/portafolio");
  }, [isConnected, router]);

  return (
    <TooltipProvider>
      <div className="flex min-h-screen">
        {/* Left panel */}
        <div className="hidden lg:flex lg:w-[60%] flex-col justify-between bg-primary p-12 relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.06]">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="absolute border border-primary-foreground"
                style={{
                  width: `${200 + i * 60}px`,
                  height: `${200 + i * 60}px`,
                  borderRadius: "50%",
                  top: "50%",
                  left: "40%",
                  transform: "translate(-50%, -50%)",
                }}
              />
            ))}
          </div>

          <Link href="/" className="flex items-center gap-2.5 relative z-10">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-accent-foreground font-display font-bold">
              A
            </div>
            <span className="font-display text-xl font-semibold text-primary-foreground">ArkChain</span>
          </Link>

          <div className="relative z-10">
            <blockquote className="font-display text-3xl font-semibold italic text-primary-foreground leading-snug mb-4 max-w-sm">
              "{quotes[0]}"
            </blockquote>
            <p className="font-mono text-sm text-primary-foreground/60">
              — Equipo ArkChain, 2026
            </p>
          </div>

          <div className="flex items-center gap-2 relative z-10">
            <ShieldCheck className="h-4 w-4 text-primary-foreground/40" />
            <span className="text-xs text-primary-foreground/40">
              Construido sobre Avalanche Fuji Testnet
            </span>
          </div>
        </div>

        {/* Right panel */}
        <div className="flex-1 flex items-center justify-center bg-background p-6">
          <div className="w-full max-w-sm">
            <div className="mb-8">
              <h1 className="font-display text-2xl font-semibold text-foreground mb-2">
                Entrar a ArkChain
              </h1>
              <p className="text-sm text-foreground-muted">
                Conecta tu wallet para continuar.
              </p>
            </div>

            <div className="space-y-3 mb-6">
              <ConnectButton.Custom>
                {({ openConnectModal }) => (
                  <button
                    onClick={openConnectModal}
                    className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary-hover transition-colors"
                  >
                    Conectar Core Wallet
                  </button>
                )}
              </ConnectButton.Custom>

              <ConnectButton.Custom>
                {({ openConnectModal }) => (
                  <button
                    onClick={openConnectModal}
                    className="w-full flex items-center justify-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-surface transition-colors"
                  >
                    Conectar MetaMask
                  </button>
                )}
              </ConnectButton.Custom>

              <ConnectButton.Custom>
                {({ openConnectModal }) => (
                  <button
                    onClick={openConnectModal}
                    className="w-full flex items-center justify-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-surface transition-colors"
                  >
                    Conectar WalletConnect
                  </button>
                )}
              </ConnectButton.Custom>
            </div>

            <div className="flex items-center gap-3 mb-6">
              <Separator className="flex-1" />
              <span className="text-xs text-foreground-subtle">o</span>
              <Separator className="flex-1" />
            </div>

            <div className="space-y-3 mb-6">
              <div>
                <Label htmlFor="email" className="text-xs text-foreground-muted mb-1.5 block">
                  Correo electrónico
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@empresa.com"
                  className="bg-surface border-border"
                />
              </div>
              <button className="w-full rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-surface transition-colors">
                Enviar enlace de acceso
              </button>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-foreground-subtle">
              <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
              <span>Plataforma regulada. KYC requerido para operar.</span>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-3.5 w-3.5 shrink-0 cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs text-xs">
                    ArkChain cumple con requisitos de Wavy Node para verificación
                    KYC/AML. Tu identidad se verifica antes del primer trade.
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>

            <div className="mt-8 text-center">
              <Link href="/" className="text-xs text-foreground-subtle hover:text-foreground transition-colors">
                ← Volver al inicio
              </Link>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
