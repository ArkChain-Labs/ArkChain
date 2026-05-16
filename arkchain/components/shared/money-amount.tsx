import { cn } from "@/lib/utils";
import { formatMXN } from "@/lib/format";

interface Props {
  amount: number;
  currency?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function MoneyAmount({
  amount,
  currency = "MXN",
  className,
  size = "md",
}: Props) {
  const sizes = { sm: "text-sm", md: "text-base", lg: "text-2xl" };
  const formatted = formatMXN(amount);

  return (
    <span
      className={cn(
        "font-mono tabular",
        sizes[size],
        className
      )}
    >
      {formatted}
    </span>
  );
}
