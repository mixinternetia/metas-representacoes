import type { ReactNode } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EmptyState } from "./states";

export interface Column<T> {
  key: string;
  header: string;
  className?: string;
  cell: (row: T) => ReactNode;
}

interface DataTableProps<T extends { id: string }> {
  rows: T[];
  columns: Column<T>[];
  loading?: boolean;
  selected: string[];
  onSelectedChange: (ids: string[]) => void;
  rowActions?: (row: T) => ReactNode;
  emptyTitle?: string;
  emptyDescription?: string;
  page: number;
  perPage: number;
  total: number;
  onPageChange: (p: number) => void;
  onPerPageChange: (p: number) => void;
}

export function DataTable<T extends { id: string }>({
  rows,
  columns,
  loading,
  selected,
  onSelectedChange,
  rowActions,
  emptyTitle = "Nenhum registro encontrado",
  emptyDescription = "Ajuste os filtros ou tente outra busca.",
  page,
  perPage,
  total,
  onPageChange,
  onPerPageChange,
}: DataTableProps<T>) {
  const colCount = columns.length + 1 + (rowActions ? 1 : 0);
  const allChecked = rows.length > 0 && rows.every((r) => selected.includes(r.id));
  const someChecked = rows.some((r) => selected.includes(r.id));
  const totalPages = Math.max(1, Math.ceil(total / perPage));

  function toggleAll(v: boolean) {
    const ids = rows.map((r) => r.id);
    onSelectedChange(
      v ? Array.from(new Set([...selected, ...ids])) : selected.filter((id) => !ids.includes(id)),
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40">
              <TableHead className="w-10">
                <Checkbox
                  checked={allChecked ? true : someChecked ? "indeterminate" : false}
                  onCheckedChange={(v) => toggleAll(!!v)}
                  aria-label="Selecionar todos"
                />
              </TableHead>
              {columns.map((c) => (
                <TableHead key={c.key} className={c.className}>
                  {c.header}
                </TableHead>
              ))}
              {rowActions && <TableHead className="w-28 text-right">Ações</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={colCount}>
                    <div className="h-6 w-full animate-pulse rounded bg-muted" />
                  </TableCell>
                </TableRow>
              ))
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={colCount}>
                  <EmptyState icon={<Search className="h-8 w-8" />} title={emptyTitle} description={emptyDescription} />
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <TableRow key={row.id} className="hover:bg-muted/30">
                  <TableCell>
                    <Checkbox
                      checked={selected.includes(row.id)}
                      onCheckedChange={(v) =>
                        onSelectedChange(v ? [...selected, row.id] : selected.filter((id) => id !== row.id))
                      }
                      aria-label="Selecionar linha"
                    />
                  </TableCell>
                  {columns.map((c) => (
                    <TableCell key={c.key} className={c.className}>
                      {c.cell(row)}
                    </TableCell>
                  ))}
                  {rowActions && <TableCell className="text-right">{rowActions(row)}</TableCell>}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t bg-muted/20 px-3 py-2 text-xs text-muted-foreground">
        <div>
          {total} registro(s) · {selected.length} selecionado(s)
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span>Linhas</span>
            <Select value={String(perPage)} onValueChange={(v) => { onPerPageChange(Number(v)); onPageChange(1); }}>
              <SelectTrigger className="h-8 w-[70px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                {[10, 25, 50, 100].map((n) => (
                  <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={page <= 1}
              onClick={() => onPageChange(page - 1)}
              aria-label="Página anterior"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="px-1">
              {page} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={page >= totalPages}
              onClick={() => onPageChange(page + 1)}
              aria-label="Próxima página"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
