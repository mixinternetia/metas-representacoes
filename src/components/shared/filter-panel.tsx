import type { ReactNode } from "react";
import { Filter, Search, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function SearchInput({
  value,
  onChange,
  placeholder = "Busca rápida...",
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className={`relative ${className ?? ""}`}>
      <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-9 pl-8"
      />
    </div>
  );
}

export function FilterPanel({
  children,
  onSearch,
  onClear,
}: {
  children: ReactNode;
  onSearch: () => void;
  onClear: () => void;
}) {
  return (
    <Card>
      <CardContent className="space-y-3 p-4">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Filter className="h-4 w-4" /> Filtros
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">{children}</div>
        <div className="flex flex-wrap justify-end gap-2 pt-1">
          <Button variant="ghost" size="sm" onClick={onClear}>
            <X className="mr-1.5 h-4 w-4" /> Limpar filtros
          </Button>
          <Button size="sm" onClick={onSearch}>
            <Search className="mr-1.5 h-4 w-4" /> Pesquisar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function ActionToolbar({ children }: { children: ReactNode }) {
  return (
    <Card>
      <CardContent className="flex flex-wrap items-center gap-2 p-3">{children}</CardContent>
    </Card>
  );
}
