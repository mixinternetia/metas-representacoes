import type { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";

export interface DsSectionDef {
  id: string;
  label: string;
}

export function DsSection({
  id,
  title,
  description,
  children,
}: {
  id: string;
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 space-y-4 border-t pt-8 first:border-t-0 first:pt-0">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      {children}
    </section>
  );
}

export function DsBlock({
  title,
  hint,
  children,
  className,
}: {
  title?: string;
  hint?: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <Card className={className}>
      <CardContent className="space-y-3 p-4">
        {title && (
          <div className="space-y-0.5">
            <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{title}</div>
            {hint && <div className="text-xs text-muted-foreground">{hint}</div>}
          </div>
        )}
        {children}
      </CardContent>
    </Card>
  );
}

export function DsGrid({ children, cols = 2 }: { children: ReactNode; cols?: 2 | 3 | 4 }) {
  const map = {
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-2 lg:grid-cols-3",
    4: "sm:grid-cols-2 lg:grid-cols-4",
  } as const;
  return <div className={`grid grid-cols-1 gap-3 ${map[cols]}`}>{children}</div>;
}

export function DsSpecs({ items }: { items: [string, string][] }) {
  return (
    <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs sm:grid-cols-3">
      {items.map(([k, v]) => (
        <div key={k} className="flex min-w-0 justify-between gap-2 border-b border-dashed py-1">
          <dt className="text-muted-foreground">{k}</dt>
          <dd className="truncate font-medium tabular-nums">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

export function DsCode({ children }: { children: ReactNode }) {
  return (
    <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[11px] text-foreground">{children}</code>
  );
}
