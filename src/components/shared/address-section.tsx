import { useState } from "react";
import { MapPin, Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormSection, Field } from "./form-section";
import { EmptyState } from "./states";
import { ConfirmDialog } from "./confirm-dialog";
import { TIPOS_ENDERECO, UFS, type Endereco, type TipoEndereco } from "@/data/mock-clientes";
import { maskCEP, isValidCEP } from "@/lib/masks";
import { newId } from "@/store/entity-store";

function emptyEndereco(): Endereco {
  return {
    id: newId("end"),
    tipo: "Entrega de mercadoria",
    cep: "",
    logradouro: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    uf: "SP",
  };
}

export function AddressCard({
  endereco,
  readOnly,
  onEdit,
  onRemove,
}: {
  endereco: Endereco;
  readOnly?: boolean;
  onEdit?: () => void;
  onRemove?: () => void;
}) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-md border bg-card p-4">
      <div className="min-w-0 space-y-0.5">
        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" /> {endereco.tipo}
        </div>
        <div className="truncate text-sm font-medium">
          {endereco.logradouro || "—"}
          {endereco.numero ? `, ${endereco.numero}` : ""}
          {endereco.complemento ? ` — ${endereco.complemento}` : ""}
        </div>
        <div className="text-sm text-muted-foreground">
          {[endereco.bairro, endereco.cidade].filter(Boolean).join(" · ")}
          {endereco.uf ? ` - ${endereco.uf}` : ""}
        </div>
        <div className="font-mono text-xs text-muted-foreground">{endereco.cep || "—"}</div>
      </div>
      {!readOnly && (
        <div className="flex shrink-0 gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onEdit} aria-label="Editar endereço">
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
            onClick={onRemove}
            aria-label="Excluir endereço"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      )}
    </div>
  );
}

export function AddressSection({
  enderecos,
  readOnly,
  onChange,
}: {
  enderecos: Endereco[];
  readOnly?: boolean;
  onChange: (v: Endereco[]) => void;
}) {
  const [draft, setDraft] = useState<Endereco | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [removeId, setRemoveId] = useState<string | null>(null);

  function openNew() {
    setDraft(emptyEndereco());
    setEditingId(null);
    setErrors({});
  }
  function openEdit(e: Endereco) {
    setDraft({ ...e });
    setEditingId(e.id);
    setErrors({});
  }
  function set<K extends keyof Endereco>(k: K, v: Endereco[K]) {
    setDraft((p) => (p ? { ...p, [k]: v } : p));
  }
  function confirm() {
    if (!draft) return;
    const errs: Record<string, string> = {};
    if (!draft.logradouro.trim()) errs.logradouro = "Informe o logradouro";
    if (!draft.cidade.trim()) errs.cidade = "Informe a cidade";
    if (draft.cep && !isValidCEP(draft.cep)) errs.cep = "CEP inválido";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    onChange(editingId ? enderecos.map((e) => (e.id === editingId ? draft : e)) : [...enderecos, draft]);
    setDraft(null);
  }

  return (
    <FormSection
      title="Endereços"
      description="Cadastre quantos endereços forem necessários."
      actions={
        !readOnly && (
          <Button size="sm" variant="outline" onClick={openNew}>
            <Plus className="mr-1.5 h-4 w-4" /> Adicionar endereço
          </Button>
        )
      }
    >
      {enderecos.length === 0 ? (
        <EmptyState compact title="Nenhum endereço cadastrado" description="Adicione o primeiro endereço." />
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {enderecos.map((e) => (
            <AddressCard
              key={e.id}
              endereco={e}
              readOnly={readOnly}
              onEdit={() => openEdit(e)}
              onRemove={() => setRemoveId(e.id)}
            />
          ))}
        </div>
      )}

      <Dialog open={!!draft} onOpenChange={(o) => !o && setDraft(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingId ? "Editar endereço" : "Novo endereço"}</DialogTitle>
          </DialogHeader>
          {draft && (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-6">
              <Field label="Tipo de endereço" className="sm:col-span-3">
                <Select value={draft.tipo} onValueChange={(v) => set("tipo", v as TipoEndereco)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {TIPOS_ENDERECO.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="CEP" className="sm:col-span-3" error={errors.cep}>
                <Input value={draft.cep} placeholder="00000-000" onChange={(e) => set("cep", maskCEP(e.target.value))} />
              </Field>
              <Field label="Logradouro" required className="sm:col-span-4" error={errors.logradouro}>
                <Input value={draft.logradouro} onChange={(e) => set("logradouro", e.target.value)} />
              </Field>
              <Field label="Número" className="sm:col-span-2">
                <Input value={draft.numero} onChange={(e) => set("numero", e.target.value)} />
              </Field>
              <Field label="Bairro" className="sm:col-span-3">
                <Input value={draft.bairro} onChange={(e) => set("bairro", e.target.value)} />
              </Field>
              <Field label="Cidade" required className="sm:col-span-2" error={errors.cidade}>
                <Input value={draft.cidade} onChange={(e) => set("cidade", e.target.value)} />
              </Field>
              <Field label="Estado (UF)" className="sm:col-span-1">
                <Select value={draft.uf} onValueChange={(v) => set("uf", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {UFS.map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Complemento" className="sm:col-span-6">
                <Input value={draft.complemento ?? ""} onChange={(e) => set("complemento", e.target.value)} />
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
        title="Excluir endereço?"
        description="Esta ação remove o endereço do cadastro."
        confirmLabel="Excluir"
        destructive
        onConfirm={() => {
          onChange(enderecos.filter((e) => e.id !== removeId));
          setRemoveId(null);
        }}
      />
    </FormSection>
  );
}
