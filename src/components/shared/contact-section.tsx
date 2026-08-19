import { useState } from "react";
import { Pencil, Plus, Trash2, User } from "lucide-react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormSection, Field } from "./form-section";
import { EmptyState } from "./states";
import { ConfirmDialog } from "./confirm-dialog";
import {
  OPERADORAS,
  TIPOS_CONTATO,
  type Contato,
  type TipoContato,
} from "@/data/mock-clientes";
import { isValidEmail, isValidTelefone, maskTelefone } from "@/lib/masks";
import { newId } from "@/store/entity-store";

function emptyContato(): Contato {
  return { id: newId("ct"), nome: "", setor: "", tipo: "Celular", descricao: "", operadora: "" };
}

export function ContactCard({
  contato,
  readOnly,
  onEdit,
  onRemove,
}: {
  contato: Contato;
  readOnly?: boolean;
  onEdit?: () => void;
  onRemove?: () => void;
}) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-md border bg-card p-4">
      <div className="min-w-0 space-y-1">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-muted-foreground" />
          <span className="truncate text-sm font-medium">{contato.nome || "—"}</span>
          <Badge variant="secondary" className="text-[10px]">{contato.tipo}</Badge>
        </div>
        <div className="text-xs text-muted-foreground">{contato.setor || "Sem setor definido"}</div>
        <div className="text-sm">{contato.descricao || "—"}</div>
        {contato.tipo === "Celular" && contato.operadora && (
          <div className="text-xs text-muted-foreground">Operadora: {contato.operadora}</div>
        )}
      </div>
      {!readOnly && (
        <div className="flex shrink-0 gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onEdit} aria-label="Editar contato">
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
            onClick={onRemove}
            aria-label="Excluir contato"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      )}
    </div>
  );
}

export function ContactSection({
  contatos,
  readOnly,
  onChange,
}: {
  contatos: Contato[];
  readOnly?: boolean;
  onChange: (v: Contato[]) => void;
}) {
  const [draft, setDraft] = useState<Contato | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [removeId, setRemoveId] = useState<string | null>(null);

  function set<K extends keyof Contato>(k: K, v: Contato[K]) {
    setDraft((p) => (p ? { ...p, [k]: v } : p));
  }

  function confirm() {
    if (!draft) return;
    const errs: Record<string, string> = {};
    if (!draft.nome.trim()) errs.nome = "Informe o nome do contato";
    if (!draft.descricao.trim()) errs.descricao = "Informe a descrição do contato";
    if (draft.tipo === "E-mail" && draft.descricao && !isValidEmail(draft.descricao))
      errs.descricao = "E-mail inválido";
    if ((draft.tipo === "Celular" || draft.tipo === "Telefone Fixo") && draft.descricao && !isValidTelefone(draft.descricao))
      errs.descricao = "Telefone inválido";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    onChange(editingId ? contatos.map((c) => (c.id === editingId ? draft : c)) : [...contatos, draft]);
    setDraft(null);
  }

  const isPhone = draft?.tipo === "Celular" || draft?.tipo === "Telefone Fixo";

  return (
    <FormSection
      title="Outros contatos"
      description="Pessoas relacionadas, com tipo de contato flexível."
      actions={
        !readOnly && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setDraft(emptyContato());
              setEditingId(null);
              setErrors({});
            }}
          >
            <Plus className="mr-1.5 h-4 w-4" /> Adicionar contato
          </Button>
        )
      }
    >
      {contatos.length === 0 ? (
        <EmptyState compact title="Nenhum contato cadastrado" description="Adicione o primeiro contato." />
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {contatos.map((c) => (
            <ContactCard
              key={c.id}
              contato={c}
              readOnly={readOnly}
              onEdit={() => {
                setDraft({ ...c });
                setEditingId(c.id);
                setErrors({});
              }}
              onRemove={() => setRemoveId(c.id)}
            />
          ))}
        </div>
      )}

      <Dialog open={!!draft} onOpenChange={(o) => !o && setDraft(null)}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>{editingId ? "Editar contato" : "Novo contato"}</DialogTitle>
          </DialogHeader>
          {draft && (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field label="Nome do contato" required error={errors.nome}>
                <Input value={draft.nome} onChange={(e) => set("nome", e.target.value)} />
              </Field>
              <Field label="Setor / Função">
                <Input value={draft.setor} onChange={(e) => set("setor", e.target.value)} />
              </Field>
              <Field label="Tipo de contato">
                <Select value={draft.tipo} onValueChange={(v) => set("tipo", v as TipoContato)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {TIPOS_CONTATO.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Descrição" required error={errors.descricao}>
                <Input
                  value={draft.descricao}
                  placeholder={draft.tipo === "E-mail" ? "nome@empresa.com.br" : isPhone ? "(00) 00000-0000" : "@usuario / identificador"}
                  onChange={(e) => set("descricao", isPhone ? maskTelefone(e.target.value) : e.target.value)}
                />
              </Field>
              {draft.tipo === "Celular" && (
                <Field label="Operadora">
                  <Select value={draft.operadora || ""} onValueChange={(v) => set("operadora", v)}>
                    <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent>
                      {OPERADORAS.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </Field>
              )}
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
        title="Excluir contato?"
        confirmLabel="Excluir"
        destructive
        onConfirm={() => {
          onChange(contatos.filter((c) => c.id !== removeId));
          setRemoveId(null);
        }}
      />
    </FormSection>
  );
}
