"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useTheme } from "@/lib/store/theme";
import { Hero } from "@/components/landing/hero";
import { ProblemSection } from "@/components/landing/problem-section";
import { ThreeViews } from "@/components/landing/three-views";
import { HowItWorks } from "@/components/landing/how-it-works";
import { ExpansionMap } from "@/components/landing/expansion-map";
import { StatsStrip } from "@/components/landing/stats-strip";
import { TechCredibility } from "@/components/landing/tech-credibility";
import { FinalCta } from "@/components/landing/final-cta";

function LandingNav() {
  const [scrolled, setScrolled] = useState(false);
  const { dark } = useTheme();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-200 ${
        scrolled ? "bg-background/95 backdrop-blur-sm border-b border-border" : "bg-transparent"
      }`}
    >
      <div className="max-w-5xl mx-auto flex h-14 items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <img
            src={dark ? "/logo_night.png" : "/logo.png"}
            alt="ArkChain"
            className="h-6 w-6 object-contain"
            style={dark ? undefined : { mixBlendMode: "multiply" }}
          />
          <span className="text-sm font-semibold text-foreground tracking-tight">ArkChain</span>
        </Link>

        <nav className="hidden md:flex items-center gap-5 text-[13px] text-foreground-subtle">
          <Link href="#como-funciona" className="hover:text-foreground transition-colors">Plataforma</Link>
          <Link href="#como-funciona" className="hover:text-foreground transition-colors">Para emisores</Link>
          <Link href="#como-funciona" className="hover:text-foreground transition-colors">Para reguladores</Link>
          <Link href="#como-funciona" className="hover:text-foreground transition-colors">Recursos</Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/login" className="text-[13px] text-foreground-subtle hover:text-foreground transition-colors px-3 py-1.5">
            Entrar
          </Link>
          <Link
            href="/login"
            className="rounded-lg bg-foreground px-4 py-1.5 text-[13px] font-medium text-background hover:bg-primary-hover transition-colors"
          >
            Solicitar acceso
          </Link>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  const { dark } = useTheme();
  return (
    <footer className="border-t border-border py-10 px-6">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <img
            src={dark ? "/logo_night.png" : "/logo.png"}
            alt="ArkChain"
            className="h-5 w-5 object-contain"
            style={dark ? undefined : { mixBlendMode: "multiply" }}
          />
          <span className="text-sm font-semibold text-foreground tracking-tight">ArkChain</span>
          <span className="text-foreground-subtle text-xs ml-2">
            Infraestructura on-chain para equity crowdfunding regulado en LATAM.
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-5 text-xs text-foreground-subtle">
          {["Términos de uso", "Privacidad", "Compliance", "CNBV-1437"].map((l) => (
            <span key={l} className="hover:text-foreground transition-colors cursor-pointer">{l}</span>
          ))}
        </div>
      </div>
      <div className="max-w-5xl mx-auto mt-8 pt-6 border-t border-border flex items-center justify-between">
        <p className="text-xs text-foreground-subtle">© 2026 ArkChain. Todos los derechos reservados.</p>
        <button className="text-xs text-foreground-subtle hover:text-foreground transition-colors flex items-center gap-1">
          México (ES) <span>▾</span>
        </button>
      </div>
    </footer>
  );
}

export default function LandingPage() {
  return (
    <>
      <LandingNav />
      <main className="pt-14">
        <Hero />
        <StatsStrip />
        <ProblemSection />
        <ThreeViews />
        <HowItWorks />
        <ExpansionMap />
        <TechCredibility />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
