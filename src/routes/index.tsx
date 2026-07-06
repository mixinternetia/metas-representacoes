import { createFileRoute, Link } from "@tanstack/react-router";
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
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Painel Principal — Metas Representações" },
      { name: "description", content: "Acesso rápido a todos os módulos do sistema Metas Representações." },
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
      { title: "Referências", url: "/referencias", icon: Handshake },
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

function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Painel Principal"
        description="Acesso rápido a todos os módulos do sistema."
        breadcrumbs={[{ label: "Início", to: "/" }, { label: "Painel Principal" }]}
      />

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
  );
}
