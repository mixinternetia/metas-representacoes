import { useState } from "react";
import { toast } from "sonner";
import {
  AlertCircle,
  ArrowUpDown,
  CheckCircle2,
  ChevronRight,
  Download,
  Eye,
  Info,
  Loader2,
  Mail,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Trash2,
  TriangleAlert,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Field, FormSection, ReadField } from "@/components/shared/form-section";
import { ActionToolbar, FilterPanel, SearchInput } from "@/components/shared/filter-panel";
import { DataTable, type Column } from "@/components/shared/data-table";
import { SummaryCard, SummaryCards } from "@/components/shared/summary-card";
import { EmptyState, LoadingState, SkeletonRows } from "@/components/shared/states";
import { StatusBadge } from "@/components/shared/status-badge";
import { DsBlock, DsGrid, DsSection, DsSpecs } from "./ds-primitives";

/* ---------------------------- Botões ---------------------------- */

export function DsButtons() {
  return (
    <DsSection
      id="botoes"
      title="7. Botões"
      description="Um botão primário por tela/bloco. Ações secundárias usam outline ou ghost; ações destrutivas sempre pedem confirmação."
    >
      <DsGrid cols={2}>
        <DsBlock title="Variantes">
          <div className="flex flex-wrap gap-2">
            <Button>Salvar</Button>
            <Button variant="secondary">Cancelar</Button>
            <Button variant="outline">
              <Eye /> Visualizar
            </Button>
            <Button variant="ghost">
              <MoreHorizontal /> Mais opções
            </Button>
            <Button variant="destructive">
              <Trash2 /> Excluir
            </Button>
            <Button className="bg-success text-success-foreground hover:bg-success/90">
              <CheckCircle2 /> Aprovar
            </Button>
          </div>
        </DsBlock>
        <DsBlock title="Estados">
          <div className="flex flex-wrap items-center gap-2">
            <Button>Normal</Button>
            <Button className="bg-primary/90">Hover</Button>
            <Button className="bg-primary/80 ring-1 ring-ring">Active</Button>
            <Button disabled>Disabled</Button>
            <Button disabled>
              <Loader2 className="animate-spin" /> Salvando...
            </Button>
          </div>
        </DsBlock>
        <DsBlock title="Tamanhos e ícones">
          <div className="flex flex-wrap items-center gap-2">
            <Button size="sm">Pequeno</Button>
            <Button>Padrão</Button>
            <Button size="lg">Grande</Button>
            <Button size="icon" variant="outline" aria-label="Editar">
              <Pencil />
            </Button>
            <Button variant="outline">
              <Download /> Exportar
            </Button>
          </div>
        </DsBlock>
        <DsBlock title="Especificações">
          <DsSpecs
            items={[
              ["Altura sm", "32px"],
              ["Altura padrão", "36px"],
              ["Altura lg", "40px"],
              ["Padding", "16px horizontal"],
              ["Radius", "rounded-md"],
              ["Tipografia", "14px / 500"],
              ["Ícone", "16px"],
              ["Gap ícone/texto", "8px"],
              ["Gap entre botões", "8px"],
            ]}
          />
        </DsBlock>
      </DsGrid>
    </DsSection>
  );
}

/* ---------------------------- Inputs ---------------------------- */

export function DsInputs() {
  return (
    <DsSection id="inputs" title="8. Inputs" description="Sempre com label. Erros substituem o helper text; obrigatórios recebem asterisco.">
      <DsGrid cols={3}>
        <DsBlock title="Padrão">
          <Input placeholder="Digite aqui..." />
        </DsBlock>
        <DsBlock title="Com label">
          <Field label="Nome fantasia">
            <Input placeholder="Metas Comércio Ltda" />
          </Field>
        </DsBlock>
        <DsBlock title="Obrigatório">
          <Field label="Razão social" required>
            <Input placeholder="Informe a razão social" />
          </Field>
        </DsBlock>
        <DsBlock title="Com helper text">
          <Field label="CNPJ" hint="Somente números, 14 dígitos.">
            <Input placeholder="00.000.000/0000-00" />
          </Field>
        </DsBlock>
        <DsBlock title="Com ícone">
          <Field label="E-mail">
            <div className="relative">
              <Mail className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input className="pl-8" placeholder="contato@empresa.com.br" />
            </div>
          </Field>
        </DsBlock>
        <DsBlock title="Com erro">
          <Field label="Telefone" required error="Informe um telefone válido.">
            <Input defaultValue="(85) 9" className="border-destructive focus-visible:ring-destructive" />
          </Field>
        </DsBlock>
        <DsBlock title="Desabilitado">
          <Field label="Código">
            <Input disabled value="CLI-0001" readOnly />
          </Field>
        </DsBlock>
        <DsBlock title="Somente leitura">
          <Field label="Cadastrado em">
            <Input readOnly value="02/09/2026" className="bg-muted/50" />
          </Field>
        </DsBlock>
        <DsBlock title="SearchInput (compartilhado)">
          <SearchInput value="" onChange={() => {}} placeholder="Busca rápida..." />
        </DsBlock>
      </DsGrid>
    </DsSection>
  );
}

