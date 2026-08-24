import { useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  CalendarClock,
  Copy,
  Eye,
  FileDown,
  GitCompareArrows,
  MoreHorizontal,
  Package,
  Plus,
  RefreshCw,
  Tags,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PageHeader } from "@/components/layout/page-header";
import { Field, FormSection } from "@/components/shared/form-section";
import { ActionToolbar, FilterPanel, SearchInput } from "@/components/shared/filter-panel";
import { DataTable, type Column } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { SummaryCard, SummaryCards } from "@/components/shared/summary-card";
import { PriceComparison } from "@/components/precos/price-comparison";
import { avisoProximaFase } from "@/components/precos/price-dialogs";
import { MOCK_TABELAS_PRECOS, TABELAS_KPI, type TabelaPreco } from "@/data/mock-tabelas-precos";
import { formatDate } from "@/lib/masks";

export const Route = createFileRoute("/tabelas-precos/")({
  head: () => ({
    meta: [
      { title: "Tabelas de Preços — Metas Representações" },
      { name: "description", content: "Consulta e gerenciamento das tabelas de preços utilizadas nas vendas." },
      { property: "og:title", content: "Tabelas de Preços — Metas Representações" },
      {
        property: "og:description",
        content: "Consulta e gerenciamento das tabelas de preços utilizadas nas vendas.",
      },
    ],
  }),
  component: TabelasPrecosListPage,
});

interface Filtros {
  nome: string;
  codigo: string;
  representada: string;
  situacao: string;
  atualizacao: string;
}

const EMPTY: Filtros = { nome: "", codigo: "", representada: "all", situacao: "all", atualizacao: "" };

