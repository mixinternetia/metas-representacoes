import { useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  Boxes,
  Building2,
  CheckCircle2,
  Eye,
  FileDown,
  FileSpreadsheet,
  MoreHorizontal,
  Package,
  Percent,
  Plus,
  RefreshCw,
  Settings2,
  TrendingUp,
  Upload,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PageHeader } from "@/components/layout/page-header";
import { Field } from "@/components/shared/form-section";
import { ActionToolbar, FilterPanel, SearchInput } from "@/components/shared/filter-panel";
import { DataTable, type Column } from "@/components/shared/data-table";
import { SummaryCard, SummaryCards } from "@/components/shared/summary-card";
import {
  CopyPricesDialog,
  GeneralPriceChangesDialog,
  SpreadsheetDialog,
  avisoProximaFase,
} from "@/components/precos/price-dialogs";
import { MOCK_REPRESENTADAS } from "@/data/mock-representadas";
import { GRUPOS_PRODUTO, MOCK_PRODUTOS, PRODUTOS_KPI, formatBRL, type Produto } from "@/data/mock-produtos";

export const Route = createFileRoute("/produtos/")({
  head: () => ({
    meta: [
      { title: "Produtos — Metas Representações" },
      {
        name: "description",
        content: "Consulta e gerenciamento dos produtos comercializados pelas representadas, com preço atual.",
      },
      { property: "og:title", content: "Produtos — Metas Representações" },
      {
        property: "og:description",
        content: "Consulta e gerenciamento dos produtos comercializados pelas representadas, com preço atual.",
      },
    ],
  }),
  component: ProdutosListPage,
});

interface Filtros {
  codigo: string;
  representada: string;
  descricao: string;
  codigoFabrica: string;
  grupo: string;
  codigoBarras: string;
  ncm: string;
  emLinha: string;
  precoMin: string;
  precoMax: string;
}

const EMPTY: Filtros = {
  codigo: "",
  representada: "all",
  descricao: "",
  codigoFabrica: "",
  grupo: "all",
  codigoBarras: "",
  ncm: "",
  emLinha: "all",
  precoMin: "",
  precoMax: "",
};

