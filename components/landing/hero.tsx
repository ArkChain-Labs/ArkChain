import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="pt-32 pb-24 px-6 max-w-5xl mx-auto">
      <div className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/8 px-3 py-1 text-xs font-medium text-accent tracking-widest mb-8 uppercase">
        Infraestructura institucional · LATAM
      </div>

      <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-semibold text-foreground leading-[1.05] tracking-tight mb-6 max-w-3xl">
        Liquidez{" "}
        <em className="not-italic italic text-primary">privada</em> para el
        equity privado de LATAM.
      </h1>

      <p className="text-lg text-foreground-muted max-w-2xl mb-10 leading-relaxed">
        ArkChain es el primer mercado secundario regulado, confidencial y
        auditable para plataformas de equity crowdfunding en México, Brasil,
        Argentina, Colombia, Chile y Perú. Construido sobre Avalanche.
      </p>

      <div className="flex flex-wrap gap-3 mb-12">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary-hover transition-colors"
        >
          Solicitar piloto
        </Link>
        <Link
          href="#como-funciona"
          className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-foreground hover:bg-surface transition-colors"
        >
          Ver demo
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-foreground-subtle">
        {["CNBV", "CVM", "CNV", "SFC", "CMF", "SMV"].map((reg) => (
          <span key={reg} className="flex items-center gap-1.5">
            <span className="h-1 w-1 rounded-full bg-success inline-block" />
            Compatible con {reg}
          </span>
        ))}
      </div>
    </section>
  );
}
