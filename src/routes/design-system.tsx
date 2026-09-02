import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { BookOpen, Palette, ShieldCheck, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/layout/page-header";
import { DsBlock, DsGrid, DsSection } from "@/components/design-system/ds-primitives";
import {
  DsColors,
  DsIcons,
  DsRadiusShadows,
  DsSpacing,
  DsTypography,
} from "@/components/design-system/ds-foundations";
import {
  DsBadges,
  DsButtons,
  DsCards,
  DsChoices,
  DsFeedback,
  DsFilters,
  DsForms,
  DsInputs,
  DsNavPatterns,
  DsNavigation,
  DsOverlays,
  DsResponsive,
  DsSelects,
  DsStates,
  DsTables,
  DsTabs,
} from "@/components/design-system/ds-components";

export const Route = createFileRoute("/design-system")({
  head: () => ({
    meta: [
      { title: "Design System — Metas Representações" },
      {
        name: "description",
        content:
          "Biblioteca de padrões visuais e componentes utilizados no sistema Metas Representações: cores, tipografia, espaçamentos e componentes de interface.",
      },
      { property: "og:title", content: "Design System — Metas Representações" },
      {
        property: "og:description",
        content: "Documentação visual dos padrões e componentes de interface do ERP Metas Representações.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: DesignSystemPage,
});

const INDEX: { id: string; label: string }[] = [
  { id: "introducao", label: "Introdução" },
  { id: "cores", label: "Cores" },
  { id: "tipografia", label: "Tipografia" },
  { id: "espacamentos", label: "Espaçamentos" },
  { id: "bordas", label: "Bordas e sombras" },
  { id: "icones", label: "Ícones" },
  { id: "botoes", label: "Botões" },
  { id: "inputs", label: "Inputs" },
  { id: "selects", label: "Selects" },
  { id: "checkboxes", label: "Checkboxes" },
  { id: "radio", label: "Radio Buttons" },
  { id: "switch", label: "Switch" },
  { id: "badges", label: "Badges" },
  { id: "cards", label: "Cards" },
  { id: "tabelas", label: "Tabelas" },
  { id: "abas", label: "Abas" },
  { id: "modais", label: "Modais" },
  { id: "drawers", label: "Drawers" },
  { id: "alertas", label: "Alertas" },
  { id: "toasts", label: "Toasts" },
  { id: "breadcrumb", label: "Breadcrumb" },
  { id: "paginacao", label: "Paginação" },
  { id: "filtros", label: "Filtros" },
  { id: "estados", label: "Estados" },
  { id: "formularios", label: "Formulários" },
  { id: "navegacao", label: "Navegação" },
  { id: "responsividade", label: "Responsividade" },
  { id: "regras", label: "Regras de uso" },
  { id: "componentes", label: "Componentes reutilizáveis" },
];

const RULES = [
  "Utilizar sempre os componentes existentes antes de criar um novo.",
  "Manter a mesma hierarquia visual em todas as telas.",
  "Não criar novas cores sem necessidade — usar os tokens semânticos.",
  "Não utilizar fontes diferentes da família padrão.",
  "Manter os mesmos espaçamentos da escala de 4px.",
  "Utilizar os mesmos padrões de botões e suas variantes.",
  "Utilizar os mesmos padrões de tabelas (DataTable).",
  "Utilizar os mesmos padrões de formulários (FormSection + Field).",
  "Manter consistência entre todos os módulos do sistema.",
  "Qualquer novo componente deve ser incorporado ao Design System.",
];

const COMPONENTS: { name: string; preview: React.ReactNode; desc: string }[] = [
  { name: "Button", desc: "Ações primárias e secundárias.", preview: <Button size="sm">Salvar</Button> },
  { name: "Input", desc: "Entrada de texto.", preview: <Input className="h-8" placeholder="Texto" /> },
  {
    name: "Select",
    desc: "Escolha única em lista.",
    preview: (
      <Select>
        <SelectTrigger className="h-8"><SelectValue placeholder="Selecione" /></SelectTrigger>
        <SelectContent><SelectItem value="a">Opção A</SelectItem></SelectContent>
      </Select>
    ),
  },
  { name: "Checkbox", desc: "Flags e seleção de linhas.", preview: <Checkbox defaultChecked /> },
  { name: "Radio", desc: "Escolha exclusiva.", preview: <RadioGroup defaultValue="a"><RadioGroupItem value="a" /></RadioGroup> },
  { name: "Switch", desc: "Alternância imediata.", preview: <Switch defaultChecked /> },
  { name: "Badge", desc: "Status e marcadores.", preview: <Badge className="border-success/30 bg-success/10 text-success">Ativo</Badge> },
  { name: "Card", desc: "Superfície de conteúdo.", preview: <div className="h-8 w-full rounded-md border bg-card shadow-sm" /> },
  { name: "DataTable", desc: "Listagem com seleção e paginação.", preview: <div className="space-y-1"><div className="h-2 rounded bg-muted" /><div className="h-2 rounded bg-muted/60" /><div className="h-2 rounded bg-muted/60" /></div> },
  { name: "FilterPanel", desc: "Painel de filtros de listagem.", preview: <div className="grid grid-cols-2 gap-1"><div className="h-4 rounded bg-muted" /><div className="h-4 rounded bg-muted" /></div> },
  { name: "Modal", desc: "Diálogos e confirmações.", preview: <div className="rounded-md border bg-card p-2 text-[10px] shadow-md">Confirmar?</div> },
  { name: "Drawer", desc: "Painel lateral de detalhes.", preview: <div className="flex justify-end"><div className="h-8 w-1/2 rounded-l-md border bg-card" /></div> },
  { name: "Toast", desc: "Feedback temporário.", preview: <div className="rounded-md border border-success/30 bg-success/10 px-2 py-1 text-[10px] text-success">Salvo com sucesso</div> },
  { name: "Alert", desc: "Mensagem contextual.", preview: <div className="rounded-md border border-destructive/40 px-2 py-1 text-[10px] text-destructive">Erro na operação</div> },
  { name: "Tabs", desc: "Navegação entre abas do cadastro.", preview: <div className="flex gap-1"><span className="rounded bg-background px-2 py-0.5 text-[10px] shadow-sm">Gerais</span><span className="px-2 py-0.5 text-[10px] text-muted-foreground">Contatos</span></div> },
  { name: "Breadcrumb", desc: "Trilha de navegação.", preview: <span className="text-[10px] text-muted-foreground">Dashboard › Clientes</span> },
  { name: "Pagination", desc: "Navegação entre páginas.", preview: <span className="text-[10px] tabular-nums text-muted-foreground">‹ 1 2 3 ›</span> },
  { name: "Dropdown", desc: "Menu de ações por linha.", preview: <Button size="sm" variant="ghost" className="h-7">•••</Button> },
  { name: "Tooltip", desc: "Dica contextual em ícones.", preview: <div className="w-fit rounded bg-foreground px-1.5 py-0.5 text-[10px] text-background">Editar</div> },
  { name: "DatePicker", desc: "Seleção de datas e períodos.", preview: <Input type="date" className="h-8" /> },
  { name: "SearchInput", desc: "Busca rápida em listagens.", preview: <Input className="h-8" placeholder="Buscar..." /> },
  { name: "EntitySelector", desc: "Seleção de cliente/representada/vendedor.", preview: <div className="rounded-md border px-2 py-1 text-[10px]">Alpha Indústria ▾</div> },
  { name: "StatusBadge", desc: "Situação ativo/inativo.", preview: <Badge variant="secondary">Inativo</Badge> },
  { name: "PageHeader", desc: "Título, breadcrumb e ações da página.", preview: <div className="space-y-1"><div className="h-2 w-1/3 rounded bg-muted" /><div className="h-3 w-2/3 rounded bg-muted-foreground/30" /></div> },
  { name: "SummaryCard", desc: "Indicador de resumo (KPI).", preview: <div className="rounded-md border p-2"><div className="text-[9px] uppercase text-muted-foreground">Total</div><div className="text-sm font-semibold tabular-nums">1.248</div></div> },
  { name: "EmptyState", desc: "Ausência de registros.", preview: <div className="text-center text-[10px] text-muted-foreground">Nenhum registro</div> },
  { name: "LoadingState", desc: "Carregamento em andamento.", preview: <Skeleton className="h-4 w-full" /> },
];

function DesignSystemPage() {
  const [active, setActive] = useState("introducao");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible?.target.id) setActive(visible.target.id);
      },
      { rootMargin: "-96px 0px -70% 0px", threshold: 0 },
    );
    INDEX.forEach((i) => {
      const el = document.getElementById(i.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  function goTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setActive(id);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Design System"
        description="Biblioteca de padrões visuais e componentes utilizados no sistema Metas Representações."
        breadcrumbs={[{ label: "Dashboard", to: "/" }, { label: "Sistema" }, { label: "Design System" }]}
        actions={
          <div className="flex items-center gap-2">
            <Badge variant="outline">v1.0</Badge>
            <Badge variant="outline" className="hidden sm:inline-flex">Atualizado em 02/09/2026</Badge>
            <Badge className="border-success/30 bg-success/10 text-success">Ativo</Badge>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="lg:sticky lg:top-6 lg:self-start">
          <Card>
            <CardContent className="p-2">
              <div className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                Índice
              </div>
              <nav className="max-h-[70vh] space-y-0.5 overflow-auto pr-1">
                {INDEX.map((i) => (
                  <button
                    key={i.id}
                    onClick={() => goTo(i.id)}
                    className={`block w-full cursor-pointer rounded-md px-2 py-1.5 text-left text-xs transition-colors hover:bg-accent ${
                      active === i.id ? "bg-accent font-medium text-accent-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {i.label}
                  </button>
                ))}
              </nav>
            </CardContent>
          </Card>
        </aside>

        <div className="min-w-0 space-y-10">
          <DsSection
            id="introducao"
            title="1. Introdução"
            description="O Design System do Metas Representações estabelece os padrões visuais e comportamentais utilizados em todo o sistema."
          >
            <p className="text-sm text-muted-foreground">
              Todos os novos módulos e telas devem utilizar os componentes documentados nesta página sempre que
              possível. Esta não é uma tela operacional do ERP: todos os dados aqui são fictícios e servem apenas como
              referência visual.
            </p>
            <Card className="border-primary/30 bg-primary/5">
              <CardContent className="flex gap-3 p-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-semibold">Regra principal</div>
                  <p className="text-sm text-muted-foreground">
                    Não criar componentes visuais novos quando já existir um componente equivalente no Design System.
                    Priorizar reutilização.
                  </p>
                </div>
              </CardContent>
            </Card>
            <DsGrid cols={3}>
              <DsBlock title="Fundamentos" hint="Cores, tipografia, espaçamentos, bordas e ícones." />
              <DsBlock title="Componentes" hint="Botões, campos, tabelas, feedback e navegação." />
              <DsBlock title="Padrões de tela" hint="Listagem, cadastro em abas, visualização e filtros." />
            </DsGrid>
          </DsSection>

          <DsColors />
          <DsTypography />
          <DsSpacing />
          <DsRadiusShadows />
          <DsIcons />
          <DsButtons />
          <DsInputs />
          <DsSelects />
          <DsChoices />
          <DsBadges />
          <DsCards />
          <DsTables />
          <DsTabs />
          <DsOverlays />
          <DsFeedback />
          <DsNavPatterns />
          <DsFilters />
          <DsStates />
          <DsForms />
          <DsNavigation />
          <DsResponsive />

          <DsSection id="regras" title="28. Regras de uso" description="Checklist obrigatório antes de publicar qualquer tela nova.">
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {RULES.map((r, i) => (
                <Card key={r}>
                  <CardContent className="flex gap-3 p-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary/10 text-[11px] font-semibold tabular-nums text-primary">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-sm">{r}</span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </DsSection>

          <DsSection
            id="componentes"
            title="Componentes reutilizáveis"
            description="Relação dos principais componentes disponíveis no projeto, com prévia visual."
          >
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {COMPONENTS.map((c) => (
                <Card key={c.name}>
                  <CardContent className="space-y-2 p-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-xs font-semibold">{c.name}</span>
                      <Palette className="h-3.5 w-3.5 text-muted-foreground" />
                    </div>
                    <div className="rounded-md border bg-muted/20 p-3">{c.preview}</div>
                    <p className="text-xs text-muted-foreground">{c.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Card className="bg-muted/30">
              <CardContent className="flex flex-wrap items-center gap-3 p-4 text-xs text-muted-foreground">
                <BookOpen className="h-4 w-4" />
                Documentação viva: alterações nos componentes do projeto refletem automaticamente nesta página.
                <span className="flex items-center gap-1">
                  <ShieldCheck className="h-4 w-4" /> Sem backend, sem dados reais.
                </span>
              </CardContent>
            </Card>
          </DsSection>
        </div>
      </div>
    </div>
  );
}
