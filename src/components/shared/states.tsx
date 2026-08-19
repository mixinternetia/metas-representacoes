import type { ReactNode } from "react";
import { Inbox, Loader2 } from "lucide-react";

export function EmptyState({
  title,
  description,
  icon,
  action,
  compact,
}: {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  compact?: boolean;
}) {
  return (
    <div
      className={`mx-auto flex max-w-sm flex-col items-center gap-2 text-center text-muted-foreground ${
        compact ? "py-8" : "py-16"
      }`}
    >
      {icon ?? <Inbox className="h-8 w-8" />}
      <div className="text-sm font-medium text-foreground">{title}</div>
      {description && <div className="text-xs">{description}</div>}
      {action && <div className="pt-2">{action}</div>}
    </div>
  );
}

export function LoadingState({ label = "Carregando..." }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
      <Loader2 className="h-4 w-4 animate-spin" /> {label}
    </div>
  );
}

export function SkeletonRows({ rows = 6 }: { rows?: number }) {
  return (
    <div className="space-y-2 p-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-8 w-full animate-pulse rounded bg-muted" />
      ))}
    </div>
  );
}
