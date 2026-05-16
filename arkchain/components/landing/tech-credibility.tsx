const techs = ["Avalanche L1", "eERC20", "ICM (Interchain Messaging)", "Wavy Node Compliance"];

export function TechCredibility() {
  return (
    <section className="py-12 px-6 border-b border-border">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
          <p className="text-xs font-medium text-foreground-subtle tracking-widest uppercase">
            Construido sobre
          </p>
          {techs.map((t) => (
            <div
              key={t}
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground-muted opacity-70 hover:opacity-100 transition-opacity"
            >
              {t}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
