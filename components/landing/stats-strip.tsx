const stats = [
  { value: "USD 23B", label: "Mercado privado ilíquido LATAM" },
  { value: "6", label: "Jurisdicciones soportadas" },
  { value: "< 2s", label: "Finality en Avalanche L1" },
  { value: "100%", label: "Auditable end-to-end" },
];

export function StatsStrip() {
  return (
    <section className="py-16 px-6 border-t border-b border-border">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map(({ value, label }) => (
            <div key={label} className="text-center md:text-left">
              <p className="font-mono text-4xl font-bold text-foreground tabular mb-1">
                {value}
              </p>
              <p className="text-xs text-foreground-subtle leading-snug">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
