import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  ArrowLeft,
  Building2,
  Handshake,
  Loader2,
  MapPin,
  Save,
  SaveAll,
  UserSquare2,
  Users,
  Wallet,
  X,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/layout/page-header";
import { FormSection, Field } from "@/components/shared/form-section";
import { StatusBadge } from "@/components/shared/status-badge";
import { AddressSection } from "@/components/shared/address-section";
import { ContactSection } from "@/components/shared/contact-section";
import { SociosSection } from "@/components/shared/socios-section";
import { ReferenciasSection } from "@/components/shared/referencias-section";
import { VendedorSelector } from "@/components/shared/vendedor-selector";
import type { Cliente } from "@/data/mock-clientes";
import { clientesStore } from "@/store/clientes-store";
import { newId } from "@/store/entity-store";
import {
  formatDate,
  isValidCNPJ,
  isValidEmail,
  isValidTelefone,
  maskCNPJ,
  maskTelefone,
} from "@/lib/masks";

export type FormMode = "novo" | "editar";

export function ClienteForm({ mode, initial }: { mode: FormMode; initial: Cliente }) {
  const navigate = useNavigate();
  const [c, setC] = useState<Cliente>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState("gerais");

  function update<K extends keyof Cliente>(key: K, value: Cliente[K]) {
    setC((prev) => ({ ...prev, [key]: value }));
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!c.razaoSocial.trim()) e.razaoSocial = "Informe a razão social";
    if (!c.nomeFantasia.trim()) e.nomeFantasia = "Informe o nome fantasia";
    if (!isValidCNPJ(c.cnpj)) e.cnpj = "CNPJ inválido — informe 14 dígitos";
    if (!c.email.trim()) e.email = "Informe o e-mail principal";
    else if (!isValidEmail(c.email)) e.email = "E-mail inválido";
    if (c.emailDanfe && !isValidEmail(c.emailDanfe)) e.emailDanfe = "E-mail inválido";
    if (c.emailCopia && !isValidEmail(c.emailCopia)) e.emailCopia = "E-mail inválido";
    if (c.telefone && !isValidTelefone(c.telefone)) e.telefone = "Telefone inválido";
    if (c.celular && !isValidTelefone(c.celular)) e.celular = "Celular inválido";
    if (!c.vendedor) e.vendedor = "Selecione o vendedor responsável";
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
        const criado: Cliente = {
          ...c,
          id: newId("cli"),
          codigo: clientesStore.nextCodigo(),
          criadoEm: now,
          atualizadoEm: now,
        };
        clientesStore.add(criado);
        setSaving(false);
        toast.success("Cliente cadastrado com sucesso.");
        if (continuar) {
          setC(criado);
          navigate({ to: "/clientes/$id/editar", params: { id: criado.id } });
        } else {
          navigate({ to: "/clientes" });
        }
      } else {
        const atualizado: Cliente = { ...c, atualizadoEm: now };
        clientesStore.update(atualizado);
        setC(atualizado);
        setSaving(false);
        toast.success("Cliente atualizado com sucesso.");
        if (!continuar) navigate({ to: "/clientes" });
      }
    }, 600);
  }

  const title = mode === "novo" ? "Novo Cliente" : "Editar Cliente";

  return (
    <div className="space-y-5">
      <PageHeader
        title={title}
        breadcrumbs={[
          { label: "Dashboard", to: "/" },
          { label: "Clientes", to: "/clientes" },
          { label: mode === "novo" ? "Novo Cliente" : "Editar" },
        ]}
        actions={
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => navigate({ to: "/clientes" })}>
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
          <div className="font-mono font-medium">{c.codigo}</div>
        </div>
        <div>
          <span className="text-xs text-muted-foreground">Situação</span>
          <div className="pt-0.5"><StatusBadge situacao={c.situacao} /></div>
        </div>
        <div>
          <span className="text-xs text-muted-foreground">Data de cadastro</span>
          <div className="font-medium">{formatDate(c.criadoEm)}</div>
        </div>
        <div>
          <span className="text-xs text-muted-foreground">Última alteração</span>
          <div className="font-medium">{formatDate(c.atualizadoEm)}</div>
        </div>
      </Card>

      <Tabs value={tab} onValueChange={setTab} className="space-y-4">
        <Card className="p-1">
          <TabsList className="grid h-auto w-full grid-cols-2 gap-1 bg-transparent sm:grid-cols-3 lg:grid-cols-6">
            <TabsTrigger value="gerais" className="data-[state=active]:bg-accent">
              <Building2 className="mr-1.5 h-4 w-4" />Dados Gerais
            </TabsTrigger>
            <TabsTrigger value="financeiro" className="data-[state=active]:bg-accent">
              <Wallet className="mr-1.5 h-4 w-4" />Financeiras
            </TabsTrigger>
            <TabsTrigger value="contatos" className="data-[state=active]:bg-accent">
              <Users className="mr-1.5 h-4 w-4" />Contatos
            </TabsTrigger>
            <TabsTrigger value="socios" className="data-[state=active]:bg-accent">
              <UserSquare2 className="mr-1.5 h-4 w-4" />Sócios
            </TabsTrigger>
            <TabsTrigger value="referencias" className="data-[state=active]:bg-accent">
              <Handshake className="mr-1.5 h-4 w-4" />Referências
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
                <Input value={c.codigo} disabled readOnly />
              </Field>
              <Field label="Situação do cliente">
                <div className="flex h-9 items-center gap-2 rounded-md border border-input bg-background px-3">
                  <Switch
                    checked={c.situacao === "ativo"}
                    onCheckedChange={(v) => update("situacao", v ? "ativo" : "inativo")}
                    aria-label="Situação"
                  />
                  <StatusBadge situacao={c.situacao} />
                </div>
              </Field>
              <Field label="Vendedor" required error={errors.vendedor}>
                <VendedorSelector value={c.vendedor} onChange={(v) => update("vendedor", v)} />
              </Field>
              <Field label="Razão Social" required className="lg:col-span-2" error={errors.razaoSocial}>
                <Input value={c.razaoSocial} onChange={(e) => update("razaoSocial", e.target.value)} />
              </Field>
              <Field label="Nome Fantasia" required error={errors.nomeFantasia}>
                <Input value={c.nomeFantasia} onChange={(e) => update("nomeFantasia", e.target.value)} />
              </Field>
              <Field label="CNPJ" required error={errors.cnpj}>
                <Input
                  value={c.cnpj}
                  placeholder="00.000.000/0000-00"
                  onChange={(e) => update("cnpj", maskCNPJ(e.target.value))}
                />
              </Field>
              <Field label="Inscrição Estadual">
                <Input value={c.ie} onChange={(e) => update("ie", e.target.value)} />
              </Field>
              <Field label="Inscrição Municipal">
                <Input value={c.im ?? ""} onChange={(e) => update("im", e.target.value)} />
              </Field>
            </div>
          </FormSection>

          <FormSection title="Contato principal">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Field label="E-mail" required error={errors.email}>
                <Input type="email" value={c.email} onChange={(e) => update("email", e.target.value)} />
              </Field>
              <Field label="E-mail para DANFe" error={errors.emailDanfe}>
                <Input type="email" value={c.emailDanfe ?? ""} onChange={(e) => update("emailDanfe", e.target.value)} />
              </Field>
              <Field label="E-mail Cópia" error={errors.emailCopia}>
                <Input type="email" value={c.emailCopia ?? ""} onChange={(e) => update("emailCopia", e.target.value)} />
              </Field>
              <Field label="Telefone Fixo" error={errors.telefone}>
                <Input
                  value={c.telefone}
                  placeholder="(00) 0000-0000"
                  onChange={(e) => update("telefone", maskTelefone(e.target.value))}
                />
              </Field>
              <Field label="Celular" error={errors.celular}>
                <Input
                  value={c.celular ?? ""}
                  placeholder="(00) 00000-0000"
                  onChange={(e) => update("celular", maskTelefone(e.target.value))}
                />
              </Field>
              <Field label="Cidade">
                <Input value={c.cidade} onChange={(e) => update("cidade", e.target.value)} />
              </Field>
            </div>
          </FormSection>

          <FormSection title="Observações e registro">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="md:col-span-3">
                <Field label="Observações">
                  <Textarea
                    rows={4}
                    value={c.observacoes ?? ""}
                    placeholder="Anotações internas sobre o cliente..."
                    onChange={(e) => update("observacoes", e.target.value)}
                  />
                </Field>
              </div>
              <Field label="Cadastro">
                <Input value={formatDate(c.criadoEm)} disabled readOnly />
              </Field>
              <Field label="Última alteração">
                <Input value={formatDate(c.atualizadoEm)} disabled readOnly />
              </Field>
            </div>
          </FormSection>
        </TabsContent>

        <TabsContent value="financeiro">
          <FormSection title="Informações financeiras" description="Dados bancários do cliente.">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Field label="Nome do Banco">
                <Input
                  value={c.dadosBancarios.banco}
                  onChange={(e) => update("dadosBancarios", { ...c.dadosBancarios, banco: e.target.value })}
                />
              </Field>
              <Field label="Número da Agência">
                <Input
                  value={c.dadosBancarios.agencia}
                  onChange={(e) => update("dadosBancarios", { ...c.dadosBancarios, agencia: e.target.value })}
                />
              </Field>
              <Field label="Número da Conta">
                <Input
                  value={c.dadosBancarios.conta}
                  onChange={(e) => update("dadosBancarios", { ...c.dadosBancarios, conta: e.target.value })}
                />
              </Field>
              <Field label="Nome do Correntista" className="lg:col-span-2">
                <Input
                  value={c.dadosBancarios.correntista}
                  onChange={(e) => update("dadosBancarios", { ...c.dadosBancarios, correntista: e.target.value })}
                />
              </Field>
              <Field label="Telefone do Correntista">
                <Input
                  value={c.dadosBancarios.telefoneCorrentista}
                  placeholder="(00) 00000-0000"
                  onChange={(e) =>
                    update("dadosBancarios", {
                      ...c.dadosBancarios,
                      telefoneCorrentista: maskTelefone(e.target.value),
                    })
                  }
                />
              </Field>
            </div>
          </FormSection>
        </TabsContent>

        <TabsContent value="contatos">
          <ContactSection contatos={c.contatos} onChange={(v) => update("contatos", v)} />
        </TabsContent>

        <TabsContent value="socios">
          <SociosSection socios={c.socios} onChange={(v) => update("socios", v)} />
        </TabsContent>

        <TabsContent value="referencias">
          <ReferenciasSection referencias={c.referencias} onChange={(v) => update("referencias", v)} />
        </TabsContent>

        <TabsContent value="enderecos">
          <AddressSection enderecos={c.enderecos} onChange={(v) => update("enderecos", v)} />
        </TabsContent>
      </Tabs>

      <div className="flex justify-start">
        <Button variant="ghost" asChild>
          <Link to="/clientes"><ArrowLeft className="mr-1.5 h-4 w-4" />Voltar para a lista</Link>
        </Button>
      </div>
    </div>
  );
}
