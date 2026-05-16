"use client";

import { Lock, LockOpen } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface Props {
  value: string;
  canReveal?: boolean;
  hidden?: boolean;
  className?: string;
}

export function EncryptedValue({
  value,
  canReveal = true,
  hidden: initialHidden = true,
  className,
}: Props) {
  const [hidden, setHidden] = useState(initialHidden);

  if (!canReveal) {
    return (
      <span className={cn("font-mono tabular text-encrypted", className)}>
        ••••
      </span>
    );
  }

  return (
    <button
      onClick={() => setHidden((h) => !h)}
      className={cn(
        "font-mono tabular inline-flex items-center gap-1.5 underline decoration-dotted decoration-foreground-subtle underline-offset-4 hover:decoration-accent transition-colors",
        className
      )}
    >
      {hidden ? "••••" : value}
      {hidden ? (
        <Lock className="h-3 w-3 text-foreground-subtle" />
      ) : (
        <LockOpen className="h-3 w-3 text-accent" />
      )}
    </button>
  );
}
