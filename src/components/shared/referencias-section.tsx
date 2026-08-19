import { useMemo, useState } from "react";
import { Handshake, Plus, Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FormSection } from "./form-section";
import { EmptyState } from "./states";
import { StatusBadge } from "./status-badge";
import type { ReferenciaComercial } from "@/data/mock-clientes";
import { MOCK_REFERENCIAS } from "@/data/mock-referencias";

/** Seletor genérico de entidade a partir de um cadastro existente. */
export function EntitySelector({
  open,
  onOpenChange,
  title,
  description,
  options,
  onSelect,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title: string;
  description?: string;
  options: ReferenciaComercial[];
  onSelect: (item: ReferenciaComercial) => void;
}) {
  const [q, setQ] = useState("");
  const filtered = useMemo(
    () => options.filter((o) => o.nome.toLowerCase().includes(q.trim().toLowerCase())),
    [options, q],
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Pesquisar por nome..." className="pl-8" />
        </div>
        <div className="max-h-80 overflow-y-auto rounded-md border">
          {filtered.length === 0 ? (
            <EmptyState compact title="Nenhum registro encontrado" />
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead>Nome</TableHead>
                  <TableHead className="w-40">Telefone</TableHead>
                  <TableHead className="w-24">Situação</TableHead>
                  <TableHead className="w-24 text-right">Ação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((o) => (
                  <TableRow key={o.id}>
                    <TableCell className="font-medium">{o.nome}</TableCell>
                    <TableCell className="font-mono text-xs">{o.telefone}</TableCell>
                    <TableCell><StatusBadge situacao={o.situacao} /></TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="outline" onClick={() => onSelect(o)}>
                        Adicionar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function ReferenciasSection({
  referencias,
  readOnly,
  onChange,
}: {
  referencias: ReferenciaComercial[];
  readOnly?: boolean;
  onChange: (v: ReferenciaComercial[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const disponiveis = MOCK_REFERENCIAS.filter((r) => !referencias.some((x) => x.id === r.id));

  return (
    <FormSection
      title="Referências comerciais"
      description="Vinculadas a partir do cadastro de Referências Comerciais do sistema."
      actions={
        !readOnly && (
          <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
            <Plus className="mr-1.5 h-4 w-4" /> Adicionar referência
          </Button>
        )
      }
    >
      {referencias.length === 0 ? (
        <EmptyState
          compact
          icon={<Handshake className="h-8 w-8" />}
          title="Nenhuma referência vinculada"
          description="Busque no cadastro de referências comerciais e vincule ao cliente."
        />
      ) : (
        <div className="overflow-x-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead>Nome</TableHead>
                <TableHead className="w-40">Telefone</TableHead>
                <TableHead className="w-24">Situação</TableHead>
                {!readOnly && <TableHead className="w-20 text-right">Ações</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {referencias.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.nome}</TableCell>
                  <TableCell className="font-mono text-xs">{r.telefone}</TableCell>
                  <TableCell><StatusBadge situacao={r.situacao} /></TableCell>
                  {!readOnly && (
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        aria-label={`Remover ${r.nome}`}
                        onClick={() => onChange(referencias.filter((x) => x.id !== r.id))}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <EntitySelector
        open={open}
        onOpenChange={setOpen}
        title="Referências comerciais"
        description="Pesquise e selecione uma referência já cadastrada no sistema."
        options={disponiveis}
        onSelect={(item) => {
          onChange([...referencias, item]);
          setOpen(false);
        }}
      />
    </FormSection>
  );
}
