import { cn } from "@/lib/utils";

interface Props {
  score: number;
  className?: string;
}

export function RiskBadge({ score, className }: Props) {
  const tone =
    score >= 80 ? "success" : score >= 60 ? "warning" : "danger";

  const styles = {
    success: "bg-success/10 text-success border-success/20",
    warning: "bg-warning/15 text-warning border-warning/20",
    danger: "bg-danger/10 text-danger border-danger/20",
  }[tone];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm border px-2 py-0.5 text-xs font-mono tabular",
        styles,
        className
      )}
    >
      Score {score}
    </span>
  );
}