function ProdutosListPage() {
  const navigate = useNavigate();
  const [filtros, setFiltros] = useState<Filtros>(EMPTY);
  const [quickSearch, setQuickSearch] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [copyOpen, setCopyOpen] = useState(false);
  const [geralOpen, setGeralOpen] = useState(false);
  const [planilhaOpen, setPlanilhaOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = quickSearch.trim().toLowerCase();
    const min = Number(filtros.precoMin.replace(",", ".")) || 0;
    const max = Number(filtros.precoMax.replace(",", ".")) || Infinity;
    return MOCK_PRODUTOS.filter((p) => {
      if (filtros.codigo && !p.codigo.includes(filtros.codigo.trim())) return false;
      if (filtros.representada !== "all" && p.representadaId !== filtros.representada) return false;
      if (filtros.descricao && !p.descricao.toLowerCase().includes(filtros.descricao.toLowerCase())) return false;
      if (filtros.codigoFabrica && !p.codigoFabrica.toLowerCase().includes(filtros.codigoFabrica.toLowerCase()))
        return false;
      if (filtros.grupo !== "all" && p.grupo !== filtros.grupo) return false;
      if (filtros.codigoBarras && !p.codigoBarras.includes(filtros.codigoBarras.trim())) return false;
      if (filtros.ncm && !p.ncm.includes(filtros.ncm.trim())) return false;
      if (filtros.emLinha !== "all" && p.emLinha !== (filtros.emLinha === "sim")) return false;
      if (p.precoAtual < min || p.precoAtual > max) return false;
      if (q) {
        const blob = `${p.codigo} ${p.descricao} ${p.representada} ${p.codigoFabrica} ${p.codigoBarras} ${p.ncm}`.toLowerCase();
        if (!blob.includes(q)) return false;
      }
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

  const columns: Column<Produto>[] = [
    { key: "codigo", header: "Código", className: "w-20 font-mono text-xs", cell: (p) => p.codigo },
    { key: "representada", header: "Representada", cell: (p) => p.representada },
    {
      key: "descricao",
      header: "Descrição",
      cell: (p) => (
        <Link to="/produtos/$id" params={{ id: p.id }} className="font-medium hover:underline">
          {p.descricao}
        </Link>
      ),
    },
    { key: "embalagem", header: "Embalagem", className: "text-muted-foreground", cell: (p) => p.embalagem },
    { key: "fabrica", header: "Cód. fábrica", className: "w-28 font-mono text-xs", cell: (p) => p.codigoFabrica },
    { key: "grupo", header: "Grupo", className: "w-28", cell: (p) => p.grupo },
    { key: "barras", header: "Cód. barras", className: "w-36 font-mono text-xs", cell: (p) => p.codigoBarras },
    { key: "ncm", header: "NCM", className: "w-28 font-mono text-xs", cell: (p) => p.ncm },
    { key: "estoque", header: "Estoque", className: "w-20 tabular-nums", cell: (p) => p.estoque },
    {
      key: "emLinha",
      header: "Em linha",
      className: "w-24",
      cell: (p) =>
        p.emLinha ? (
          <Badge className="border-success/30 bg-success/10 text-success hover:bg-success/15">Sim</Badge>
        ) : (
          <Badge variant="secondary" className="text-muted-foreground">Não</Badge>
        ),
    },
    {
      key: "preco",
      header: "Preço atual",
      className: "w-28 text-right tabular-nums",
      cell: (p) => formatBRL(p.precoAtual),
    },
  ];

  return (
    <div className="space-y-5">
      <PageHeader
        title="Produtos"
        description="Consulta e gerenciamento dos produtos comercializados pelas representadas."
        breadcrumbs={[{ label: "Dashboard", to: "/" }, { label: "Vendas" }, { label: "Produtos" }]}
        actions={
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={avisoProximaFase}>
              <Upload className="mr-1.5 h-4 w-4" /> Importar
            </Button>
            <Button variant="outline" onClick={() => setPlanilhaOpen(true)}>
              <FileDown className="mr-1.5 h-4 w-4" /> Exportar
            </Button>
            <Button variant="outline" onClick={() => setGeralOpen(true)}>
              <Settings2 className="mr-1.5 h-4 w-4" /> Alterações Gerais
            </Button>
            <Button variant="outline" onClick={refresh}>
              <RefreshCw className={`mr-1.5 h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Atualizar
            </Button>
            <Button onClick={avisoProximaFase}>
              <Plus className="mr-1.5 h-4 w-4" /> Novo Produto
            </Button>
          </div>
        }
      />

      <SummaryCards>
        <SummaryCard label="Total de Produtos" value={PRODUTOS_KPI.total.toLocaleString("pt-BR")} icon={<Package className="h-4 w-4" />} />
        <SummaryCard label="Produtos Ativos" value={PRODUTOS_KPI.ativos.toLocaleString("pt-BR")} icon={<CheckCircle2 className="h-4 w-4" />} />
        <SummaryCard label="Fora de Linha" value={PRODUTOS_KPI.foraLinha} icon={<XCircle className="h-4 w-4" />} />
        <SummaryCard label="Representadas" value={PRODUTOS_KPI.representadas} icon={<Building2 className="h-4 w-4" />} />
      </SummaryCards>

      <SummaryCards>
        <SummaryCard
          label="Com preço atualizado"
          value={PRODUTOS_KPI.precoAtualizado.toLocaleString("pt-BR")}
          hint="Preços revisados nos últimos 30 dias"
          icon={<TrendingUp className="h-4 w-4" />}
        />
      </SummaryCards>

      <ActionToolbar>
        <SearchInput
          value={quickSearch}
          onChange={(v) => {
            setQuickSearch(v);
            setPage(1);
          }}
          placeholder="Busca rápida por código, descrição ou NCM..."
          className="min-w-[220px] flex-1"
        />
        <Button
          variant="outline"
          size="sm"
          disabled={selected.length !== 1}
          onClick={() => navigate({ to: "/produtos/$id", params: { id: selected[0] } })}
        >
          <Eye className="mr-1.5 h-4 w-4" /> Visualizar
        </Button>
        <Button variant="outline" size="sm" onClick={() => setCopyOpen(true)}>
          <Percent className="mr-1.5 h-4 w-4" /> Copiar preços
        </Button>
        <Button variant="outline" size="sm" onClick={() => setPlanilhaOpen(true)}>
          <FileSpreadsheet className="mr-1.5 h-4 w-4" /> Planilha de Produtos
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
        <Field label="Código">
          <Input value={filtros.codigo} onChange={(e) => setFiltros({ ...filtros, codigo: e.target.value })} />
        </Field>
        <Field label="Representada" hint="Busque por código, CNPJ ou nome">
          <Select value={filtros.representada} onValueChange={(v) => setFiltros({ ...filtros, representada: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              {MOCK_REPRESENTADAS.map((r) => (
                <SelectItem key={r.id} value={r.id}>
                  {r.codigo} · {r.nomeFantasia} · {r.cnpj}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Descrição">
          <Input value={filtros.descricao} onChange={(e) => setFiltros({ ...filtros, descricao: e.target.value })} />
        </Field>
        <Field label="Código na fábrica">
          <Input
            value={filtros.codigoFabrica}
            onChange={(e) => setFiltros({ ...filtros, codigoFabrica: e.target.value })}
          />
        </Field>
        <Field label="Grupo">
          <Select value={filtros.grupo} onValueChange={(v) => setFiltros({ ...filtros, grupo: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {GRUPOS_PRODUTO.map((g) => (
                <SelectItem key={g} value={g}>{g}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Código de barras">
          <Input
            value={filtros.codigoBarras}
            onChange={(e) => setFiltros({ ...filtros, codigoBarras: e.target.value })}
          />
        </Field>
        <Field label="NCM">
          <Input value={filtros.ncm} onChange={(e) => setFiltros({ ...filtros, ncm: e.target.value })} />
        </Field>
        <Field label="Em linha?">
          <Select value={filtros.emLinha} onValueChange={(v) => setFiltros({ ...filtros, emLinha: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="sim">Sim</SelectItem>
              <SelectItem value="nao">Não</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Field label="Preço mínimo">
          <Input
            value={filtros.precoMin}
            onChange={(e) => setFiltros({ ...filtros, precoMin: e.target.value })}
            inputMode="decimal"
            placeholder="0,00"
          />
        </Field>
        <Field label="Preço máximo">
          <Input
            value={filtros.precoMax}
            onChange={(e) => setFiltros({ ...filtros, precoMax: e.target.value })}
            inputMode="decimal"
            placeholder="0,00"
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
        emptyTitle="Nenhum produto encontrado"
        rowActions={(p) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" aria-label={`Ações de ${p.descricao}`}>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => navigate({ to: "/produtos/$id", params: { id: p.id } })}>
                <Eye className="mr-2 h-4 w-4" /> Visualizar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCopyOpen(true)}>
                <Percent className="mr-2 h-4 w-4" /> Copiar preços
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setGeralOpen(true)}>
                <Settings2 className="mr-2 h-4 w-4" /> Alterações gerais
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setPlanilhaOpen(true)}>
                <Boxes className="mr-2 h-4 w-4" /> Planilha de produtos
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      />

      <CopyPricesDialog open={copyOpen} onOpenChange={setCopyOpen} />
      <GeneralPriceChangesDialog open={geralOpen} onOpenChange={setGeralOpen} />
      <SpreadsheetDialog open={planilhaOpen} onOpenChange={setPlanilhaOpen} registros={filtered.length} />
    </div>
  );
}
