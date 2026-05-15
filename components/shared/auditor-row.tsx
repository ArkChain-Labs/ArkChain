import { cn } from "@/lib/utils";

interface Props {
  children: React.ReactNode;
  className?: string;
  highlighted?: boolean;
}

export function AuditorRow({ children, className, highlighted = false }: Props) {
  return (
    <tr
      className={cn(
        "border-l-2 border-accent bg-accent/[0.03] hover:bg-accent/[0.06] transition-colors",
        highlighted && "border-danger bg-danger/5 hover:bg-danger/8",
        className
      )}
    >
      {children}
    </tr>
  );
}
