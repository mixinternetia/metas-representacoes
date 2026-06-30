import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  Save,
  X,
  Plus,
  Trash2,
  ArrowLeft,
  Pencil,
  Building2,
  Wallet,
  Users,
  UserSquare2,
  Handshake,
  MapPin,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { PageHeader } from "@/components/layout/page-header";
import {
  type Cliente,
  type Contato,
  type Endereco,
  type ReferenciaComercial,
  type Socio,
  UFS,
  VENDEDORES_LIST,
} from "@/data/mock-clientes";
import {
  maskCEP,
  maskCNPJ,
  maskCPF,
  maskTelefone,
  isValidCNPJ,
  isValidEmail,
} from "@/lib/masks";

export type FormMode = "novo" | "editar" | "visualizar";

interface Props {
  mode: FormMode;
  initial: Cliente;
}

function newId() {
  return `tmp-${Math.random().toString(36).slice(2, 9)}`;
}

export function ClienteForm({ mode, initial }: Props) {
  const navigate = useNavigate();
  const readOnly = mode === "visualizar";
  const [c, setC] = useState<Cliente>(initial);

  function update<K extends keyof Cliente>(key: K, value: Cliente[K]) {
    setC((prev) => ({ ...prev, [key]: value }));
  }

  function save() {
    if (!c.razaoSocial.trim()) return toast.error("Razão Social é obrigatória");
    if (!isValidCNPJ(c.cnpj)) return toast.error("CNPJ inválido");
    if (c.email && !isValidEmail(c.email)) return toast.error("E-mail inválido");
    toast.success(mode === "novo" ? "Cliente cadastrado com sucesso" : "Alterações salvas");
    navigate({ to: "/clientes" });
  }

  const title =
    mode === "novo" ? "Novo Cliente" : mode === "editar" ? "Editar Cliente" : c.razaoSocial;
  const description =
    mode === "novo"
      ? "Preencha os dados para cadastrar um novo cliente."
      : mode === "editar"
        ? "Atualize as informações do cliente."
        : "Visualização detalhada do cliente.";

  return (
    <div className="space-y-5">
      <PageHeader
        title={title}
        description={description}
        breadcrumbs={[
          { label: "Início", to: "/" },
          { label: "Clientes", to: "/clientes" },
          { label: mode === "novo" ? "Novo" : mode === "editar" ? "Editar" : "Visualizar" },
        ]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link to="/clientes"><ArrowLeft className="mr-1.5 h-4 w-4" />Voltar</Link>
            </Button>
            {mode === "visualizar" ? (
              <Button asChild>
                <Link to="/clientes/$id/editar" params={{ id: c.id }}>
                  <Pencil className="mr-1.5 h-4 w-4" />Editar
                </Link>
              </Button>
            ) : (
              <>
                <Button variant="outline" onClick={() => navigate({ to: "/clientes" })}>
                  <X className="mr-1.5 h-4 w-4" />Cancelar
                </Button>
                <Button onClick={save}>
                  <Save className="mr-1.5 h-4 w-4" />Salvar
                </Button>
              </>
            )}
          </div>
        }
      />

      <Tabs defaultValue="gerais" className="space-y-4">
        <Card className="p-1">
          <TabsList className="grid h-auto w-full grid-cols-2 gap-1 bg-transparent sm:grid-cols-3 lg:grid-cols-6">
            <TabsTrigger value="gerais" className="data-[state=active]:bg-accent">
              <Building2 className="mr-1.5 h-4 w-4" />Dados Gerais
            </TabsTrigger>
            <TabsTrigger value="financeiro" className="data-[state=active]:bg-accent">
              <Wallet className="mr-1.5 h-4 w-4" />Financeiro
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

        {/* DADOS GERAIS */}
        <TabsContent value="gerais" className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Identificação</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Field label="Código">
                <Input value={c.codigo} disabled />
              </Field>
              <Field label="Situação">
                <div className="flex h-9 items-center gap-2 rounded-md border border-input bg-background px-3">
                  <Switch
                    checked={c.situacao === "ativo"}
                    disabled={readOnly}
                    onCheckedChange={(v) => update("situacao", v ? "ativo" : "inativo")}
                  />
                  <Badge variant={c.situacao === "ativo" ? "default" : "secondary"}>
                    {c.situacao === "ativo" ? "Ativo" : "Inativo"}
                  </Badge>
                </div>
              </Field>
              <Field label="Vendedor">
                <Select value={c.vendedor} disabled={readOnly} onValueChange={(v) => update("vendedor", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {VENDEDORES_LIST.map((v) => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Razão Social" required className="lg:col-span-2">
                <Input value={c.razaoSocial} disabled={readOnly} onChange={(e) => update("razaoSocial", e.target.value)} />
              </Field>
              <Field label="Nome Fantasia">
                <Input value={c.nomeFantasia} disabled={readOnly} onChange={(e) => update("nomeFantasia", e.target.value)} />
              </Field>
              <Field label="CNPJ" required>
                <Input value={c.cnpj} disabled={readOnly} onChange={(e) => update("cnpj", maskCNPJ(e.target.value))} placeholder="00.000.000/0000-00" />
              </Field>
              <Field label="Inscrição Estadual">
                <Input value={c.ie} disabled={readOnly} onChange={(e) => update("ie", e.target.value)} />
              </Field>
              <Field label="Inscrição Municipal">
                <Input value={c.im ?? ""} disabled={readOnly} onChange={(e) => update("im", e.target.value)} />
              </Field>
              <Field label="E-mail">
                <Input type="email" value={c.email} disabled={readOnly} onChange={(e) => update("email", e.target.value)} />
              </Field>
              <Field label="E-mail Notas Fiscais">
                <Input type="email" value={c.emailNF ?? ""} disabled={readOnly} onChange={(e) => update("emailNF", e.target.value)} />
              </Field>
              <Field label="Telefone">
                <Input value={c.telefone} disabled={readOnly} onChange={(e) => update("telefone", maskTelefone(e.target.value))} />
              </Field>
              <Field label="Celular">
                <Input value={c.celular ?? ""} disabled={readOnly} onChange={(e) => update("celular", maskTelefone(e.target.value))} />
              </Field>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Observações</CardTitle></CardHeader>
            <CardContent>
              <Textarea
                value={c.observacoes ?? ""}
                disabled={readOnly}
                rows={4}
                placeholder="Anotações internas sobre o cliente..."
                onChange={(e) => update("observacoes", e.target.value)}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* FINANCEIRO */}
        <TabsContent value="financeiro" className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Condições comerciais</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <Field label="Limite de Crédito (R$)">
                <Input
                  type="number"
                  value={c.limiteCredito}
                  disabled={readOnly}
                  onChange={(e) => update("limiteCredito", Number(e.target.value))}
                />
              </Field>
              <Field label="Prazo de Pagamento">
                <Input value={c.prazoPagamento} disabled={readOnly} onChange={(e) => update("prazoPagamento", e.target.value)} />
              </Field>
              <Field label="Condição de Pagamento">
                <Select value={c.condicaoPagamento} disabled={readOnly} onValueChange={(v) => update("condicaoPagamento", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["Boleto", "PIX", "Depósito", "Cartão", "Dinheiro"].map((v) => (
                      <SelectItem key={v} value={v}>{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Dados bancários</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Field label="Banco">
                <Input value={c.dadosBancarios.banco} disabled={readOnly}
                  onChange={(e) => update("dadosBancarios", { ...c.dadosBancarios, banco: e.target.value })} />
              </Field>
              <Field label="Agência">
                <Input value={c.dadosBancarios.agencia} disabled={readOnly}
                  onChange={(e) => update("dadosBancarios", { ...c.dadosBancarios, agencia: e.target.value })} />
              </Field>
              <Field label="Conta">
                <Input value={c.dadosBancarios.conta} disabled={readOnly}
                  onChange={(e) => update("dadosBancarios", { ...c.dadosBancarios, conta: e.target.value })} />
              </Field>
              <Field label="Tipo">
                <Select
                  value={c.dadosBancarios.tipo}
                  disabled={readOnly}
                  onValueChange={(v) => update("dadosBancarios", { ...c.dadosBancarios, tipo: v as "Corrente" | "Poupança" })}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Corrente">Corrente</SelectItem>
                    <SelectItem value="Poupança">Poupança</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Chave PIX" className="lg:col-span-2">
                <Input value={c.dadosBancarios.pix ?? ""} disabled={readOnly}
                  onChange={(e) => update("dadosBancarios", { ...c.dadosBancarios, pix: e.target.value })} />
              </Field>
            </CardContent>
          </Card>
        </TabsContent>

        {/* CONTATOS */}
        <TabsContent value="contatos">
          <RepeaterCard
            title="Contatos"
            description="Cadastre quantos contatos forem necessários."
            readOnly={readOnly}
            items={c.contatos}
            onAdd={() => update("contatos", [...c.contatos, { id: newId(), nome: "", cargo: "", email: "", telefone: "" }])}
            onRemove={(i) => update("contatos", c.contatos.filter((_, idx) => idx !== i))}
            renderItem={(item, i) => (
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                <Field label="Nome">
                  <Input value={item.nome} disabled={readOnly}
                    onChange={(e) => updateAt<Contato>(c.contatos, i, "nome", e.target.value, (v) => update("contatos", v))} />
                </Field>
                <Field label="Cargo">
                  <Input value={item.cargo} disabled={readOnly}
                    onChange={(e) => updateAt<Contato>(c.contatos, i, "cargo", e.target.value, (v) => update("contatos", v))} />
                </Field>
                <Field label="E-mail">
                  <Input type="email" value={item.email} disabled={readOnly}
                    onChange={(e) => updateAt<Contato>(c.contatos, i, "email", e.target.value, (v) => update("contatos", v))} />
                </Field>
                <Field label="Telefone">
                  <Input value={item.telefone} disabled={readOnly}
                    onChange={(e) => updateAt<Contato>(c.contatos, i, "telefone", maskTelefone(e.target.value), (v) => update("contatos", v))} />
                </Field>
                <Field label="Celular">
                  <Input value={item.celular ?? ""} disabled={readOnly}
                    onChange={(e) => updateAt<Contato>(c.contatos, i, "celular", maskTelefone(e.target.value), (v) => update("contatos", v))} />
                </Field>
              </div>
            )}
          />
        </TabsContent>

        {/* SÓCIOS */}
        <TabsContent value="socios">
          <RepeaterCard
            title="Sócios"
            description="Quadro societário."
            readOnly={readOnly}
            items={c.socios}
            onAdd={() => update("socios", [...c.socios, { id: newId(), nome: "", cpf: "", participacao: 0, cargo: "" }])}
            onRemove={(i) => update("socios", c.socios.filter((_, idx) => idx !== i))}
            renderItem={(item, i) => (
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
                <Field label="Nome" className="lg:col-span-2">
                  <Input value={item.nome} disabled={readOnly}
                    onChange={(e) => updateAt<Socio>(c.socios, i, "nome", e.target.value, (v) => update("socios", v))} />
                </Field>
                <Field label="CPF">
                  <Input value={item.cpf} disabled={readOnly}
                    onChange={(e) => updateAt<Socio>(c.socios, i, "cpf", maskCPF(e.target.value), (v) => update("socios", v))} />
                </Field>
                <Field label="Participação (%)">
                  <Input type="number" min={0} max={100} value={item.participacao} disabled={readOnly}
                    onChange={(e) => updateAt<Socio>(c.socios, i, "participacao", Number(e.target.value), (v) => update("socios", v))} />
                </Field>
                <Field label="Cargo" className="lg:col-span-2">
                  <Input value={item.cargo} disabled={readOnly}
                    onChange={(e) => updateAt<Socio>(c.socios, i, "cargo", e.target.value, (v) => update("socios", v))} />
                </Field>
              </div>
            )}
          />
        </TabsContent>

        {/* REFERÊNCIAS */}
        <TabsContent value="referencias">
          <RepeaterCard
            title="Referências Comerciais"
            description="Empresas que podem servir de referência."
            readOnly={readOnly}
            items={c.referencias}
            onAdd={() => update("referencias", [...c.referencias, { id: newId(), empresa: "", contato: "", telefone: "" }])}
            onRemove={(i) => update("referencias", c.referencias.filter((_, idx) => idx !== i))}
            renderItem={(item, i) => (
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                <Field label="Empresa">
                  <Input value={item.empresa} disabled={readOnly}
                    onChange={(e) => updateAt<ReferenciaComercial>(c.referencias, i, "empresa", e.target.value, (v) => update("referencias", v))} />
                </Field>
                <Field label="Contato">
                  <Input value={item.contato} disabled={readOnly}
                    onChange={(e) => updateAt<ReferenciaComercial>(c.referencias, i, "contato", e.target.value, (v) => update("referencias", v))} />
                </Field>
                <Field label="Telefone">
                  <Input value={item.telefone} disabled={readOnly}
                    onChange={(e) => updateAt<ReferenciaComercial>(c.referencias, i, "telefone", maskTelefone(e.target.value), (v) => update("referencias", v))} />
                </Field>
                <Field label="Observações" className="md:col-span-2 lg:col-span-3">
                  <Textarea rows={2} value={item.observacoes ?? ""} disabled={readOnly}
                    onChange={(e) => updateAt<ReferenciaComercial>(c.referencias, i, "observacoes", e.target.value, (v) => update("referencias", v))} />
                </Field>
              </div>
            )}
          />
        </TabsContent>

        {/* ENDEREÇOS */}
        <TabsContent value="enderecos">
          <RepeaterCard
            title="Endereços"
            description="Múltiplos endereços tipificados (Comercial, Cobrança, Entrega, etc.)."
            readOnly={readOnly}
            items={c.enderecos}
            onAdd={() =>
              update("enderecos", [
                ...c.enderecos,
                { id: newId(), tipo: "Comercial", cep: "", logradouro: "", numero: "", bairro: "", cidade: "", uf: "SP" },
              ])
            }
            onRemove={(i) => update("enderecos", c.enderecos.filter((_, idx) => idx !== i))}
            renderItem={(item, i) => (
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-6">
                <Field label="Tipo" className="lg:col-span-1">
                  <Select
                    value={item.tipo}
                    disabled={readOnly}
                    onValueChange={(v) => updateAt<Endereco>(c.enderecos, i, "tipo", v as Endereco["tipo"], (val) => update("enderecos", val))}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["Comercial", "Cobrança", "Entrega", "Residencial"].map((t) => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="CEP" className="lg:col-span-1">
                  <Input value={item.cep} disabled={readOnly}
                    onChange={(e) => updateAt<Endereco>(c.enderecos, i, "cep", maskCEP(e.target.value), (v) => update("enderecos", v))} />
                </Field>
                <Field label="Logradouro" className="lg:col-span-3">
                  <Input value={item.logradouro} disabled={readOnly}
                    onChange={(e) => updateAt<Endereco>(c.enderecos, i, "logradouro", e.target.value, (v) => update("enderecos", v))} />
                </Field>
                <Field label="Número" className="lg:col-span-1">
                  <Input value={item.numero} disabled={readOnly}
                    onChange={(e) => updateAt<Endereco>(c.enderecos, i, "numero", e.target.value, (v) => update("enderecos", v))} />
                </Field>
                <Field label="Complemento" className="lg:col-span-2">
                  <Input value={item.complemento ?? ""} disabled={readOnly}
                    onChange={(e) => updateAt<Endereco>(c.enderecos, i, "complemento", e.target.value, (v) => update("enderecos", v))} />
                </Field>
                <Field label="Bairro" className="lg:col-span-2">
                  <Input value={item.bairro} disabled={readOnly}
                    onChange={(e) => updateAt<Endereco>(c.enderecos, i, "bairro", e.target.value, (v) => update("enderecos", v))} />
                </Field>
                <Field label="Cidade" className="lg:col-span-1">
                  <Input value={item.cidade} disabled={readOnly}
                    onChange={(e) => updateAt<Endereco>(c.enderecos, i, "cidade", e.target.value, (v) => update("enderecos", v))} />
                </Field>
                <Field label="UF" className="lg:col-span-1">
                  <Select
                    value={item.uf}
                    disabled={readOnly}
                    onValueChange={(v) => updateAt<Endereco>(c.enderecos, i, "uf", v, (val) => update("enderecos", val))}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {UFS.map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </Field>
              </div>
            )}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function updateAt<T>(arr: T[], index: number, key: keyof T, value: T[keyof T], setter: (v: T[]) => void) {
  setter(arr.map((item, i) => (i === index ? { ...item, [key]: value } : item)));
}

function Field({
  label,
  required,
  className,
  children,
}: {
  label: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`space-y-1.5 ${className ?? ""}`}>
      <Label className="text-xs font-medium text-muted-foreground">
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      {children}
    </div>
  );
}

interface RepeaterProps<T> {
  title: string;
  description?: string;
  items: T[];
  readOnly: boolean;
  onAdd: () => void;
  onRemove: (index: number) => void;
  renderItem: (item: T, index: number) => React.ReactNode;
}

function RepeaterCard<T>({ title, description, items, readOnly, onAdd, onRemove, renderItem }: RepeaterProps<T>) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0">
        <div className="min-w-0">
          <CardTitle className="text-base">{title}</CardTitle>
          {description && <p className="mt-1 text-xs text-muted-foreground">{description}</p>}
        </div>
        {!readOnly && (
          <Button size="sm" variant="outline" onClick={onAdd}>
            <Plus className="mr-1.5 h-4 w-4" /> Adicionar
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        {items.length === 0 ? (
          <div className="rounded-md border border-dashed p-8 text-center text-sm text-muted-foreground">
            Nenhum item adicionado.
          </div>
        ) : (
          items.map((item, i) => (
            <div key={i} className="relative rounded-md border bg-card p-4">
              {!readOnly && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-2 h-7 w-7 text-muted-foreground hover:text-destructive"
                  onClick={() => onRemove(i)}
                  aria-label="Remover"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              )}
              {renderItem(item, i)}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
