import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { format, startOfMonth, endOfMonth } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Users,
  Building2,
  Truck,
  UserCog,
  Handshake,
  Tags,
  Package,
  LayoutGrid,
  Boxes,
  FileText,
  ShoppingCart,
  FileSpreadsheet,
  Receipt,
  FileSpreadsheet as FileSheet2,
  FileDown,
  UserCircle2,
  ShieldCheck,
  RefreshCw,
  Wallet,
  ShoppingCart as CartIcon,
  DollarSign,
  ClipboardList,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  CalendarIcon,
  X,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { PageHeader } from "@/components/layout/page-header";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Painel Principal — Metas Representações" },
      { name: "description", content: "Acesso rápido e visão geral do desempenho comercial." },
    ],
  }),
  component: DashboardPage,
});

type Tile = { title: string; url: string; icon: React.ComponentType<{ className?: string }> };
type Group = { label: string; items: Tile[] };

const GROUPS: Group[] = [
  {
    label: "Pessoal",
    items: [
      { title: "Clientes", url: "/clientes", icon: Users },
      { title: "Representadas", url: "/representadas", icon: Building2 },
      { title: "Transportadoras", url: "/transportadoras", icon: Truck },
      { title: "Vendedores", url: "/vendedores", icon: UserCog },
      { title: "Referências", url: "/referencias-comerciais", icon: Handshake },
    ],
  },
  {
    label: "Vendas",
    items: [
      { title: "Títulos de tabela", url: "/titulos-tabela", icon: Tags },
      { title: "Produtos", url: "/produtos", icon: Package },
      { title: "Tabelas de preços", url: "/tabelas-precos", icon: LayoutGrid },
      { title: "Grupos comerciais", url: "/grupos-comerciais", icon: Boxes },
      { title: "Grupos de produto", url: "/grupos-produto", icon: Boxes },
      { title: "Orçamentos", url: "/orcamentos", icon: FileText },
      { title: "Pedidos", url: "/pedidos", icon: ShoppingCart },
      { title: "Orçamento c...", url: "/orcamento-completo", icon: FileSpreadsheet },
      { title: "Notas fiscais", url: "/notas-fiscais", icon: Receipt },
      { title: "Duplicatas", url: "/duplicatas", icon: FileSheet2 },
      { title: "Gerar planilha", url: "/gerar-planilha", icon: FileDown },
    ],
  },
  {
    label: "Utilitários",
    items: [
      { title: "Usuários", url: "/usuarios", icon: UserCircle2 },
      { title: "Perfil de acesso", url: "/perfis", icon: ShieldCheck },
      { title: "Sincronizar", url: "/sincronizar", icon: RefreshCw },
      { title: "Contas", url: "/contas", icon: Wallet },
    ],
  },
];

const CHART_DATA_WITH_DATES = [
  { mes: "Jan", vendas: 920, date: new Date(2026, 0, 1) },
  { mes: "Fev", vendas: 1040, date: new Date(2026, 1, 1) },
  { mes: "Mar", vendas: 1180, date: new Date(2026, 2, 1) },
  { mes: "Abr", vendas: 1120, date: new Date(2026, 3, 1) },
  { mes: "Mai", vendas: 1380, date: new Date(2026, 4, 1) },
  { mes: "Jun", vendas: 1450, date: new Date(2026, 5, 1) },
  { mes: "Jul", vendas: 1610, date: new Date(2026, 6, 1) },
  { mes: "Ago", vendas: 1545, date: new Date(2026, 7, 1) },
  { mes: "Set", vendas: 1720, date: new Date(2026, 8, 1) },
  { mes: "Out", vendas: 1820, date: new Date(2026, 9, 1) },
];

