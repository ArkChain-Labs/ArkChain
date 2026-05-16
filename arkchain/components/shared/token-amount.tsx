import { cn } from "@/lib/utils";
import { EncryptedValue } from "./encrypted-value";
import { formatTokens } from "@/lib/format";

interface Props {
  tokens: bigint;
  encrypted?: boolean;
  canReveal?: boolean;
  className?: string;
}

export function TokenAmount({
  tokens,
  encrypted = false,
  canReveal = true,
  className,
}: Props) {
  const formatted = `${formatTokens(tokens)} TKN`;

  if (encrypted) {
    return (
      <EncryptedValue value={formatted} canReveal={canReveal} className={className} />
    );
  }

  return (
    <span className={cn("font-mono tabular", className)}>{formatted}</span>
  );
}
