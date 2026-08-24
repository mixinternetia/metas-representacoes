import { useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  Building2,
  CheckCircle2,
  Eye,
  FileDown,
  FileSpreadsheet,
  FileText,
  Handshake,
  MoreHorizontal,
  Pencil,
  Plus,
  RefreshCw,
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
import { NovaReferenciaDialog } from "@/components/referencias/referencia-components";
import {
  MOCK_REFERENCIAS_COMERCIAIS,
  RESUMO_REFERENCIAS,
  type ReferenciaComercialCadastro,
} from "@/data/mock-referencias-comerciais";
import { formatDate, maskTelefone } from "@/lib/masks";

export const Route = createFileRoute("/referencias-comerciais/")({
  head: () => ({
    meta: [
      { title: "Referências Comerciais — Metas Representações" },
      {
        name: "description",
        content: "Consulta das referências comerciais utilizadas no cadastro de clientes.",
      },
      { property: "og:title", content: "Referências Comerciais — Metas Representações" },
      {
        property: "og:description",
        content: "Consulta das referências comerciais utilizadas no cadastro de clientes.",
      },
    ],
  }),
  component: ReferenciasComerciaisPage,
});

interface Filtros {
  codigo: string;
  nome: string;
  telefone: string;
  email: string;
  situacao: string;
  cliente: string;
}

const EMPTY: Filtros = { codigo: "", nome: "", telefone: "", email: "", situacao: "all", cliente: "" };

const EXPORT_MSG = "Exportação simulada. A geração do arquivo será implementada em uma próxima fase.";
const EM_BREVE = "Esta funcionalidade será implementada em uma próxima fase.";

function ReferenciasComerciaisPage() {
  const navigate = useNavigate();
  const [filtros, setFiltros] = useState<Filtros>(EMPTY);
  const [quickSearch, setQuickSearch] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [reportsOpen, setReportsOpen] = useState(false);
  const [novaOpen, setNovaOpen] = useState(false);

  const rows = MOCK_REFERENCIAS_COMERCIAIS;

  const filtered = useMemo(() => {
    const q = quickSearch.trim().toLowerCase();
    const onlyDigits = (v: string) => v.replace(/\D/g, "");
    return rows.filter((r) => {
      if (filtros.codigo && !r.codigo.toLowerCase().includes(filtros.codigo.trim().toLowerCase())) return false;
      if (filtros.nome && !r.nome.toLowerCase().includes(filtros.nome.toLowerCase())) return false;
      if (filtros.telefone && !onlyDigits(r.telefone).includes(onlyDigits(filtros.telefone))) return false;
      if (filtros.email && !r.email.toLowerCase().includes(filtros.email.toLowerCase())) return false;
      if (filtros.situacao !== "all" && r.situacao !== filtros.situacao) return false;
      if (filtros.cliente) {
        const alvo = `${r.cliente.codigo} ${r.cliente.razaoSocial} ${r.cliente.nomeFantasia}`.toLowerCase();
        if (!alvo.includes(filtros.cliente.toLowerCase())) return false;
      }
      if (q) {
        const blob = `${r.codigo} ${r.nome} ${r.telefone} ${r.email} ${r.cliente.razaoSocial} ${r.cliente.nomeFantasia} ${r.cidade} ${r.uf}`.toLowerCase();
        if (!blob.includes(q)) return false;
      }
      return true;
    });
  }, [rows, filtros, quickSearch]);

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

  function limpar() {
    setFiltros(EMPTY);
    setQuickSearch("");
    setPage(1);
  }

  const columns: Column<ReferenciaComercialCadastro>[] = [
    { key: "codigo", header: "Código", className: "w-24 font-mono text-xs", cell: (r) => r.codigo },
    {
      key: "nome",
      header: "Nome",
      cell: (r) => (
        <Link
          to="/referencias-comerciais/$id"
          params={{ id: r.id }}
          className="font-medium hover:underline"
        >
          {r.nome}
        </Link>
      ),
    },
    { key: "telefone", header: "Telefone", className: "w-36 font-mono text-xs", cell: (r) => r.telefone },
    { key: "email", header: "E-mail", className: "text-xs", cell: (r) => r.email },
    {
      key: "cliente",
      header: "Cliente vinculado",
      cell: (r) => (
        <span className="text-sm">
          {r.cliente.nomeFantasia}
          <span className="ml-1 font-mono text-xs text-muted-foreground">{r.cliente.codigo}</span>
        </span>
      ),
    },
    { key: "cidade", header: "Cidade", cell: (r) => r.cidade },
    { key: "uf", header: "UF", className: "w-14", cell: (r) => r.uf },
    { key: "situacao", header: "Situação", className: "w-24", cell: (r) => <StatusBadge situacao={r.situacao} /> },
    {
      key: "criado",
      header: "Cadastro",
      className: "w-28 text-xs text-muted-foreground",
      cell: (r) => formatDate(r.criadoEm),
    },
    {
      key: "atualizado",
      header: "Última alteração",
      className: "w-32 text-xs text-muted-foreground",
      cell: (r) => formatDate(r.atualizadoEm),
    },
  ];

  return (
    <div className="space-y-5">
      <PageHeader
        title="Referências Comerciais"
        description="Consulta e gerenciamento das referências comerciais utilizadas no cadastro de clientes."
        breadcrumbs={[
          { label: "Dashboard", to: "/" },
          { label: "Pessoal" },
          { label: "Referências Comerciais" },
        ]}
        actions={
          <div className="flex flex-wrap gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <FileDown className="mr-1.5 h-4 w-4" /> Exportar
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => toast.info(EXPORT_MSG)}>
                  <FileSpreadsheet className="mr-2 h-4 w-4" /> Excel
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toast.info(EXPORT_MSG)}>
                  <FileText className="mr-2 h-4 w-4" /> CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toast.info(EXPORT_MSG)}>
                  <FileText className="mr-2 h-4 w-4" /> PDF
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="outline" onClick={() => setReportsOpen(true)}>
              <FileText className="mr-1.5 h-4 w-4" /> Relatórios
            </Button>
            <Button variant="outline" onClick={refresh}>
              <RefreshCw className={`mr-1.5 h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Atualizar
            </Button>
            <Button onClick={() => setNovaOpen(true)}>
              <Plus className="mr-1.5 h-4 w-4" /> Nova Referência
            </Button>
          </div>
        }
      />

      <SummaryCards>
        <SummaryCard label="Total de referências" value={RESUMO_REFERENCIAS.total} icon={<Handshake className="h-4 w-4" />} />
        <SummaryCard label="Ativas" value={RESUMO_REFERENCIAS.ativas} icon={<CheckCircle2 className="h-4 w-4" />} />
        <SummaryCard label="Inativas" value={RESUMO_REFERENCIAS.inativas} icon={<XCircle className="h-4 w-4" />} />
        <SummaryCard
          label="Clientes vinculados"
          value={RESUMO_REFERENCIAS.clientesVinculados}
          hint="Com pelo menos uma referência"
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
          onClick={() => navigate({ to: "/referencias-comerciais/$id", params: { id: selected[0] } })}
        >
          <Eye className="mr-1.5 h-4 w-4" /> Visualizar
        </Button>
        <Button variant="outline" size="sm" disabled={selected.length !== 1} onClick={() => toast.info(EM_BREVE)}>
          <Pencil className="mr-1.5 h-4 w-4" /> Editar
        </Button>
      </ActionToolbar>

      <FilterPanel
        onSearch={() => {
          setPage(1);
          toast.success(`${filtered.length} resultado(s)`);
        }}
        onClear={limpar}
      >
        <Field label="Código">
          <Input
            value={filtros.codigo}
            onChange={(e) => setFiltros({ ...filtros, codigo: e.target.value })}
            placeholder="REF-001"
          />
        </Field>
        <Field label="Nome">
          <Input value={filtros.nome} onChange={(e) => setFiltros({ ...filtros, nome: e.target.value })} />
        </Field>
        <Field label="Telefone">
          <Input
            value={filtros.telefone}
            onChange={(e) => setFiltros({ ...filtros, telefone: maskTelefone(e.target.value) })}
            placeholder="(84) 99999-0001"
          />
        </Field>
        <Field label="E-mail">
          <Input value={filtros.email} onChange={(e) => setFiltros({ ...filtros, email: e.target.value })} />
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
        <Field label="Cliente vinculado" hint="Código, razão social ou nome fantasia">
          <Input value={filtros.cliente} onChange={(e) => setFiltros({ ...filtros, cliente: e.target.value })} />
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
        emptyTitle="Nenhuma referência comercial encontrada"
        emptyDescription="Ajuste os filtros para ampliar a consulta."
        emptyAction={
          <Button variant="outline" onClick={limpar}>
            Limpar filtros
          </Button>
        }
        rowActions={(r) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" aria-label={`Ações de ${r.nome}`}>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem
                onClick={() => navigate({ to: "/referencias-comerciais/$id", params: { id: r.id } })}
              >
                <Eye className="mr-2 h-4 w-4" /> Visualizar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast.info(EM_BREVE)}>
                <Pencil className="mr-2 h-4 w-4" /> Editar
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setReportsOpen(true)}>
                <FileText className="mr-2 h-4 w-4" /> Relatórios
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast.info(EXPORT_MSG)}>
                <FileDown className="mr-2 h-4 w-4" /> Exportar
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
          { id: "simples", label: "Lista simples", description: "Código, nome, telefone e e-mail das referências." },
          {
            id: "detalhado",
            label: "Relatório detalhado",
            description: "Todos os dados da referência, incluindo cliente vinculado e histórico.",
          },
          {
            id: "por-cliente",
            label: "Referências por cliente",
            description: "Agrupamento das referências comerciais por cliente vinculado.",
          },
        ]}
      />

      <NovaReferenciaDialog open={novaOpen} onOpenChange={setNovaOpen} />
    </div>
  );
}
