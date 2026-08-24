import { useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  Building2,
  CheckCircle2,
  Eye,
  FileDown,
  FileText,
  Map,
  MoreHorizontal,
  Pencil,
  Plus,
  RefreshCw,
  Truck,
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
import { MOCK_TRANSPORTADORAS, type Transportadora } from "@/data/mock-transportadoras";
import { formatDate, maskCNPJ } from "@/lib/masks";

export const Route = createFileRoute("/transportadoras/")({
  head: () => ({
    meta: [
      { title: "Transportadoras — Metas Representações" },
      {
        name: "description",
        content: "Consulta das transportadoras utilizadas nas operações de entrega das representadas.",
      },
      { property: "og:title", content: "Transportadoras — Metas Representações" },
      {
        property: "og:description",
        content: "Consulta das transportadoras utilizadas nas operações de entrega das representadas.",
      },
    ],
  }),
  component: TransportadorasListPage,
});

interface Filtros {
  codigo: string;
  nome: string;
  fantasia: string;
  cnpj: string;
  email: string;
  uf: string;
  cidade: string;
  situacao: string;
}

const EMPTY: Filtros = {
  codigo: "",
  nome: "",
  fantasia: "",
  cnpj: "",
  email: "",
  uf: "all",
  cidade: "",
  situacao: "all",
};

const EM_BREVE = "Funcionalidade disponível na próxima etapa.";

function TransportadorasListPage() {
  const navigate = useNavigate();
  const [filtros, setFiltros] = useState<Filtros>(EMPTY);
  const [quickSearch, setQuickSearch] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [reportsOpen, setReportsOpen] = useState(false);

  const rows = MOCK_TRANSPORTADORAS;

  const filtered = useMemo(() => {
    const q = quickSearch.trim().toLowerCase();
    return rows.filter((t) => {
      if (filtros.codigo && !t.codigo.includes(filtros.codigo.trim())) return false;
      if (filtros.nome && !t.nome.toLowerCase().includes(filtros.nome.toLowerCase())) return false;
      if (filtros.fantasia && !t.nomeFantasia.toLowerCase().includes(filtros.fantasia.toLowerCase())) return false;
      if (filtros.cnpj && !t.cnpj.replace(/\D/g, "").includes(filtros.cnpj.replace(/\D/g, ""))) return false;
      if (filtros.email && !t.email.toLowerCase().includes(filtros.email.toLowerCase())) return false;
      if (filtros.uf !== "all" && t.uf !== filtros.uf) return false;
      if (filtros.cidade && !t.cidade.toLowerCase().includes(filtros.cidade.toLowerCase())) return false;
      if (filtros.situacao !== "all" && t.situacao !== filtros.situacao) return false;
      if (q) {
        const blob = `${t.codigo} ${t.nome} ${t.nomeFantasia} ${t.cnpj} ${t.email} ${t.cidade} ${t.uf}`.toLowerCase();
        if (!blob.includes(q)) return false;
      }
      return true;
    });
  }, [rows, filtros, quickSearch]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  const ativas = rows.filter((t) => t.situacao === "ativo").length;
  const estados = new Set<string>();
  rows.forEach((t) => {
    estados.add(t.uf);
    t.filiais.forEach((f) => estados.add(f.uf));
  });

  function refresh() {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Lista atualizada");
    }, 600);
  }

  const columns: Column<Transportadora>[] = [
    { key: "codigo", header: "Código", className: "w-20 font-mono text-xs", cell: (t) => t.codigo },
    {
      key: "nome",
      header: "Nome",
      cell: (t) => (
        <Link to="/transportadoras/$id" params={{ id: t.id }} className="font-medium hover:underline">
          {t.nome}
        </Link>
      ),
    },
    { key: "fantasia", header: "Nome Fantasia", className: "text-muted-foreground", cell: (t) => t.nomeFantasia },
    { key: "cnpj", header: "CNPJ", className: "w-44 font-mono text-xs", cell: (t) => t.cnpj },
    { key: "email", header: "E-mail", className: "text-xs", cell: (t) => t.email },
    { key: "telefone", header: "Telefone", className: "w-36 font-mono text-xs", cell: (t) => t.telefone },
    { key: "celular", header: "Celular", className: "w-36 font-mono text-xs", cell: (t) => t.celular },
    { key: "cidade", header: "Cidade", cell: (t) => t.cidade },
    { key: "uf", header: "UF", className: "w-14", cell: (t) => t.uf },
    { key: "situacao", header: "Situação", className: "w-24", cell: (t) => <StatusBadge situacao={t.situacao} /> },
    {
      key: "cadastro",
      header: "Cadastro",
      className: "w-28 text-xs text-muted-foreground",
      cell: (t) => formatDate(t.criadoEm),
    },
  ];

  return (
    <div className="space-y-5">
      <PageHeader
        title="Transportadoras"
        description="Consulta e gerenciamento das transportadoras utilizadas nas operações de entrega."
        breadcrumbs={[{ label: "Dashboard", to: "/" }, { label: "Pessoal" }, { label: "Transportadoras" }]}
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
              <Plus className="mr-1.5 h-4 w-4" /> Nova Transportadora
            </Button>
          </div>
        }
      />

      <SummaryCards>
        <SummaryCard label="Total" value={rows.length} hint="Transportadoras cadastradas" icon={<Truck className="h-4 w-4" />} />
        <SummaryCard label="Ativas" value={ativas} hint="Disponíveis para uso" icon={<CheckCircle2 className="h-4 w-4" />} />
        <SummaryCard
          label="Inativas"
          value={rows.length - ativas}
          hint="Bloqueadas para novas entregas"
          icon={<XCircle className="h-4 w-4" />}
        />
        <SummaryCard
          label="Estados atendidos"
          value={estados.size}
          hint="UFs com matriz ou filial"
          icon={<Map className="h-4 w-4" />}
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
          onClick={() => navigate({ to: "/transportadoras/$id", params: { id: selected[0] } })}
        >
          <Eye className="mr-1.5 h-4 w-4" /> Visualizar
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={selected.length !== 1}
          onClick={() => toast.info("A edição de transportadoras será implementada em uma próxima fase.")}
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
        <Field label="Nome Fantasia">
          <Input value={filtros.fantasia} onChange={(e) => setFiltros({ ...filtros, fantasia: e.target.value })} />
        </Field>
        <Field label="CNPJ">
          <Input
            value={filtros.cnpj}
            onChange={(e) => setFiltros({ ...filtros, cnpj: maskCNPJ(e.target.value) })}
            placeholder="00.000.000/0000-00"
          />
        </Field>
        <Field label="E-mail">
          <Input value={filtros.email} onChange={(e) => setFiltros({ ...filtros, email: e.target.value })} />
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
        <Field label="Cidade">
          <Input value={filtros.cidade} onChange={(e) => setFiltros({ ...filtros, cidade: e.target.value })} />
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
        emptyTitle="Nenhuma transportadora encontrada"
        rowActions={(t) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" aria-label={`Ações de ${t.nome}`}>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuItem onClick={() => navigate({ to: "/transportadoras/$id", params: { id: t.id } })}>
                <Eye className="mr-2 h-4 w-4" /> Visualizar
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => toast.info("A edição de transportadoras será implementada em uma próxima fase.")}
              >
                <Pencil className="mr-2 h-4 w-4" /> Editar
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setReportsOpen(true)}>
                <FileText className="mr-2 h-4 w-4" /> Relatórios
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast.info(EM_BREVE)}>
                <Building2 className="mr-2 h-4 w-4" /> Gerenciar filiais
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
          { id: "simples", label: "Lista simples", description: "Dados básicos e contatos das transportadoras." },
          {
            id: "detalhado",
            label: "Relatório detalhado",
            description: "Todos os dados, incluindo filiais, contatos e endereços.",
          },
        ]}
      />
    </div>
  );
}
