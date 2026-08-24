import { useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  Ban,
  CheckCircle2,
  Copy,
  Eye,
  FileDown,
  FileText,
  MoreHorizontal,
  Pencil,
  Plus,
  RefreshCw,
  Trash2,
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
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { ReportsDialog } from "@/components/shared/reports-dialog";
import { FichaCadastralMenu } from "@/components/shared/ficha-cadastral-menu";
import { UFS } from "@/data/mock-clientes";
import type { Representada } from "@/data/mock-representadas";
import { representadasStore } from "@/store/representadas-store";
import { newId } from "@/store/entity-store";
import { formatDate, formatPercent } from "@/lib/masks";

export const Route = createFileRoute("/representadas/")({
  head: () => ({
    meta: [
      { title: "Representadas — Metas Representações" },
      { name: "description", content: "Consulta e gerenciamento de representadas e fornecedores." },
      { property: "og:title", content: "Representadas — Metas Representações" },
      { property: "og:description", content: "Consulta e gerenciamento de representadas e fornecedores." },
    ],
  }),
  component: RepresentadasListPage,
});

interface Filtros {
  codigo: string;
  nome: string;
  cnpj: string;
  uf: string;
  situacao: string;
}

const EMPTY_FILTROS: Filtros = { codigo: "", nome: "", cnpj: "", uf: "all", situacao: "all" };

function RepresentadasListPage() {
  const navigate = useNavigate();
  const representadas = representadasStore.useAll();
  const [filtros, setFiltros] = useState<Filtros>(EMPTY_FILTROS);
  const [quickSearch, setQuickSearch] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [reportsOpen, setReportsOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = quickSearch.trim().toLowerCase();
    return representadas.filter((r) => {
      if (filtros.codigo && !r.codigo.includes(filtros.codigo.trim())) return false;
      if (filtros.nome) {
        const n = filtros.nome.toLowerCase();
        if (!r.nome.toLowerCase().includes(n) && !r.nomeFantasia.toLowerCase().includes(n)) return false;
      }
      if (filtros.cnpj && !r.cnpj.replace(/\D/g, "").includes(filtros.cnpj.replace(/\D/g, ""))) return false;
      if (filtros.uf !== "all" && r.uf !== filtros.uf) return false;
      if (filtros.situacao !== "all" && r.situacao !== filtros.situacao) return false;
      if (q) {
        const blob = `${r.codigo} ${r.nome} ${r.nomeFantasia} ${r.cnpj} ${r.cidade} ${r.uf}`.toLowerCase();
        if (!blob.includes(q)) return false;
      }
      return true;
    });
  }, [representadas, filtros, quickSearch]);

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

  function changeSituacao(situacao: "ativo" | "inativo") {
    if (selected.length === 0) return toast.warning("Selecione ao menos uma representada");
    representadasStore.setAll(
      representadas.map((r) =>
        selected.includes(r.id) ? { ...r, situacao, atualizadoEm: new Date().toISOString() } : r,
      ),
    );
    toast.success(`${selected.length} registro(s) ${situacao === "ativo" ? "ativados" : "inativados"}`);
    setSelected([]);
  }

  function duplicate(id: string) {
    const original = representadas.find((r) => r.id === id);
    if (!original) return;
    const now = new Date().toISOString();
    representadasStore.add({
      ...original,
      id: newId("rep"),
      codigo: representadasStore.nextCodigo(),
      nome: `${original.nome} (cópia)`,
      criadoEm: now,
      atualizadoEm: now,
    });
    toast.success("Representada duplicada");
  }

  const columns: Column<Representada>[] = [
    { key: "codigo", header: "Código", className: "w-20 font-mono text-xs", cell: (r) => r.codigo },
    {
      key: "nome",
      header: "Razão Social",
      cell: (r) => (
        <Link to="/representadas/$id" params={{ id: r.id }} className="font-medium hover:underline">
          {r.nome}
        </Link>
      ),
    },
    { key: "fantasia", header: "Nome Fantasia", className: "text-muted-foreground", cell: (r) => r.nomeFantasia },
    { key: "cnpj", header: "CNPJ", className: "w-44 font-mono text-xs", cell: (r) => r.cnpj },
    { key: "cidade", header: "Cidade", cell: (r) => r.cidade },
    { key: "uf", header: "UF", className: "w-14", cell: (r) => r.uf },
    { key: "telefone", header: "Telefone", className: "w-36 font-mono text-xs", cell: (r) => r.telefone },
    { key: "comissao", header: "Comissão", className: "w-24", cell: (r) => formatPercent(r.comissaoPadrao) },
    { key: "situacao", header: "Situação", className: "w-24", cell: (r) => <StatusBadge situacao={r.situacao} /> },
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
        title="Representadas"
        description="Consulta e gerenciamento das empresas representadas."
        breadcrumbs={[{ label: "Dashboard", to: "/" }, { label: "Pessoal" }, { label: "Representadas" }]}
        actions={
          <Button asChild>
            <Link to="/representadas/novo">
              <Plus className="mr-1.5 h-4 w-4" /> Nova Representada
            </Link>
          </Button>
        }
      />

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
          onClick={() => navigate({ to: "/representadas/$id", params: { id: selected[0] } })}
        >
          <Eye className="mr-1.5 h-4 w-4" /> Visualizar
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={selected.length !== 1}
          onClick={() => navigate({ to: "/representadas/$id/editar", params: { id: selected[0] } })}
        >
          <Pencil className="mr-1.5 h-4 w-4" /> Editar
        </Button>
        <Button variant="outline" size="sm" disabled={selected.length !== 1} onClick={() => duplicate(selected[0])}>
          <Copy className="mr-1.5 h-4 w-4" /> Duplicar
        </Button>
        <Button variant="outline" size="sm" disabled={selected.length === 0} onClick={() => changeSituacao("ativo")}>
          <CheckCircle2 className="mr-1.5 h-4 w-4" /> Ativar
        </Button>
        <Button variant="outline" size="sm" disabled={selected.length === 0} onClick={() => changeSituacao("inativo")}>
          <Ban className="mr-1.5 h-4 w-4" /> Inativar
        </Button>
        <Button variant="outline" size="sm" disabled={selected.length === 0} onClick={() => setDeleteOpen(true)}>
          <Trash2 className="mr-1.5 h-4 w-4" /> Excluir
        </Button>
        <Button variant="outline" size="sm" onClick={() => toast.info("Exportação iniciada (simulada).")}>
          <FileDown className="mr-1.5 h-4 w-4" /> Exportar
        </Button>
        <Button variant="outline" size="sm" onClick={() => setReportsOpen(true)}>
          <FileText className="mr-1.5 h-4 w-4" /> Relatórios
        </Button>
        <FichaCadastralMenu entidade="Representadas" onNova={() => navigate({ to: "/representadas/novo" })} />
        <Button variant="outline" size="sm" onClick={refresh}>
          <RefreshCw className={`mr-1.5 h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Atualizar
        </Button>
      </ActionToolbar>

      <FilterPanel
        onSearch={() => {
          setPage(1);
          toast.success(`${filtered.length} resultado(s)`);
        }}
        onClear={() => {
          setFiltros(EMPTY_FILTROS);
          setQuickSearch("");
          setPage(1);
        }}
      >
        <Field label="Código">
          <Input value={filtros.codigo} onChange={(e) => setFiltros({ ...filtros, codigo: e.target.value })} />
        </Field>
        <Field label="Nome / Fantasia">
          <Input value={filtros.nome} onChange={(e) => setFiltros({ ...filtros, nome: e.target.value })} />
        </Field>
        <Field label="CNPJ">
          <Input
            value={filtros.cnpj}
            onChange={(e) => setFiltros({ ...filtros, cnpj: e.target.value })}
            placeholder="00.000.000/0000-00"
          />
        </Field>
        <Field label="Estado (UF)">
          <Select value={filtros.uf} onValueChange={(v) => setFiltros({ ...filtros, uf: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {UFS.map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}
            </SelectContent>
          </Select>
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
        emptyTitle="Nenhuma representada encontrada"
        rowActions={(r) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" aria-label={`Ações de ${r.nome}`}>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => navigate({ to: "/representadas/$id", params: { id: r.id } })}>
                <Eye className="mr-2 h-4 w-4" /> Visualizar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate({ to: "/representadas/$id/editar", params: { id: r.id } })}>
                <Pencil className="mr-2 h-4 w-4" /> Editar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => duplicate(r.id)}>
                <Copy className="mr-2 h-4 w-4" /> Duplicar
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  representadasStore.update({
                    ...r,
                    situacao: r.situacao === "ativo" ? "inativo" : "ativo",
                    atualizadoEm: new Date().toISOString(),
                  });
                  toast.success(r.situacao === "ativo" ? "Representada inativada" : "Representada ativada");
                }}
              >
                {r.situacao === "ativo" ? <Ban className="mr-2 h-4 w-4" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}
                {r.situacao === "ativo" ? "Inativar" : "Ativar"}
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => {
                  setSelected([r.id]);
                  setDeleteOpen(true);
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" /> Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Excluir representada(s)?"
        description={`${selected.length} registro(s) serão removidos da listagem.`}
        confirmLabel="Excluir"
        destructive
        onConfirm={() => {
          representadasStore.remove(selected);
          toast.success(`${selected.length} registro(s) excluído(s)`);
          setSelected([]);
          setDeleteOpen(false);
        }}
      />

      <ReportsDialog
        open={reportsOpen}
        onOpenChange={setReportsOpen}
        registros={filtered.length}
        options={[
          { id: "simples", label: "Lista simples de representadas", description: "Nome, cidade e contato." },
          { id: "detalhado", label: "Dados detalhados", description: "Cadastro completo com contatos e endereços." },
          { id: "comissao", label: "Comissões por representada", description: "Percentual padrão de cada representada." },
        ]}
      />
    </div>
  );
}
