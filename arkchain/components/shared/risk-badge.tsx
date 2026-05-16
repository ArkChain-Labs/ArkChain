import { cn } from "@/lib/utils";

interface Props {
  score: number;
  className?: string;
}

export function RiskBadge({ score, className }: Props) {
  const tone =
    score >= 80 ? "success" : score >= 60 ? "warning" : "danger";
  const label = score >= 80 ? "Alto" : score >= 60 ? "Medio" : "Bajo";

  const styles = {
    success: "bg-success/10 text-success border-success/20",
    warning: "bg-warning/15 text-warning border-warning/20",
    danger: "bg-danger/10 text-danger border-danger/20",
  }[tone];

  return (
    <span
      className={cn(
        "relative group inline-flex items-center rounded-sm border px-2 py-0.5 text-xs font-mono tabular cursor-help",
        styles,
        className
      )}
    >
      Score {score}

      {/* Hover tooltip */}
      <span
        className="pointer-events-none invisible group-hover:visible absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 rounded-md shadow-lg z-50 text-[10px] leading-relaxed"
        style={{ background: "var(--color-foreground)", color: "var(--color-background)" }}
      >
        <span className="block px-2.5 pt-2 pb-1 font-semibold border-b border-white/10">
          Wavy Risk Score — {label}
        </span>
        <span className="block px-2.5 py-1.5 space-y-0.5">
          <span className="block">{score}/100 · Umbral mínimo: 60</span>
          {score >= 60 ? (
            <>
              <span className="block" style={{ color: "#86efac" }}>✓ KYC verificado</span>
              <span className="block" style={{ color: "#86efac" }}>✓ Sin alertas AML</span>
              <span className="block" style={{ color: "#86efac" }}>✓ Habilitado para operar</span>
            </>
          ) : (
            <>
              <span className="block" style={{ color: "#f87171" }}>✗ Actividad inusual</span>
              <span className="block" style={{ color: "#f87171" }}>✗ Score inferior al umbral</span>
              <span className="block opacity-70">Requiere revisión manual</span>
            </>
          )}
        </span>
        {/* Tooltip arrow */}
        <span
          className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent"
          style={{ borderTopColor: "var(--color-foreground)" }}
        />
      </span>
    </span>
  );
}
