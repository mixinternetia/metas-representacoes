import { createFileRoute } from "@tanstack/react-router";
import {
  Users,
  Building2,
  ShoppingCart,
  DollarSign,
  Wallet,
  ClipboardList,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
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
import { PageHeader } from "@/components/layout/page-header";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Metas Representações" },
      { name: "description", content: "Visão geral do desempenho comercial." },
    ],
  }),
  component: DashboardPage,
});

const STATS = [
  { label: "Clientes cadastrados", value: "1.284", delta: "+4,2%", up: true, icon: Users, hint: "vs. mês anterior" },
  { label: "Representadas", value: "37", delta: "+2", up: true, icon: Building2, hint: "novas no mês" },
  { label: "Pedidos do mês", value: "412", delta: "+8,7%", up: true, icon: ShoppingCart, hint: "vs. mês anterior" },
  { label: "Vendas do mês", value: "R$ 1,82 mi", delta: "+12,3%", up: true, icon: DollarSign, hint: "faturamento" },
  { label: "Comissões", value: "R$ 184,5 mil", delta: "+6,1%", up: true, icon: Wallet, hint: "previstas" },
  { label: "Pedidos pendentes", value: "23", delta: "-3", up: false, icon: ClipboardList, hint: "aguardando aprovação" },
];

const CHART_DATA = [
  { mes: "Jan", vendas: 920, pedidos: 220 },
  { mes: "Fev", vendas: 1040, pedidos: 248 },
  { mes: "Mar", vendas: 1180, pedidos: 271 },
  { mes: "Abr", vendas: 1120, pedidos: 264 },
  { mes: "Mai", vendas: 1380, pedidos: 311 },
  { mes: "Jun", vendas: 1450, pedidos: 326 },
  { mes: "Jul", vendas: 1610, pedidos: 360 },
  { mes: "Ago", vendas: 1545, pedidos: 348 },
  { mes: "Set", vendas: 1720, pedidos: 388 },
  { mes: "Out", vendas: 1820, pedidos: 412 },
];

const ATIVIDADES = [
  { quem: "Marina Souza", acao: "fechou pedido", alvo: "#PED-10283 — Aurora Metais", quando: "há 12 min", tag: "Pedido" },
  { quem: "Carlos Andrade", acao: "cadastrou cliente", alvo: "Costa Azul Pescados Ltda", quando: "há 47 min", tag: "Cliente" },
  { quem: "Ricardo Lima", acao: "emitiu NF", alvo: "#NF-008721", quando: "há 1 h", tag: "Nota Fiscal" },
  { quem: "Patrícia Mendes", acao: "atualizou tabela de preços", alvo: "Tabela Sudeste 2025-Q4", quando: "há 2 h", tag: "Tabela" },
  { quem: "Fernanda Castro", acao: "registrou duplicata paga", alvo: "DUP-44218 — R$ 18.420,00", quando: "há 3 h", tag: "Financeiro" },
  { quem: "João Pereira", acao: "criou orçamento", alvo: "#ORC-30482 — Vale Verde", quando: "há 5 h", tag: "Orçamento" },
];

function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Visão geral do desempenho comercial deste mês."
        breadcrumbs={[{ label: "Início", to: "/" }, { label: "Dashboard" }]}
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {STATS.map((s) => (
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
            <CardTitle className="text-base">Vendas (últimos 10 meses)</CardTitle>
            <CardDescription>Faturamento em milhares de reais.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={CHART_DATA} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
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
    </div>
  );
}
