import { useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  Building2,
  CheckCircle2,
  Eye,
  FileDown,
  FileText,
  MoreHorizontal,
  Pencil,
  Percent,
  Plus,
  RefreshCw,
  UserCog,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { StatusBadge } from "@/components/shared/status-badge";
import { ReportsDialog } from "@/components/shared/reports-dialog";
import { SummaryCard, SummaryCards } from "@/components/shared/summary-card";
import { UFS } from "@/data/mock-clientes";
import { MOCK_REPRESENTADAS } from "@/data/mock-representadas";
import { comissaoMedia, MOCK_VENDEDORES, type VendedorCadastro } from "@/data/mock-vendedores";
import { formatDate, formatPercent, maskCPF } from "@/lib/masks";

export const Route = createFileRoute("/vendedores/")({
  head: () => ({
    meta: [
      { title: "Vendedores — Metas Representações" },
      { name: "description", content: "Consulta dos vendedores habilitados no sistema e suas comissões." },
      { property: "og:title", content: "Vendedores — Metas Representações" },
      { property: "og:description", content: "Consulta dos vendedores habilitados no sistema e suas comissões." },
    ],
  }),
  component: VendedoresListPage,
});

interface Filtros {
  codigo: string;
  nome: string;
  cpf: string;
  situacao: string;
  cidade: string;
  uf: string;
  representada: string;
}

const EMPTY: Filtros = {
  codigo: "",
  nome: "",
  cpf: "",
  situacao: "all",
  cidade: "",
  uf: "all",
  representada: "all",
};

const EM_BREVE = "Funcionalidade disponível na próxima etapa.";

function VendedoresListPage() {
  const navigate = useNavigate();
  const [filtros, setFiltros] = useState<Filtros>(EMPTY);
  const [quickSearch, setQuickSearch] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [reportsOpen, setReportsOpen] = useState(false);

  const rows = MOCK_VENDEDORES;

  const filtered = useMemo(() => {
    const q = quickSearch.trim().toLowerCase();
    return rows.filter((v) => {
      if (filtros.codigo && !v.codigo.includes(filtros.codigo.trim())) return false;
      if (filtros.nome && !v.nome.toLowerCase().includes(filtros.nome.toLowerCase())) return false;
      if (filtros.cpf && !v.cpf.replace(/\D/g, "").includes(filtros.cpf.replace(/\D/g, ""))) return false;
      if (filtros.situacao !== "all" && v.situacao !== filtros.situacao) return false;
      if (filtros.cidade && !v.cidade.toLowerCase().includes(filtros.cidade.toLowerCase())) return false;
      if (filtros.uf !== "all" && v.uf !== filtros.uf) return false;
      if (filtros.representada !== "all" && !v.comissoes.some((c) => c.representadaId === filtros.representada))
        return false;
      if (q) {
        const blob = `${v.codigo} ${v.nome} ${v.cpf} ${v.email} ${v.cidade} ${v.uf}`.toLowerCase();
        if (!blob.includes(q)) return false;
      }
      return true;
    });
  }, [rows, filtros, quickSearch]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  const ativos = rows.filter((v) => v.situacao === "ativo").length;
  const repsVinculadas = new Set(rows.flatMap((v) => v.comissoes.map((c) => c.representadaId))).size;

  function refresh() {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Lista atualizada");
    }, 600);
  }

  const columns: Column<VendedorCadastro>[] = [
    { key: "codigo", header: "Código", className: "w-20 font-mono text-xs", cell: (v) => v.codigo },
    {
      key: "nome",
      header: "Nome",
      cell: (v) => (
        <Link to="/vendedores/$id" params={{ id: v.id }} className="font-medium hover:underline">
          {v.nome}
        </Link>
      ),
    },
    { key: "cpf", header: "CPF", className: "w-36 font-mono text-xs", cell: (v) => v.cpf },
    { key: "telefone", header: "Telefone", className: "w-36 font-mono text-xs", cell: (v) => v.telefone },
    { key: "email", header: "E-mail", className: "text-xs", cell: (v) => v.email },
    { key: "cidade", header: "Cidade", cell: (v) => v.cidade },
    { key: "uf", header: "UF", className: "w-14", cell: (v) => v.uf },
    { key: "reps", header: "Representadas", className: "w-28", cell: (v) => v.comissoes.length },
    {
      key: "comissao",
      header: "Comissão média",
      className: "w-32",
      cell: (v) => formatPercent(comissaoMedia(v)),
    },
    { key: "situacao", header: "Situação", className: "w-24", cell: (v) => <StatusBadge situacao={v.situacao} /> },
    {
      key: "cadastro",
      header: "Cadastro",
      className: "w-28 text-xs text-muted-foreground",
      cell: (v) => formatDate(v.criadoEm),
    },
  ];

  return (
    <div className="space-y-5">
      <PageHeader
        title="Vendedores"
        description="Consulta e gerenciamento dos vendedores habilitados no sistema."
        breadcrumbs={[{ label: "Dashboard", to: "/" }, { label: "Pessoal" }, { label: "Vendedores" }]}
        actions={
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => toast.info(EM_BREVE)}>
              <FileDown className="mr-1.5 h-4 w-4" /> Exportar
            </Button>
            <Button variant="outline" onClick={() => setReportsOpen(true)}>
              <FileText className="mr-1.5 h-4 w-4" /> Relatórios
            </Button>
            <Button variant="outline" onClick={refresh}>
              <RefreshCw className={`mr-1.5 h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Atualizar
            </Button>
            <Button onClick={() => toast.info(EM_BREVE)}>
              <Plus className="mr-1.5 h-4 w-4" /> Novo Vendedor
            </Button>
          </div>
        }
      />

      <SummaryCards>
        <SummaryCard label="Total de vendedores" value={rows.length} icon={<UserCog className="h-4 w-4" />} />
        <SummaryCard label="Vendedores ativos" value={ativos} icon={<CheckCircle2 className="h-4 w-4" />} />
        <SummaryCard label="Vendedores inativos" value={rows.length - ativos} icon={<XCircle className="h-4 w-4" />} />
        <SummaryCard
          label="Representadas vinculadas"
          value={repsVinculadas}
          hint="Com comissão configurada"
          icon={<Building2 className="h-4 w-4" />}
        />
      </SummaryCards>

      <ActionToolbar>
        <SearchInput
          value={quickSearch}
          onChange={(v) => {
            setQuickSearch(v);
            setPage(1);
          }}
          className="min-w-[220px] flex-1"
        />
        <Button
          variant="outline"
          size="sm"
          disabled={selected.length !== 1}
          onClick={() => navigate({ to: "/vendedores/$id", params: { id: selected[0] } })}
        >
          <Eye className="mr-1.5 h-4 w-4" /> Visualizar
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={selected.length !== 1}
          onClick={() => toast.info("A edição de vendedores será implementada em uma próxima fase.")}
        >
          <Pencil className="mr-1.5 h-4 w-4" /> Editar
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
        <Field label="Nome">
          <Input value={filtros.nome} onChange={(e) => setFiltros({ ...filtros, nome: e.target.value })} />
        </Field>
        <Field label="CPF">
          <Input
            value={filtros.cpf}
            onChange={(e) => setFiltros({ ...filtros, cpf: maskCPF(e.target.value) })}
            placeholder="000.000.000-00"
          />
        </Field>
        <Field label="Situação">
          <Select value={filtros.situacao} onValueChange={(v) => setFiltros({ ...filtros, situacao: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="ativo">Ativo</SelectItem>
              <SelectItem value="inativo">Inativo</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Field label="Cidade">
          <Input value={filtros.cidade} onChange={(e) => setFiltros({ ...filtros, cidade: e.target.value })} />
        </Field>
        <Field label="Estado (UF)">
          <Select value={filtros.uf} onValueChange={(v) => setFiltros({ ...filtros, uf: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {UFS.map((u) => (
                <SelectItem key={u} value={u}>{u}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Representada">
          <Select value={filtros.representada} onValueChange={(v) => setFiltros({ ...filtros, representada: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              {MOCK_REPRESENTADAS.map((r) => (
                <SelectItem key={r.id} value={r.id}>{r.nomeFantasia}</SelectItem>
              ))}
            </SelectContent>
          </Select>
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
        emptyTitle="Nenhum vendedor encontrado"
        rowActions={(v) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" aria-label={`Ações de ${v.nome}`}>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => navigate({ to: "/vendedores/$id", params: { id: v.id } })}>
                <Eye className="mr-2 h-4 w-4" /> Visualizar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast.info("A edição de vendedores será implementada em uma próxima fase.")}>
                <Pencil className="mr-2 h-4 w-4" /> Editar
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setReportsOpen(true)}>
                <FileText className="mr-2 h-4 w-4" /> Relatórios
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast.info(EM_BREVE)}>
                <Percent className="mr-2 h-4 w-4" /> Configurar comissões
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      />

      <ReportsDialog
        open={reportsOpen}
        onOpenChange={setReportsOpen}
        registros={filtered.length}
        options={[
          { id: "simples", label: "Lista simples", description: "Dados de contato dos vendedores." },
          {
            id: "detalhado",
            label: "Relatório detalhado",
            description: "Todos os dados, comissões por representada e endereços.",
          },
        ]}
      />
    </div>
  );
}
