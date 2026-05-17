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

export default function LoginPage() {
  const { isConnected } = useAccount();
  const router = useRouter();

  useEffect(() => {
    if (isConnected) router.push("/app/portafolio");
  }, [isConnected, router]);

  return (
    <TooltipProvider>
      <div className="flex min-h-screen">
        {/* Left panel — off-white with brand quote */}
        <div className="hidden lg:flex lg:w-[55%] flex-col justify-between bg-surface p-12">
          <Link href="/" className="flex items-center gap-2.5">
            <img
              src="/logo.png"
              alt="ArkChain"
              className="h-7 w-7 object-contain"
              style={{ mixBlendMode: "multiply" }}
            />
            <span className="text-sm font-semibold text-foreground tracking-tight">ArkChain</span>
          </Link>

          <div>
            <div className="h-px w-12 bg-accent mb-8" />
            <blockquote className="font-display text-3xl font-semibold leading-snug text-foreground mb-5 max-w-sm">
              "El secundario que LATAM lleva 10 años esperando."
            </blockquote>
            <p className="font-mono text-xs text-foreground-subtle tracking-wide">
              — Equipo ArkChain, 2026
            </p>
          </div>

          <div className="flex items-center gap-2">
            <ShieldCheck className="h-3.5 w-3.5 text-foreground-subtle" />
            <span className="text-xs text-foreground-subtle">Construido sobre Avalanche Fuji Testnet</span>
          </div>
        </div>

        {/* Right panel — pure white form */}
        <div className="flex-1 flex flex-col items-center justify-center bg-background p-6">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2 mb-10">
            <img src="/logo.png" alt="ArkChain" className="h-7 w-7 object-contain" style={{ mixBlendMode: "multiply" }} />
            <span className="text-sm font-semibold text-foreground tracking-tight">ArkChain</span>
          </div>

          <div className="w-full max-w-[340px]">
            <div className="mb-8">
              <h1 className="text-xl font-semibold text-foreground mb-1.5">Entrar a ArkChain</h1>
              <p className="text-sm text-foreground-muted">Conecta tu wallet para continuar.</p>
            </div>

            <div className="space-y-2.5 mb-6">
              <ConnectButton.Custom>
                {({ openConnectModal }) => (
                  <button
                    onClick={openConnectModal}
                    className="w-full flex items-center justify-center gap-2 rounded-lg bg-foreground px-4 py-2.5 text-sm font-medium text-background hover:bg-primary-hover transition-colors"
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

            <div className="space-y-2.5 mb-6">
              <div>
                <Label htmlFor="email" className="text-xs text-foreground-muted mb-1.5 block">
                  Correo electrónico
                </Label>
                <Input id="email" type="email" placeholder="tu@empresa.com" />
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