/* --------------------------- Selects ---------------------------- */

export function DsSelects() {
  const [multi, setMulti] = useState<string[]>(["Alpha Indústria"]);
  const options = ["Alpha Indústria", "Beta Componentes", "Gama Distribuidora"];
  return (
    <DsSection id="selects" title="9. Selects" description="Placeholder sempre no formato “Selecione…”. Para listas longas, usar select com busca.">
      <DsGrid cols={3}>
        <DsBlock title="Padrão">
          <Field label="Representada">
            <Select>
              <SelectTrigger><SelectValue placeholder="Selecione uma representada" /></SelectTrigger>
              <SelectContent>
                {options.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
        </DsBlock>
        <DsBlock title="Com busca">
          <Field label="Cliente">
            <Select>
              <SelectTrigger><SelectValue placeholder="Selecione um cliente" /></SelectTrigger>
              <SelectContent>
                <div className="p-1">
                  <SearchInput value="" onChange={() => {}} placeholder="Buscar cliente..." />
                </div>
                {["Comercial Sol Ltda", "Distribuidora Norte", "Mercantil Ceará"].map((o) => (
                  <SelectItem key={o} value={o}>{o}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </DsBlock>
        <DsBlock title="Desabilitado">
          <Field label="Vendedor">
            <Select disabled>
              <SelectTrigger><SelectValue placeholder="Indisponível" /></SelectTrigger>
              <SelectContent />
            </Select>
          </Field>
        </DsBlock>
        <DsBlock title="Com erro">
          <Field label="Situação" required error="Selecione uma situação.">
            <Select>
              <SelectTrigger className="border-destructive focus:ring-destructive">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ativo">Ativo</SelectItem>
                <SelectItem value="inativo">Inativo</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </DsBlock>
        <DsBlock title="Múltipla seleção" hint="Composição de Popover/Checkbox — selecionados viram badges.">
          <div className="space-y-2">
            <div className="flex flex-wrap gap-1">
              {multi.length === 0 ? (
                <span className="text-xs text-muted-foreground">Nenhuma selecionada</span>
              ) : (
                multi.map((m) => <Badge key={m} variant="secondary">{m}</Badge>)
              )}
            </div>
            <div className="space-y-1.5 rounded-md border p-2">
              {options.map((o) => (
                <label key={o} className="flex cursor-pointer items-center gap-2 text-sm">
                  <Checkbox
                    checked={multi.includes(o)}
                    onCheckedChange={(v) =>
                      setMulti((prev) => (v ? [...prev, o] : prev.filter((p) => p !== o)))
                    }
                  />
                  {o}
                </label>
              ))}
            </div>
          </div>
        </DsBlock>
      </DsGrid>
    </DsSection>
  );
}

/* ------------------- Checkbox / Radio / Switch ------------------- */

export function DsChoices() {
  const [tipo, setTipo] = useState("cliente");
  const [ativo, setAtivo] = useState(true);
  return (
    <>
      <DsSection id="checkboxes" title="10. Checkboxes" description="Usados em seleção de linhas de tabela e flags booleanas de cadastro.">
        <DsBlock>
          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2 text-sm"><Checkbox /> Produto ativo</label>
            <label className="flex items-center gap-2 text-sm"><Checkbox defaultChecked /> Produto em linha</label>
            <label className="flex items-center gap-2 text-sm"><Checkbox checked="indeterminate" /> Seleção parcial</label>
            <label className="flex items-center gap-2 text-sm text-muted-foreground"><Checkbox disabled /> Desabilitado</label>
          </div>
        </DsBlock>
      </DsSection>

      <DsSection id="radio" title="11. Radio Buttons" description="Para escolhas exclusivas com poucas opções (até 5). Acima disso, usar Select.">
        <DsBlock title="Tipo de cadastro">
          <RadioGroup value={tipo} onValueChange={setTipo} className="grid gap-2 sm:grid-cols-2">
            {[
              ["cliente", "Cliente"],
              ["representada", "Representada"],
              ["transportadora", "Transportadora"],
              ["vendedor", "Vendedor"],
            ].map(([v, l]) => (
              <label key={v} className="flex items-center gap-2 text-sm">
                <RadioGroupItem value={v} id={`ds-radio-${v}`} /> {l}
              </label>
            ))}
          </RadioGroup>
        </DsBlock>
      </DsSection>

      <DsSection id="switch" title="12. Switch" description="Para alternar estados aplicados imediatamente (ativar/desativar registro).">
        <DsBlock>
          <div className="flex flex-wrap items-center gap-8">
            <div className="flex items-center gap-2">
              <Switch id="ds-switch-on" checked={ativo} onCheckedChange={setAtivo} />
              <Label htmlFor="ds-switch-on" className="text-sm">Ativar cliente</Label>
              <Badge variant="secondary">{ativo ? "ON" : "OFF"}</Badge>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Switch disabled /> <span className="text-sm">Desabilitado</span>
            </div>
          </div>
        </DsBlock>
      </DsSection>
    </>
  );
}

/* ---------------------------- Badges ---------------------------- */

const BADGES: { label: string; cls?: string; variant?: "default" | "secondary" | "destructive" | "outline" }[] = [
  { label: "Ativo", cls: "border-success/30 bg-success/10 text-success" },
  { label: "Inativo", variant: "secondary" },
  { label: "Pendente", cls: "border-warning/40 bg-warning/15 text-warning-foreground" },
  { label: "Aprovado", cls: "border-success/30 bg-success/10 text-success" },
  { label: "Cancelado", cls: "border-destructive/30 bg-destructive/10 text-destructive" },
  { label: "Em análise", cls: "border-primary/30 bg-primary/10 text-primary" },
  { label: "Novo", variant: "default" },
  { label: "Em linha", cls: "border-success/30 bg-success/10 text-success" },
  { label: "Fora de linha", variant: "outline" },
];

export function DsBadges() {
  return (
    <DsSection id="badges" title="13. Badges" description="Sempre com cor semântica. Nunca usar badge como botão.">
      <DsBlock>
        <div className="flex flex-wrap gap-2">
          {BADGES.map((b) => (
            <Badge key={b.label} variant={b.variant ?? "outline"} className={b.cls}>
              {b.label}
            </Badge>
          ))}
        </div>
      </DsBlock>
      <DsBlock title="StatusBadge (componente compartilhado)">
        <div className="flex gap-2">
          <StatusBadge situacao="ativo" />
          <StatusBadge situacao="inativo" />
        </div>
      </DsBlock>
    </DsSection>
  );
}

/* ----------------------------- Cards ---------------------------- */

export function DsCards() {
  return (
    <DsSection id="cards" title="14. Cards" description="Superfície padrão de conteúdo. Padding interno de 16px e borda de 1px.">
      <DsGrid cols={2}>
        <Card>
          <CardHeader><CardTitle className="text-base">Card padrão</CardTitle></CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Conteúdo do card com texto descritivo de exemplo.
          </CardContent>
          <CardFooter className="justify-end gap-2">
            <Button variant="ghost" size="sm">Cancelar</Button>
            <Button size="sm">Ação</Button>
          </CardFooter>
        </Card>

        <div className="space-y-3">
          <SummaryCard label="Clientes cadastrados" value="1.248" hint="+32 neste mês" icon={<Users className="h-4 w-4" />} />
          <Card>
            <CardContent className="p-4">
              <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Última atualização</div>
              <div className="mt-1 text-sm">02/09/2026 · 11:52</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center justify-between p-4">
              <span className="text-sm font-medium">Status</span>
              <StatusBadge situacao="ativo" />
            </CardContent>
          </Card>
          <Card className="cursor-pointer transition-colors hover:border-primary/40 hover:bg-accent/50">
            <CardContent className="flex items-center justify-between p-4">
              <span className="text-sm font-medium">Card clicável (hover)</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </CardContent>
          </Card>
        </div>
      </DsGrid>
      <DsBlock title="SummaryCards (grade de resumo)">
        <SummaryCards>
          <SummaryCard label="Total" value="1.248" />
          <SummaryCard label="Ativos" value="1.102" />
          <SummaryCard label="Inativos" value="146" />
          <SummaryCard label="Estados" value="12" />
        </SummaryCards>
      </DsBlock>
    </DsSection>
  );
}

/* ---------------------------- Tabelas --------------------------- */

type DemoRow = { id: string; codigo: string; nome: string; situacao: "ativo" | "inativo"; data: string };

const DEMO_ROWS: DemoRow[] = [
  { id: "1", codigo: "CLI-0001", nome: "Comercial Sol Ltda", situacao: "ativo", data: "12/03/2026" },
  { id: "2", codigo: "CLI-0002", nome: "Distribuidora Norte ME", situacao: "ativo", data: "28/04/2026" },
  { id: "3", codigo: "CLI-0003", nome: "Mercantil Ceará S/A", situacao: "inativo", data: "05/06/2026" },
  { id: "4", codigo: "CLI-0004", nome: "Atacadão Litoral", situacao: "ativo", data: "19/07/2026" },
];

export function DsTables() {
  const [selected, setSelected] = useState<string[]>(["2"]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const columns: Column<DemoRow>[] = [
    { key: "codigo", header: "Código", cell: (r) => <span className="font-mono text-xs">{r.codigo}</span> },
    { key: "nome", header: "Nome", cell: (r) => <span className="font-medium">{r.nome}</span> },
    { key: "situacao", header: "Status", cell: (r) => <StatusBadge situacao={r.situacao} /> },
    { key: "data", header: "Data", className: "tabular-nums", cell: (r) => r.data },
  ];

  return (
    <DsSection
      id="tabelas"
      title="15. Tabelas"
      description="Componente DataTable compartilhado: seleção múltipla, ações por linha, paginação e estados vazios padronizados."
    >
      <DsBlock title="Cabeçalho ordenável">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40">
              {["Código", "Nome", "Status", "Data"].map((h) => (
                <TableHead key={h}>
                  <button className="flex items-center gap-1 hover:text-foreground">
                    {h} <ArrowUpDown className="h-3 w-3 opacity-60" />
                  </button>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {DEMO_ROWS.slice(0, 2).map((r) => (
              <TableRow key={r.id} className="hover:bg-muted/30">
                <TableCell className="font-mono text-xs">{r.codigo}</TableCell>
                <TableCell>{r.nome}</TableCell>
                <TableCell><StatusBadge situacao={r.situacao} /></TableCell>
                <TableCell className="tabular-nums">{r.data}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DsBlock>

      <DsBlock title="DataTable completa" hint="Seleção, ações e paginação.">
        <DataTable
          rows={DEMO_ROWS}
          columns={columns}
          selected={selected}
          onSelectedChange={setSelected}
          page={page}
          perPage={perPage}
          total={DEMO_ROWS.length}
          onPageChange={setPage}
          onPerPageChange={setPerPage}
          rowActions={() => (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal /></Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem><Eye className="mr-2 h-4 w-4" /> Visualizar</DropdownMenuItem>
                <DropdownMenuItem><Pencil className="mr-2 h-4 w-4" /> Editar</DropdownMenuItem>
                <DropdownMenuItem className="text-destructive"><Trash2 className="mr-2 h-4 w-4" /> Excluir</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        />
      </DsBlock>

      <DsGrid cols={2}>
        <DsBlock title="Carregando">
          <DataTable
            rows={[]}
            columns={columns}
            loading
            selected={[]}
            onSelectedChange={() => {}}
            page={1}
            perPage={10}
            total={0}
            onPageChange={() => {}}
            onPerPageChange={() => {}}
          />
        </DsBlock>
        <DsBlock title="Vazia / sem resultados">
          <DataTable
            rows={[]}
            columns={columns}
            selected={[]}
            onSelectedChange={() => {}}
            emptyTitle="Nenhum resultado corresponde aos filtros"
            emptyDescription="Ajuste ou limpe os filtros para ver mais registros."
            emptyAction={<Button variant="outline" size="sm">Limpar filtros</Button>}
            page={1}
            perPage={10}
            total={0}
            onPageChange={() => {}}
            onPerPageChange={() => {}}
          />
        </DsBlock>
      </DsGrid>
      <DsBlock title="Muitos registros" hint="Acima de 25 linhas, manter cabeçalho fixo e scroll horizontal em telas pequenas.">
        <div className="max-h-56 overflow-auto rounded-md border">
          <Table>
            <TableHeader className="sticky top-0 bg-muted">
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 20 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell className="font-mono text-xs">CLI-{String(i + 10).padStart(4, "0")}</TableCell>
                  <TableCell>Empresa Exemplo {i + 1}</TableCell>
                  <TableCell><StatusBadge situacao={i % 3 === 0 ? "inativo" : "ativo"} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </DsBlock>
    </DsSection>
  );
}

/* ------------------------------ Abas ---------------------------- */

export function DsTabs() {
  return (
    <DsSection id="abas" title="16. Abas" description="Padrão dos cadastros. A primeira aba é sempre “Dados Gerais”.">
      <DsBlock>
        <Tabs defaultValue="gerais">
          <TabsList className="flex-wrap">
            <TabsTrigger value="gerais">Dados Gerais</TabsTrigger>
            <TabsTrigger value="financeiro">Informações Financeiras</TabsTrigger>
            <TabsTrigger value="contatos">
              Contatos <Badge variant="secondary" className="ml-2">3</Badge>
            </TabsTrigger>
            <TabsTrigger value="enderecos">Endereços</TabsTrigger>
            <TabsTrigger value="historico" disabled>Histórico</TabsTrigger>
          </TabsList>
          <TabsContent value="gerais" className="pt-3 text-sm text-muted-foreground">
            Conteúdo da aba ativa — campos de identificação do registro.
          </TabsContent>
          <TabsContent value="financeiro" className="pt-3 text-sm text-muted-foreground">Limite de crédito, condições de pagamento e dados bancários.</TabsContent>
          <TabsContent value="contatos" className="pt-3 text-sm text-muted-foreground">Lista de contatos vinculados.</TabsContent>
          <TabsContent value="enderecos" className="pt-3 text-sm text-muted-foreground">Endereços de cobrança e entrega.</TabsContent>
        </Tabs>
      </DsBlock>
    </DsSection>
  );
}

/* ------------------------ Modais e Drawers ---------------------- */

export function DsOverlays() {
  return (
    <>
      <DsSection id="modais" title="17. Modais" description="Máximo de duas ações no rodapé. Confirmações destrutivas usam AlertDialog.">
        <DsBlock>
          <div className="flex flex-wrap gap-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive"><Trash2 /> Modal de confirmação</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Excluir cliente?</AlertDialogTitle>
                  <AlertDialogDescription>Esta ação não poderá ser desfeita.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Excluir</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <Dialog>
              <DialogTrigger asChild><Button variant="outline"><Info /> Modal informativo</Button></DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Informação</DialogTitle>
                  <DialogDescription>Os dados exibidos nesta página são fictícios e servem apenas como referência visual.</DialogDescription>
                </DialogHeader>
                <DialogFooter><Button variant="outline">Fechar</Button></DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild><Button><Plus /> Modal com formulário</Button></DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Novo contato</DialogTitle>
                  <DialogDescription>Exemplo visual — não persiste dados.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Nome" required><Input placeholder="Nome do contato" /></Field>
                  <Field label="Cargo"><Input placeholder="Comprador" /></Field>
                  <Field label="E-mail"><Input placeholder="contato@empresa.com.br" /></Field>
                  <Field label="Telefone"><Input placeholder="(85) 90000-0000" /></Field>
                </div>
                <DialogFooter>
                  <Button variant="ghost">Cancelar</Button>
                  <Button>Salvar</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </DsBlock>
      </DsSection>

      <DsSection id="drawers" title="18. Drawers" description="Painel lateral para visualização rápida sem sair da listagem.">
        <DsBlock>
          <Sheet>
            <SheetTrigger asChild><Button variant="outline"><Eye /> Abrir drawer</Button></SheetTrigger>
            <SheetContent className="w-full sm:max-w-md">
              <SheetHeader>
                <SheetTitle>Detalhes do Cliente</SheetTitle>
                <SheetDescription>Visualização resumida do registro.</SheetDescription>
              </SheetHeader>
              <div className="grid gap-4 py-6">
                <ReadField label="Nome" value="Comercial Sol Ltda" />
                <ReadField label="CNPJ" value="12.345.678/0001-90" />
                <ReadField label="Telefone" value="(85) 3232-1010" />
                <ReadField label="Status" value={<StatusBadge situacao="ativo" />} />
              </div>
              <SheetFooter>
                <Button variant="outline">Fechar</Button>
                <Button><Pencil /> Editar</Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </DsBlock>
      </DsSection>
    </>
  );
}

/* ----------------------- Alertas e Toasts ----------------------- */

export function DsFeedback() {
  return (
    <>
      <DsSection id="alertas" title="19. Alertas" description="Mensagens persistentes no contexto da página.">
        <div className="space-y-3">
          <Alert className="border-success/30 bg-success/10 text-success">
            <CheckCircle2 className="h-4 w-4" />
            <AlertTitle>Sucesso</AlertTitle>
            <AlertDescription>Cliente atualizado com sucesso.</AlertDescription>
          </Alert>
          <Alert className="border-warning/40 bg-warning/10">
            <TriangleAlert className="h-4 w-4" />
            <AlertTitle>Atenção</AlertTitle>
            <AlertDescription>Existem informações pendentes neste cadastro.</AlertDescription>
          </Alert>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erro</AlertTitle>
            <AlertDescription>Não foi possível concluir a operação.</AlertDescription>
          </Alert>
          <Alert className="border-primary/30 bg-primary/5">
            <Info className="h-4 w-4" />
            <AlertTitle>Informação</AlertTitle>
            <AlertDescription>Os dados são atualizados diariamente às 06h.</AlertDescription>
          </Alert>
        </div>
      </DsSection>

      <DsSection id="toasts" title="20. Toasts" description="Feedback temporário de ações. Biblioteca: sonner, posicionado no canto superior direito.">
        <DsBlock>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => toast.success("Cliente cadastrado com sucesso.")}>Sucesso</Button>
            <Button variant="outline" onClick={() => toast.error("Não foi possível salvar o registro.")}>Erro</Button>
            <Button variant="outline" onClick={() => toast.warning("Existem campos obrigatórios em branco.")}>Aviso</Button>
            <Button variant="outline" onClick={() => toast.info("Exportação disponível em breve.")}>Informação</Button>
          </div>
        </DsBlock>
      </DsSection>
    </>
  );
}

/* -------------------- Breadcrumb e paginação -------------------- */

export function DsNavPatterns() {
  return (
    <>
      <DsSection id="breadcrumb" title="21. Breadcrumb" description="Sempre presente em telas internas, acima do título da página.">
        <DsBlock>
          <nav className="flex items-center gap-1 text-xs text-muted-foreground">
            <span className="cursor-pointer hover:text-foreground hover:underline">Dashboard</span>
            <ChevronRight className="h-3 w-3" />
            <span className="cursor-pointer hover:text-foreground hover:underline">Pessoal</span>
            <ChevronRight className="h-3 w-3" />
            <span className="cursor-pointer underline decoration-dotted hover:text-foreground">Clientes</span>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground">Visualização</span>
          </nav>
          <DsSpecs items={[["Normal", "muted-foreground"], ["Hover", "foreground + underline"], ["Atual", "foreground, sem link"]]} />
        </DsBlock>
      </DsSection>

      <DsSection id="paginacao" title="22. Paginação" description="Sempre no rodapé da tabela, junto ao total de registros e itens por página.">
        <DsBlock>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Itens por página</span>
              <Select defaultValue="25">
                <SelectTrigger className="h-8 w-[80px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {[10, 25, 50, 100].map((n) => <SelectItem key={n} value={String(n)}>{n}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="sm">‹ Anterior</Button>
              {[1, 2, 3, 4].map((p) => (
                <Button key={p} size="sm" variant={p === 1 ? "default" : "ghost"} className="h-8 w-8 p-0">{p}</Button>
              ))}
              <Button variant="outline" size="sm">Próximo ›</Button>
            </div>
          </div>
        </DsBlock>
      </DsSection>
    </>
  );
}

/* ---------------------------- Filtros --------------------------- */

export function DsFilters() {
  const [open, setOpen] = useState(false);
  return (
    <DsSection id="filtros" title="23. Filtros" description="Painel FilterPanel acima da tabela, com botões “Limpar filtros” e “Pesquisar” alinhados à direita.">
      <FilterPanel onSearch={() => toast.info("Pesquisa simulada.")} onClear={() => toast.info("Filtros limpos.")}>
        <Field label="Código"><Input placeholder="CLI-0001" /></Field>
        <Field label="Nome"><Input placeholder="Razão social ou fantasia" /></Field>
        <Field label="CNPJ"><Input placeholder="00.000.000/0000-00" /></Field>
        <Field label="Representada">
          <Select><SelectTrigger><SelectValue placeholder="Todas" /></SelectTrigger>
            <SelectContent><SelectItem value="alpha">Alpha Indústria</SelectItem></SelectContent>
          </Select>
        </Field>
      </FilterPanel>

      <Collapsible open={open} onOpenChange={setOpen}>
        <Card>
          <CardContent className="space-y-3 p-4">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="px-0">
                <ChevronRight className={`transition-transform ${open ? "rotate-90" : ""}`} />
                Filtros avançados
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <Field label="Situação">
                  <Select><SelectTrigger><SelectValue placeholder="Todas" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ativo">Ativo</SelectItem>
                      <SelectItem value="inativo">Inativo</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Data inicial"><Input type="date" /></Field>
                <Field label="Data final"><Input type="date" /></Field>
                <Field label="Vendedor"><Input placeholder="Nome do vendedor" /></Field>
              </div>
            </CollapsibleContent>
          </CardContent>
        </Card>
      </Collapsible>

      <ActionToolbar>
        <Button size="sm"><Plus /> Novo</Button>
        <Button size="sm" variant="outline"><Download /> Exportar</Button>
        <Separator orientation="vertical" className="h-6" />
        <SearchInput value="" onChange={() => {}} className="w-full sm:w-64" />
      </ActionToolbar>
    </DsSection>
  );
}

/* --------------------------- Estados ---------------------------- */

export function DsStates() {
  return (
    <DsSection id="estados" title="24. Estados da interface" description="Todo carregamento assíncrono precisa de estado de loading, vazio e erro.">
      <DsGrid cols={2}>
        <DsBlock title="Loading — skeleton">
          <SkeletonRows rows={4} />
        </DsBlock>
        <DsBlock title="Loading — spinner">
          <LoadingState />
        </DsBlock>
        <DsBlock title="Empty state">
          <EmptyState compact title="Nenhum registro encontrado" description="Cadastre o primeiro registro para começar." action={<Button size="sm"><Plus /> Novo cliente</Button>} />
        </DsBlock>
        <DsBlock title="No results">
          <EmptyState compact icon={<Search className="h-8 w-8" />} title="Nenhum resultado corresponde aos filtros" description="Revise os critérios de busca." action={<Button size="sm" variant="outline">Limpar filtros</Button>} />
        </DsBlock>
        <DsBlock title="Erro">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Não foi possível carregar os dados</AlertTitle>
            <AlertDescription>Tente novamente em alguns instantes.</AlertDescription>
          </Alert>
        </DsBlock>
        <DsBlock title="Sucesso">
          <Alert className="border-success/30 bg-success/10 text-success">
            <CheckCircle2 className="h-4 w-4" />
            <AlertTitle>Operação realizada com sucesso</AlertTitle>
            <AlertDescription>Registro salvo em 02/09/2026.</AlertDescription>
          </Alert>
        </DsBlock>
        <DsBlock title="Skeleton de card">
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </DsBlock>
      </DsGrid>
    </DsSection>
  );
}

/* -------------------------- Formulários ------------------------- */

export function DsForms() {
  return (
    <DsSection id="formularios" title="25. Formulários" description="Grade de 1 coluna no mobile, 2 no tablet e 3/4 no desktop. Ações fixas no rodapé do formulário.">
      <FormSection title="Dados do cliente" description="Exemplo demonstrativo — nenhum dado é salvo.">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Nome" required><Input placeholder="Razão social" /></Field>
          <Field label="E-mail" hint="Usado para envio de pedidos."><Input placeholder="contato@empresa.com.br" /></Field>
          <Field label="Telefone" error="Telefone inválido."><Input defaultValue="(85) 9" className="border-destructive" /></Field>
          <Field label="Cidade"><Input placeholder="Fortaleza" /></Field>
          <Field label="Estado">
            <Select><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="CE">Ceará</SelectItem>
                <SelectItem value="SP">São Paulo</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Situação" required>
            <Select defaultValue="ativo"><SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ativo">Ativo</SelectItem>
                <SelectItem value="inativo">Inativo</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Código" hint="Gerado automaticamente."><Input readOnly value="CLI-0001" className="bg-muted/50" /></Field>
          <Field label="Integração ERP"><Input disabled value="Desabilitado" /></Field>
          <Field label="Observações" className="sm:col-span-2 lg:col-span-3">
            <Textarea rows={3} placeholder="Informações complementares (opcional)" />
          </Field>
        </div>
        <div className="mt-4 flex justify-end gap-2 border-t pt-4">
          <Button variant="ghost">Cancelar</Button>
          <Button>Salvar</Button>
        </div>
      </FormSection>
    </DsSection>
  );
}

/* --------------------------- Navegação -------------------------- */

export function DsNavigation() {
  return (
    <DsSection id="navegacao" title="26. Navegação" description="Sidebar recolhível + header fixo. O item ativo recebe fundo de acento e texto em destaque.">
      <DsGrid cols={2}>
        <DsBlock title="Sidebar — estado normal">
          <div className="w-full max-w-[240px] rounded-md border bg-sidebar p-2 text-sidebar-foreground">
            <div className="px-2 py-1 text-[11px] font-semibold uppercase text-muted-foreground">Pessoal</div>
            {[["Clientes", true], ["Representadas", false], ["Transportadoras", false]].map(([l, active]) => (
              <div
                key={String(l)}
                className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-sm ${
                  active ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground" : ""
                }`}
              >
                <Users className="h-4 w-4" /> {l}
              </div>
            ))}
          </div>
        </DsBlock>
        <DsBlock title="Sidebar recolhida — somente ícones">
          <div className="w-14 rounded-md border bg-sidebar p-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className={`mb-1 flex h-8 w-full items-center justify-center rounded-md ${i === 0 ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-muted-foreground"}`}>
                <Users className="h-4 w-4" />
              </div>
            ))}
          </div>
        </DsBlock>
        <DsBlock title="Header">
          <div className="flex items-center gap-2 rounded-md border bg-card p-2">
            <SearchInput value="" onChange={() => {}} className="flex-1" placeholder="Pesquisar..." />
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Notificações"><AlertCircle /></Button>
              </TooltipTrigger>
              <TooltipContent>Notificações</TooltipContent>
            </Tooltip>
            <Button variant="ghost" size="icon" aria-label="Usuário"><Users /></Button>
          </div>
        </DsBlock>
        <DsBlock title="PageHeader (com breadcrumb e ações)">
          <PageHeader
            title="Clientes"
            description="Gestão da carteira de clientes."
            breadcrumbs={[{ label: "Dashboard" }, { label: "Pessoal" }, { label: "Clientes" }]}
            actions={<Button size="sm"><Plus /> Novo</Button>}
          />
        </DsBlock>
      </DsGrid>
    </DsSection>
  );
}

/* ------------------------ Responsividade ------------------------ */

const BREAKPOINTS = [
  { label: "Desktop", size: "1440px", notes: "Sidebar expandida, grid de até 4 colunas, tabela completa." },
  { label: "Notebook", size: "1280px", notes: "Sidebar recolhida por padrão, grid de 3 colunas." },
  { label: "Tablet", size: "768px", notes: "Sidebar vira drawer, grid de 2 colunas, filtros recolhíveis." },
  { label: "Mobile", size: "375px", notes: "Cards em 1 coluna, tabela com scroll horizontal, ações em menu." },
];

export function DsResponsive() {
  return (
    <DsSection id="responsividade" title="27. Responsividade" description="Breakpoints Tailwind: sm 640 · md 768 · lg 1024 · xl 1280.">
      <DsGrid cols={2}>
        {BREAKPOINTS.map((b) => (
          <DsBlock key={b.label} title={`${b.label} — ${b.size}`} hint={b.notes}>
            <div className="rounded-md border bg-muted/30 p-2">
              <div className="flex gap-2">
                {b.label === "Mobile" ? null : (
                  <div className={`${b.label === "Tablet" ? "w-6" : b.label === "Notebook" ? "w-6" : "w-16"} rounded bg-primary/20`} style={{ height: 64 }} />
                )}
                <div className="flex-1 space-y-2">
                  <div className="h-4 rounded bg-muted" />
                  <div className={`grid gap-2 ${b.label === "Mobile" ? "grid-cols-1" : b.label === "Tablet" ? "grid-cols-2" : b.label === "Notebook" ? "grid-cols-3" : "grid-cols-4"}`}>
                    {Array.from({ length: b.label === "Mobile" ? 2 : 4 }).map((_, i) => (
                      <div key={i} className="h-8 rounded bg-card shadow-sm" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </DsBlock>
        ))}
      </DsGrid>
    </DsSection>
  );
}