const ATIVIDADES = [
  { quem: "Marina Souza", acao: "fechou pedido", alvo: "#PED-10283 — Aurora Metais", quando: "há 12 min", tag: "Pedido" },
  { quem: "Carlos Andrade", acao: "cadastrou cliente", alvo: "Costa Azul Pescados Ltda", quando: "há 47 min", tag: "Cliente" },
  { quem: "Ricardo Lima", acao: "emitiu NF", alvo: "#NF-008721", quando: "há 1 h", tag: "Nota Fiscal" },
  { quem: "Patrícia Mendes", acao: "atualizou tabela de preços", alvo: "Tabela Sudeste 2025-Q4", quando: "há 2 h", tag: "Tabela" },
  { quem: "Fernanda Castro", acao: "registrou duplicata paga", alvo: "DUP-44218 — R$ 18.420,00", quando: "há 3 h", tag: "Financeiro" },
  { quem: "João Pereira", acao: "criou orçamento", alvo: "#ORC-30482 — Vale Verde", quando: "há 5 h", tag: "Orçamento" },
];

const DEFAULT_START = new Date(2026, 0, 1);
const DEFAULT_END = new Date(2026, 9, 31);

function formatCurrency(value: number) {
  const abs = Math.abs(value);
  if (abs >= 1_000_000) {
    return `R$ ${(value / 1_000_000).toFixed(2).replace(".", ",")} mi`;
  }
  if (abs >= 1_000) {
    return `R$ ${(value / 1_000).toFixed(1).replace(".", ",")} mil`;
  }
  return `R$ ${value.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function QuickTile({ tile }: { tile: Tile }) {
  return (
    <Link
      to={tile.url}
      className="group flex flex-col items-center justify-center gap-2 rounded-lg border border-border/60 bg-card p-4 text-center transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:bg-accent hover:shadow-md focus:outline-none focus:ring-2 focus:ring-ring"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-md bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
        <tile.icon className="h-7 w-7" />
      </div>
      <span className="line-clamp-2 text-xs font-medium text-foreground">{tile.title}</span>
    </Link>
  );
}

function DatePicker({
  value,
  onChange,
  placeholder,
}: {
  value?: Date;
  onChange: (date?: Date) => void;
  placeholder?: string;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "w-[150px] justify-start text-left font-normal",
            !value && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
          {value ? format(value, "dd/MM/yyyy", { locale: ptBR }) : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={onChange}
          initialFocus
          locale={ptBR}
          className="p-3 pointer-events-auto"
        />
      </PopoverContent>
    </Popover>
  );
}

function DashboardPage() {
  const [startDate, setStartDate] = useState<Date | undefined>(DEFAULT_START);
  const [endDate, setEndDate] = useState<Date | undefined>(DEFAULT_END);

  const filteredChartData = useMemo(() => {
    return CHART_DATA_WITH_DATES.filter((d) => {
      if (startDate) {
        const start = startOfMonth(startDate);
        if (d.date < start) return false;
      }
      if (endDate) {
        const end = endOfMonth(endDate);
        if (d.date > end) return false;
      }
      return true;
    });
  }, [startDate, endDate]);

  const stats = useMemo(() => {
    const totalVendasMil = filteredChartData.reduce((sum, d) => sum + d.vendas, 0);
    const totalVendas = totalVendasMil * 1000;
    const fullMonths = CHART_DATA_WITH_DATES.length;
    const monthsCount = filteredChartData.length || 1;
    const scale = monthsCount / fullMonths;

    return [
      {
        label: "Clientes cadastrados",
        value: Math.round(1284 * scale).toLocaleString("pt-BR"),
        delta: "+4,2%",
        up: true,
        icon: Users,
        hint: "vs. período anterior",
      },
      {
        label: "Representadas",
        value: Math.round(37 * Math.max(0.5, scale)).toString(),
        delta: "+2",
        up: true,
        icon: Building2,
        hint: "novas no período",
      },
      {
        label: "Pedidos no período",
        value: Math.round(412 * scale).toLocaleString("pt-BR"),
        delta: "+8,7%",
        up: true,
        icon: CartIcon,
        hint: "vs. período anterior",
      },
      {
        label: "Vendas no período",
        value: formatCurrency(totalVendas),
        delta: "+12,3%",
        up: true,
        icon: DollarSign,
        hint: "faturamento",
      },
      {
        label: "Comissões",
        value: formatCurrency(totalVendas * 0.1),
        delta: "+6,1%",
        up: true,
        icon: Wallet,
        hint: "previstas",
      },
      {
        label: "Pedidos pendentes",
        value: Math.round(23 * Math.max(0.3, scale)).toString(),
        delta: "-3",
        up: false,
        icon: ClipboardList,
        hint: "aguardando aprovação",
      },
    ];
  }, [filteredChartData]);

  const hasActiveFilter =
    startDate?.getTime() !== DEFAULT_START.getTime() ||
    endDate?.getTime() !== DEFAULT_END.getTime();

  const handleReset = () => {
    setStartDate(DEFAULT_START);
    setEndDate(DEFAULT_END);
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="Painel Principal"
        description="Acesso rápido e visão geral do desempenho comercial deste mês."
        breadcrumbs={[{ label: "Início", to: "/" }, { label: "Painel Principal" }]}
      />

      <div className="rounded-xl border border-border/60 bg-card p-6 shadow-sm">
        <div className="space-y-6">
          {GROUPS.map((group) => (
            <section key={group.label}>
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {group.label}
              </h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
                {group.items.map((tile) => (
                  <QuickTile key={tile.title} tile={tile} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>

      <div className="h-6" />

      <section className="space-y-4 rounded-xl border border-border/60 bg-muted/40 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Visão geral do mês
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Filtre por período para atualizar os indicadores e o gráfico.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <DatePicker
              value={startDate}
              onChange={setStartDate}
              placeholder="Data inicial"
            />
            <span className="text-sm text-muted-foreground">até</span>
            <DatePicker
              value={endDate}
              onChange={setEndDate}
              placeholder="Data final"
            />
            {hasActiveFilter && (
              <Button variant="ghost" size="sm" onClick={handleReset} className="gap-1">
                <X className="h-4 w-4" />
                Limpar
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {stats.map((s) => (
            <Card key={s.label} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="min-w-0">
                    <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      {s.label}
                    </div>
                    <div className="mt-2 text-2xl font-semibold tracking-tight">{s.value}</div>
                  </div>
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <s.icon className="h-4 w-4" />
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-1 text-xs">
                  <span
                    className={`inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 font-medium ${
                      s.up ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
                    }`}
                  >
                    {s.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                    {s.delta}
                  </span>
                  <span className="text-muted-foreground">{s.hint}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base">
                Vendas ({startDate && endDate
                  ? `${format(startDate, "dd/MM/yyyy")} – ${format(endDate, "dd/MM/yyyy")}`
                  : "período selecionado"})
              </CardTitle>
              <CardDescription>Faturamento em milhares de reais.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={filteredChartData} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
                    <defs>
                      <linearGradient id="gradVendas" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.35} />
                        <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                    <XAxis dataKey="mes" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} width={40} />
                    <Tooltip
                      contentStyle={{
                        background: "var(--popover)",
                        border: "1px solid var(--border)",
                        borderRadius: 8,
                        fontSize: 12,
                      }}
                      formatter={(v: number) => [`R$ ${v} mil`, "Vendas"]}
                    />
                    <Area
                      type="monotone"
                      dataKey="vendas"
                      stroke="var(--primary)"
                      strokeWidth={2}
                      fill="url(#gradVendas)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Activity className="h-4 w-4 text-primary" /> Atividades recentes
              </CardTitle>
              <CardDescription>Eventos do time comercial.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {ATIVIDADES.map((a, i) => (
                  <li key={i} className="flex items-start gap-3 border-b border-border pb-3 last:border-0 last:pb-0">
                    <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                    <div className="min-w-0 flex-1">
                      <div className="text-sm">
                        <span className="font-medium">{a.quem}</span>{" "}
                        <span className="text-muted-foreground">{a.acao}</span>{" "}
                        <span className="font-medium">{a.alvo}</span>
                      </div>
                      <div className="mt-1 flex items-center gap-2">
                        <Badge variant="secondary" className="h-5 text-[10px]">{a.tag}</Badge>
                        <span className="text-[11px] text-muted-foreground">{a.quando}</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
