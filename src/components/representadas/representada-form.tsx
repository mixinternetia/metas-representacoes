import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Building2, Loader2, MapPin, Save, SaveAll, Users, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/layout/page-header";
import { Field, FormSection } from "@/components/shared/form-section";
import { StatusBadge } from "@/components/shared/status-badge";
import { AddressSection } from "@/components/shared/address-section";
import { ContactSection } from "@/components/shared/contact-section";
import { UFS } from "@/data/mock-clientes";
import type { Representada } from "@/data/mock-representadas";
import { representadasStore } from "@/store/representadas-store";
import { newId } from "@/store/entity-store";
import {
  formatDate,
  isValidCNPJ,
  isValidEmail,
  isValidTelefone,
  maskCNPJ,
  maskTelefone,
} from "@/lib/masks";

export function RepresentadaForm({
  mode,
  initial,
}: {
  mode: "novo" | "editar";
  initial: Representada;
}) {
  const navigate = useNavigate();
  const [r, setR] = useState<Representada>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState("gerais");

  function update<K extends keyof Representada>(key: K, value: Representada[K]) {
    setR((prev) => ({ ...prev, [key]: value }));
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!r.nome.trim()) e.nome = "Informe a razão social";
    if (!r.nomeFantasia.trim()) e.nomeFantasia = "Informe o nome fantasia";
    if (!isValidCNPJ(r.cnpj)) e.cnpj = "CNPJ inválido — informe 14 dígitos";
    if (!r.email.trim()) e.email = "Informe o e-mail principal";
    else if (!isValidEmail(r.email)) e.email = "E-mail inválido";
    if (r.telefone && !isValidTelefone(r.telefone)) e.telefone = "Telefone inválido";
    if (r.celular && !isValidTelefone(r.celular)) e.celular = "Celular inválido";
    if (r.comissaoPadrao < 0 || r.comissaoPadrao > 100) e.comissaoPadrao = "Informe um valor entre 0 e 100";
    if (!r.cidade.trim()) e.cidade = "Informe a cidade";
    setErrors(e);
    return e;
  }

  function save(continuar: boolean) {
    const e = validate();
    if (Object.keys(e).length > 0) {
      setTab("gerais");
      toast.error("Verifique os campos destacados antes de salvar.");
      return;
    }
    setSaving(true);
    setTimeout(() => {
      const now = new Date().toISOString();
      if (mode === "novo") {
        const criada: Representada = {
          ...r,
          id: newId("rep"),
          codigo: representadasStore.nextCodigo(),
          criadoEm: now,
          atualizadoEm: now,
        };
        representadasStore.add(criada);
        setSaving(false);
        toast.success("Representada cadastrada com sucesso.");
        if (continuar) {
          setR(criada);
          navigate({ to: "/representadas/$id/editar", params: { id: criada.id } });
        } else {
          navigate({ to: "/representadas" });
        }
      } else {
        const atualizada: Representada = { ...r, atualizadoEm: now };
        representadasStore.update(atualizada);
        setR(atualizada);
        setSaving(false);
        toast.success("Representada atualizada com sucesso.");
        if (!continuar) navigate({ to: "/representadas" });
      }
    }, 600);
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title={mode === "novo" ? "Nova Representada" : "Editar Representada"}
        breadcrumbs={[
          { label: "Dashboard", to: "/" },
          { label: "Representadas", to: "/representadas" },
          { label: mode === "novo" ? "Nova" : "Editar" },
        ]}
        actions={
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => navigate({ to: "/representadas" })}>
              <X className="mr-1.5 h-4 w-4" /> Cancelar
            </Button>
            <Button variant="outline" onClick={() => save(true)} disabled={saving}>
              <SaveAll className="mr-1.5 h-4 w-4" /> Salvar e continuar
            </Button>
            <Button onClick={() => save(false)} disabled={saving}>
              {saving ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <Save className="mr-1.5 h-4 w-4" />}
              Salvar
            </Button>
          </div>
        }
      />

      <Card className="flex flex-wrap items-center gap-x-8 gap-y-2 p-4 text-sm">
        <div>
          <span className="text-xs text-muted-foreground">Código</span>
          <div className="font-mono font-medium">{r.codigo}</div>
        </div>
        <div>
          <span className="text-xs text-muted-foreground">Situação</span>
          <div className="pt-0.5"><StatusBadge situacao={r.situacao} /></div>
        </div>
        <div>
          <span className="text-xs text-muted-foreground">Data de cadastro</span>
          <div className="font-medium">{formatDate(r.criadoEm)}</div>
        </div>
        <div>
          <span className="text-xs text-muted-foreground">Última alteração</span>
          <div className="font-medium">{formatDate(r.atualizadoEm)}</div>
        </div>
      </Card>

      <Tabs value={tab} onValueChange={setTab} className="space-y-4">
        <Card className="p-1">
          <TabsList className="grid h-auto w-full grid-cols-3 gap-1 bg-transparent">
            <TabsTrigger value="gerais" className="data-[state=active]:bg-accent">
              <Building2 className="mr-1.5 h-4 w-4" />Dados Gerais
            </TabsTrigger>
            <TabsTrigger value="contatos" className="data-[state=active]:bg-accent">
              <Users className="mr-1.5 h-4 w-4" />Contatos
            </TabsTrigger>
            <TabsTrigger value="enderecos" className="data-[state=active]:bg-accent">
              <MapPin className="mr-1.5 h-4 w-4" />Endereços
            </TabsTrigger>
          </TabsList>
        </Card>

        <TabsContent value="gerais" className="space-y-4">
          <FormSection title="Identificação">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Field label="Código" hint="Gerado automaticamente pelo sistema">
                <Input value={r.codigo} disabled readOnly />
              </Field>
              <Field label="Situação">
                <div className="flex h-9 items-center gap-2 rounded-md border border-input bg-background px-3">
                  <Switch
                    checked={r.situacao === "ativo"}
                    onCheckedChange={(v) => update("situacao", v ? "ativo" : "inativo")}
                    aria-label="Situação"
                  />
                  <StatusBadge situacao={r.situacao} />
                </div>
              </Field>
              <Field label="Comissão padrão (%)" error={errors.comissaoPadrao}>
                <Input
                  type="number"
                  min={0}
                  max={100}
                  step={0.5}
                  value={r.comissaoPadrao}
                  onChange={(e) => update("comissaoPadrao", Number(e.target.value))}
                />
              </Field>
              <Field label="Razão Social" required error={errors.nome}>
                <Input value={r.nome} onChange={(e) => update("nome", e.target.value)} />
              </Field>
              <Field label="Nome Fantasia" required error={errors.nomeFantasia}>
                <Input value={r.nomeFantasia} onChange={(e) => update("nomeFantasia", e.target.value)} />
              </Field>
              <Field label="CNPJ" required error={errors.cnpj}>
                <Input
                  value={r.cnpj}
                  onChange={(e) => update("cnpj", maskCNPJ(e.target.value))}
                  placeholder="00.000.000/0000-00"
                />
              </Field>
              <Field label="Inscrição Estadual">
                <Input value={r.ie} onChange={(e) => update("ie", e.target.value)} />
              </Field>
              <Field label="Inscrição Municipal">
                <Input value={r.im ?? ""} onChange={(e) => update("im", e.target.value)} />
              </Field>
            </div>
          </FormSection>

          <FormSection title="Contato e localização">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Field label="E-mail" required error={errors.email}>
                <Input value={r.email} onChange={(e) => update("email", e.target.value)} />
              </Field>
              <Field label="Telefone Fixo" error={errors.telefone}>
                <Input value={r.telefone} onChange={(e) => update("telefone", maskTelefone(e.target.value))} />
              </Field>
              <Field label="Celular" error={errors.celular}>
                <Input value={r.celular ?? ""} onChange={(e) => update("celular", maskTelefone(e.target.value))} />
              </Field>
              <Field label="Cidade" required error={errors.cidade}>
                <Input value={r.cidade} onChange={(e) => update("cidade", e.target.value)} />
              </Field>
              <Field label="Estado (UF)">
                <Select value={r.uf} onValueChange={(v) => update("uf", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {UFS.map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                  </SelectContent>
                </Select>
              </Field>
            </div>
          </FormSection>

          <FormSection title="Observações">
            <Textarea
              rows={4}
              value={r.observacoes ?? ""}
              onChange={(e) => update("observacoes", e.target.value)}
              placeholder="Informações complementares sobre a representada..."
            />
          </FormSection>
        </TabsContent>

        <TabsContent value="contatos">
          <ContactSection contatos={r.contatos} onChange={(v) => update("contatos", v)} />
        </TabsContent>

        <TabsContent value="enderecos">
          <AddressSection enderecos={r.enderecos} onChange={(v) => update("enderecos", v)} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
