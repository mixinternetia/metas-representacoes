import { useState } from "react";
import { Pencil, Plus, Trash2, UserSquare2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FormSection, Field } from "./form-section";
import { EmptyState } from "./states";
import { ConfirmDialog } from "./confirm-dialog";
import type { Socio } from "@/data/mock-clientes";
import { formatDate, isValidCPF, maskCPF } from "@/lib/masks";
import { newId } from "@/store/entity-store";

export function PersonCard({
  socio,
  readOnly,
  onEdit,
  onRemove,
}: {
  socio: Socio;
  readOnly?: boolean;
  onEdit?: () => void;
  onRemove?: () => void;
}) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-md border bg-card p-4">
      <div className="min-w-0 space-y-1">
        <div className="flex items-center gap-2">
          <UserSquare2 className="h-4 w-4 text-muted-foreground" />
          <span className="truncate text-sm font-medium">{socio.nome || "—"}</span>
          <Badge variant="secondary" className="text-[10px]">
            {socio.participacao.toFixed(2).replace(".", ",")}%
          </Badge>
        </div>
        <div className="font-mono text-xs text-muted-foreground">{socio.cpf || "—"}</div>
        <div className="text-xs text-muted-foreground">Nascimento: {formatDate(socio.dataNascimento)}</div>
      </div>
      {!readOnly && (
        <div className="flex shrink-0 gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onEdit} aria-label="Editar sócio">
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
            onClick={onRemove}
            aria-label="Excluir sócio"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      )}
    </div>
  );
}

export function SociosSection({
  socios,
  readOnly,
  onChange,
}: {
  socios: Socio[];
  readOnly?: boolean;
  onChange: (v: Socio[]) => void;
}) {
  const [draft, setDraft] = useState<Socio | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [removeId, setRemoveId] = useState<string | null>(null);

  const total = socios.reduce((s, x) => s + (Number(x.participacao) || 0), 0);

  function set<K extends keyof Socio>(k: K, v: Socio[K]) {
    setDraft((p) => (p ? { ...p, [k]: v } : p));
  }
  function confirm() {
    if (!draft) return;
    const errs: Record<string, string> = {};
    if (!draft.nome.trim()) errs.nome = "Informe o nome do sócio";
    if (!isValidCPF(draft.cpf)) errs.cpf = "CPF inválido";
    if (draft.participacao < 0 || draft.participacao > 100) errs.participacao = "Informe entre 0 e 100";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    onChange(editingId ? socios.map((s) => (s.id === editingId ? draft : s)) : [...socios, draft]);
    setDraft(null);
  }

  return (
    <FormSection
      title="Sócios"
      description="Quadro societário do cliente."
      actions={
        !readOnly && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setDraft({ id: newId("soc"), nome: "", cpf: "", dataNascimento: "", participacao: 0 });
              setEditingId(null);
              setErrors({});
            }}
          >
            <Plus className="mr-1.5 h-4 w-4" /> Adicionar sócio
          </Button>
        )
      }
    >
      <div className="space-y-3">
        {socios.length === 0 ? (
          <EmptyState compact title="Nenhum sócio cadastrado" description="Adicione o primeiro sócio." />
        ) : (
          <>
            <div className="grid gap-3 md:grid-cols-2">
              {socios.map((s) => (
                <PersonCard
                  key={s.id}
                  socio={s}
                  readOnly={readOnly}
                  onEdit={() => {
                    setDraft({ ...s });
                    setEditingId(s.id);
                    setErrors({});
                  }}
                  onRemove={() => setRemoveId(s.id)}
                />
              ))}
            </div>
            <div
              className={`rounded-md border px-3 py-2 text-xs ${
                Math.abs(total - 100) < 0.01
                  ? "border-success/30 bg-success/10 text-success"
                  : "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400"
              }`}
            >
              Soma das participações: {total.toFixed(2).replace(".", ",")}%
              {Math.abs(total - 100) < 0.01 ? " — total correto." : " — o ideal é totalizar 100%."}
            </div>
          </>
        )}
      </div>

      <Dialog open={!!draft} onOpenChange={(o) => !o && setDraft(null)}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>{editingId ? "Editar sócio" : "Novo sócio"}</DialogTitle>
          </DialogHeader>
          {draft && (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field label="Nome do sócio" required className="sm:col-span-2" error={errors.nome}>
                <Input value={draft.nome} onChange={(e) => set("nome", e.target.value)} />
              </Field>
              <Field label="CPF" required error={errors.cpf}>
                <Input value={draft.cpf} placeholder="000.000.000-00" onChange={(e) => set("cpf", maskCPF(e.target.value))} />
              </Field>
              <Field label="Data de nascimento">
                <Input type="date" value={draft.dataNascimento} onChange={(e) => set("dataNascimento", e.target.value)} />
              </Field>
              <Field label="Participação na empresa (%)" error={errors.participacao}>
                <Input
                  type="number"
                  min={0}
                  max={100}
                  step="0.01"
                  value={draft.participacao}
                  onChange={(e) => set("participacao", Number(e.target.value))}
                />
              </Field>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDraft(null)}>Cancelar</Button>
            <Button onClick={confirm}>{editingId ? "Salvar alterações" : "Adicionar"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!removeId}
        onOpenChange={(o) => !o && setRemoveId(null)}
        title="Excluir sócio?"
        confirmLabel="Excluir"
        destructive
        onConfirm={() => {
          onChange(socios.filter((s) => s.id !== removeId));
          setRemoveId(null);
        }}
      />
    </FormSection>
  );
}
