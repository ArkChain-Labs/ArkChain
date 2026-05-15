import { LatamMap } from "@/components/shared/latam-map";

export function ExpansionMap() {
  return (
    <section className="py-20 px-6 bg-surface border-t border-border">
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-xs font-medium tracking-widest text-foreground-subtle uppercase mb-3">
              Expansión regional
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-4">
              Una infraestructura, seis jurisdicciones.
            </h2>
            <p className="text-foreground-muted mb-8 leading-relaxed">
              ArkChain conecta plataformas reguladas de toda LATAM en un único
              ledger on-chain. Cada jurisdicción opera con su propio regulador y
              stablecoin local, pero comparte la misma infraestructura de
              compliance y liquidez.
            </p>
            <div className="space-y-2">
              {[
                { country: "México", reg: "CNBV", platform: "Arkangeles", coin: "MXNB" },
                { country: "Brasil", reg: "CVM", platform: "BEE4", coin: "BRZ" },
                { country: "Colombia", reg: "SFC", platform: "a2censo", coin: "COPW" },
              ].map(({ country, reg, platform, coin }) => (
                <div key={country} className="flex items-center justify-between text-sm border border-border rounded-lg px-3 py-2 bg-surface-elevated">
                  <span className="font-medium text-foreground">{country}</span>
                  <span className="text-foreground-subtle">{reg}</span>
                  <span className="text-foreground-subtle">{platform}</span>
                  <span className="font-mono text-accent text-xs">{coin}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-center">
            <LatamMap />
          </div>
        </div>
      </div>
    </section>
  );
}
