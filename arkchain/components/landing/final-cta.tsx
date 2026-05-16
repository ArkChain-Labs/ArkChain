import Link from "next/link";

export function FinalCta() {
  return (
    <section className="py-24 px-6 bg-primary">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="font-display text-3xl md:text-4xl font-semibold text-primary-foreground mb-4">
          Construido para reguladores.
          <br />
          Diseñado para escalar.
        </h2>
        <p className="text-primary-foreground/70 mb-8 leading-relaxed">
          ArkChain conecta las plataformas de equity crowdfunding más importantes de
          LATAM en una infraestructura on-chain privada, auditable y lista para
          cumplimiento regulatorio.
        </p>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-medium text-accent-foreground hover:bg-accent-hover transition-colors"
        >
          Hablar con el equipo
        </Link>
      </div>
    </section>
  );
}