function TabelasPrecosListPage() {
  const navigate = useNavigate();
  const [filtros, setFiltros] = useState<Filtros>(EMPTY);
  const [quickSearch, setQuickSearch] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [compararOpen, setCompararOpen] = useState(false);

  const representadas = Array.from(new Set(MOCK_TABELAS_PRECOS.map((t) => t.representada)));

  const filtered = useMemo(() => {
    const q = quickSearch.trim().toLowerCase();
    return MOCK_TABELAS_PRECOS.filter((t) => {
      if (filtros.nome && !t.nome.toLowerCase().includes(filtros.nome.toLowerCase())) return false;
      if (filtros.codigo && !t.codigo.toLowerCase().includes(filtros.codigo.toLowerCase())) return false;
      if (filtros.representada !== "all" && t.representada !== filtros.representada) return false;
      if (filtros.situacao !== "all" && t.situacao !== filtros.situacao) return false;
      if (filtros.atualizacao && !t.atualizadoEm.startsWith(filtros.atualizacao)) return false;
      if (q && !`${t.codigo} ${t.nome} ${t.representada}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [filtros, quickSearch]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  function refresh() {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Lista atualizada");
    }, 600);
  }

  const columns: Column<TabelaPreco>[] = [
    { key: "codigo", header: "Código", className: "w-24 font-mono text-xs", cell: (t) => t.codigo },
    {
      key: "nome",
      header: "Tabela",
      cell: (t) => (
        <Link to="/tabelas-precos/$id" params={{ id: t.id }} className="font-medium hover:underline">
          {t.nome}
        </Link>
      ),
    },
    { key: "representada", header: "Representada", cell: (t) => t.representada },
    { key: "produtos", header: "Produtos", className: "w-24 tabular-nums", cell: (t) => t.itens.length },
    {
      key: "atualizacao",
      header: "Atualização",
      className: "w-32 text-xs text-muted-foreground",
      cell: (t) => formatDate(t.atualizadoEm),
    },
    { key: "situacao", header: "Situação", className: "w-28", cell: (t) => <StatusBadge situacao={t.situacao} /> },
  ];

  return (
    <div className="space-y-5">
      <PageHeader
        title="Tabelas de Preços"
        description="Consulta e gerenciamento das tabelas de preços utilizadas nas vendas."
        breadcrumbs={[{ label: "Dashboard", to: "/" }, { label: "Vendas" }, { label: "Tabelas de Preços" }]}
        actions={
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={avisoProximaFase}>
              <Copy className="mr-1.5 h-4 w-4" /> Duplicar
            </Button>
            <Button variant="outline" onClick={() => toast.success("Prévia de exportação gerada.")}>
              <FileDown className="mr-1.5 h-4 w-4" /> Exportar
            </Button>
            <Button variant="outline" onClick={refresh}>
              <RefreshCw className={`mr-1.5 h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Atualizar
            </Button>
            <Button onClick={avisoProximaFase}>
              <Plus className="mr-1.5 h-4 w-4" /> Nova Tabela
            </Button>
          </div>
        }
      />

      <SummaryCards>
        <SummaryCard label="Tabelas Ativas" value={TABELAS_KPI.ativas} icon={<Tags className="h-4 w-4" />} />
        <SummaryCard label="Tabelas Inativas" value={TABELAS_KPI.inativas} icon={<XCircle className="h-4 w-4" />} />
        <SummaryCard
          label="Produtos com preço"
          value={TABELAS_KPI.produtosComPreco.toLocaleString("pt-BR")}
          icon={<Package className="h-4 w-4" />}
        />
        <SummaryCard
          label="Última atualização"
          value={TABELAS_KPI.ultimaAtualizacao}
          icon={<CalendarClock className="h-4 w-4" />}
        />
      </SummaryCards>

      <ActionToolbar>
        <SearchInput
          value={quickSearch}
          onChange={(v) => {
            setQuickSearch(v);
            setPage(1);
          }}
          placeholder="Busca rápida por código, tabela ou representada..."
          className="min-w-[220px] flex-1"
        />
        <Button
          variant="outline"
          size="sm"
          disabled={selected.length !== 1}
          onClick={() => navigate({ to: "/tabelas-precos/$id", params: { id: selected[0] } })}
        >
          <Eye className="mr-1.5 h-4 w-4" /> Visualizar
        </Button>
        <Button variant="outline" size="sm" onClick={() => setCompararOpen((v) => !v)}>
          <GitCompareArrows className="mr-1.5 h-4 w-4" /> Comparar Tabelas
        </Button>
      </ActionToolbar>

      <FilterPanel
        onSearch={() => {
          setPage(1);
          toast.success(`${filtered.length} resultado(s)`);
        }}
        onClear={() => {
          setFiltros(EMPTY);
          setQuickSearch("");
          setPage(1);
        }}
      >
        <Field label="Nome da tabela">
          <Input value={filtros.nome} onChange={(e) => setFiltros({ ...filtros, nome: e.target.value })} />
        </Field>
        <Field label="Código">
          <Input value={filtros.codigo} onChange={(e) => setFiltros({ ...filtros, codigo: e.target.value })} />
        </Field>
        <Field label="Representada">
          <Select value={filtros.representada} onValueChange={(v) => setFiltros({ ...filtros, representada: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              {representadas.map((r) => (
                <SelectItem key={r} value={r}>{r}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Situação">
          <Select value={filtros.situacao} onValueChange={(v) => setFiltros({ ...filtros, situacao: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="ativo">Ativa</SelectItem>
              <SelectItem value="inativo">Inativa</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Field label="Data de atualização">
          <Input
            type="date"
            value={filtros.atualizacao}
            onChange={(e) => setFiltros({ ...filtros, atualizacao: e.target.value })}
          />
        </Field>
      </FilterPanel>

      <DataTable
        rows={pageItems}
        columns={columns}
        loading={loading}
        selected={selected}
        onSelectedChange={setSelected}
        page={currentPage}
        perPage={perPage}
        total={filtered.length}
        onPageChange={setPage}
        onPerPageChange={setPerPage}
        emptyTitle="Nenhuma tabela encontrada"
        rowActions={(t) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" aria-label={`Ações de ${t.nome}`}>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => navigate({ to: "/tabelas-precos/$id", params: { id: t.id } })}>
                <Eye className="mr-2 h-4 w-4" /> Visualizar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={avisoProximaFase}>
                <Copy className="mr-2 h-4 w-4" /> Duplicar tabela
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      />

      {compararOpen && (
        <FormSection
          title="Comparar Tabelas"
          description="Comparação demonstrativa de preços entre duas tabelas."
        >
          <PriceComparison />
        </FormSection>
      )}
    </div>
  );
}
