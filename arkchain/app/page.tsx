"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Hero } from "@/components/landing/hero";
import { ProblemSection } from "@/components/landing/problem-section";
import { ThreeViews } from "@/components/landing/three-views";
import { HowItWorks } from "@/components/landing/how-it-works";
import { ExpansionMap } from "@/components/landing/expansion-map";
import { StatsStrip } from "@/components/landing/stats-strip";
import { TechCredibility } from "@/components/landing/tech-credibility";
import { FinalCta } from "@/components/landing/final-cta";

function LandingNav() {
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const handler = () => setSolid(window.scrollY > 24);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        solid
          ? "bg-surface/95 backdrop-blur-md border-b border-border shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-5xl mx-auto flex h-16 items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <img
            src="/logo-with-name.png"
            alt="ArkChain"
            className="h-7 w-auto"
            style={{ objectFit: "contain" }}
          />
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm text-foreground-muted">
          <Link href="#como-funciona" className="hover:text-foreground transition-colors py-1">Plataforma</Link>
          <Link href="#como-funciona" className="hover:text-foreground transition-colors py-1">Para emisores</Link>
          <Link href="#como-funciona" className="hover:text-foreground transition-colors py-1">Para reguladores</Link>
          <Link href="#como-funciona" className="hover:text-foreground transition-colors py-1">Recursos</Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="text-sm text-foreground-muted hover:text-foreground transition-colors px-3 py-1.5"
          >
            Entrar
          </Link>
          <Link
            href="/login"
            className="rounded-lg bg-accent px-4 py-1.5 text-sm font-semibold text-accent-foreground hover:bg-accent-hover transition-colors shadow-sm"
          >
            Solicitar acceso
          </Link>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border bg-surface py-12 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img
                src="/logo-with-name.png"
                alt="ArkChain"
                className="h-6 w-auto"
                style={{ objectFit: "contain" }}
              />
            </div>
            <p className="text-xs text-foreground-subtle leading-relaxed">
              Infraestructura on-chain para equity crowdfunding regulado en LATAM.
            </p>
          </div>
          {[
            { title: "Producto", links: ["Plataforma", "Marketplace", "Auditoría", "Reportes"] },
            { title: "Compañía", links: ["Sobre nosotros", "Blog", "Contacto", "Careers"] },
            { title: "Legal", links: ["Términos de uso", "Privacidad", "Compliance", "CNBV-1437"] },
          ].map(({ title, links }) => (
            <div key={title}>
              <p className="text-xs font-semibold text-foreground mb-3 uppercase tracking-wider">{title}</p>
              <ul className="space-y-2">
                {links.map((l) => (
                  <li key={l}>
                    <span className="text-xs text-foreground-subtle hover:text-foreground transition-colors cursor-pointer">{l}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between border-t border-border pt-6">
          <p className="text-xs text-foreground-subtle">© 2026 ArkChain. Todos los derechos reservados.</p>
          <button className="text-xs text-foreground-subtle flex items-center gap-1 hover:text-foreground transition-colors">
            México (ES) <span className="ml-1">▾</span>
          </button>
        </div>
      </div>
    </footer>
  );
}

export default function LandingPage() {
  return (
    <>
      <LandingNav />
      <main className="pt-16">
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
