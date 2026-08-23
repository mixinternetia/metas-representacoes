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
  FileUp,
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
import { CIDADES_LIST, UFS, VENDEDORES_LIST, type Cliente } from "@/data/mock-clientes";
import { clientesStore } from "@/store/clientes-store";
import { newId } from "@/store/entity-store";
import { formatDate } from "@/lib/masks";

export const Route = createFileRoute("/clientes/")({
  head: () => ({
    meta: [
      { title: "Clientes — Metas Representações" },
      { name: "description", content: "Consulta e gerenciamento de clientes cadastrados." },
      { property: "og:title", content: "Clientes — Metas Representações" },
      { property: "og:description", content: "Consulta e gerenciamento de clientes cadastrados." },
    ],
  }),
  component: ClientesListPage,
});

interface Filtros {
  codigo: string;
  razao: string;
  fantasia: string;
  cnpj: string;
  vendedor: string;
  cidade: string;
  uf: string;
  situacao: string;
}

const EMPTY_FILTROS: Filtros = {
  codigo: "",
  razao: "",
  fantasia: "",
  cnpj: "",
  vendedor: "all",
  cidade: "all",
  uf: "all",
  situacao: "all",
};

function ClientesListPage() {
  const navigate = useNavigate();
  const clientes = clientesStore.useAll();
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
    return clientes.filter((c) => {
      if (filtros.codigo && !c.codigo.includes(filtros.codigo.trim())) return false;
      if (filtros.razao && !c.razaoSocial.toLowerCase().includes(filtros.razao.toLowerCase())) return false;
      if (filtros.fantasia && !c.nomeFantasia.toLowerCase().includes(filtros.fantasia.toLowerCase())) return false;
      if (filtros.cnpj && !c.cnpj.replace(/\D/g, "").includes(filtros.cnpj.replace(/\D/g, ""))) return false;
      if (filtros.vendedor !== "all" && c.vendedor !== filtros.vendedor) return false;
      if (filtros.cidade !== "all" && c.cidade !== filtros.cidade) return false;
      if (filtros.uf !== "all" && c.uf !== filtros.uf) return false;
      if (filtros.situacao !== "all" && c.situacao !== filtros.situacao) return false;
      if (q) {
        const blob = `${c.codigo} ${c.razaoSocial} ${c.nomeFantasia} ${c.cnpj} ${c.cidade} ${c.uf} ${c.vendedor}`.toLowerCase();
        if (!blob.includes(q)) return false;
      }
      return true;
    });
  }, [clientes, filtros, quickSearch]);

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
    if (selected.length === 0) return toast.warning("Selecione ao menos um cliente");
    clientesStore.setAll(
      clientes.map((c) =>
        selected.includes(c.id) ? { ...c, situacao, atualizadoEm: new Date().toISOString() } : c,
      ),
    );
    toast.success(`${selected.length} cliente(s) ${situacao === "ativo" ? "ativados" : "inativados"}`);
    setSelected([]);
  }

  function duplicate(id: string) {
    const original = clientes.find((c) => c.id === id);
    if (!original) return;
    const now = new Date().toISOString();
    clientesStore.add({
      ...original,
      id: newId("cli"),
      codigo: clientesStore.nextCodigo(),
      razaoSocial: `${original.razaoSocial} (cópia)`,
      criadoEm: now,
      atualizadoEm: now,
    });
    toast.success("Cliente duplicado");
  }

  const columns: Column<Cliente>[] = [
    { key: "codigo", header: "Código", className: "w-20 font-mono text-xs", cell: (c) => c.codigo },
    {
      key: "razao",
      header: "Razão Social",
      cell: (c) => (
        <Link to="/clientes/$id" params={{ id: c.id }} className="font-medium hover:underline">
          {c.razaoSocial}
        </Link>
      ),
    },
    { key: "fantasia", header: "Nome Fantasia", className: "text-muted-foreground", cell: (c) => c.nomeFantasia },
    { key: "cnpj", header: "CNPJ", className: "w-44 font-mono text-xs", cell: (c) => c.cnpj },
    { key: "cidade", header: "Cidade", cell: (c) => c.cidade },
    { key: "uf", header: "UF", className: "w-14", cell: (c) => c.uf },
    { key: "telefone", header: "Telefone", className: "w-36 font-mono text-xs", cell: (c) => c.telefone },
    { key: "vendedor", header: "Vendedor", cell: (c) => c.vendedor },
    { key: "situacao", header: "Situação", className: "w-24", cell: (c) => <StatusBadge situacao={c.situacao} /> },
    {
      key: "criado",
      header: "Cadastro",
      className: "w-28 text-xs text-muted-foreground",
      cell: (c) => formatDate(c.criadoEm),
    },
    {
      key: "atualizado",
      header: "Última alteração",
      className: "w-32 text-xs text-muted-foreground",
      cell: (c) => formatDate(c.atualizadoEm),
    },
  ];

  return (
    <div className="space-y-5">
      <PageHeader
        title="Clientes"
        description="Consulta e gerenciamento de clientes cadastrados."
        breadcrumbs={[{ label: "Dashboard", to: "/" }, { label: "Pessoal" }, { label: "Clientes" }]}
        actions={
          <Button asChild>
            <Link to="/clientes/novo">
              <Plus className="mr-1.5 h-4 w-4" /> Novo Cliente
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
          onClick={() => navigate({ to: "/clientes/$id", params: { id: selected[0] } })}
        >
          <Eye className="mr-1.5 h-4 w-4" /> Visualizar
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={selected.length !== 1}
          onClick={() => navigate({ to: "/clientes/$id/editar", params: { id: selected[0] } })}
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
        <Button variant="outline" size="sm" onClick={() => toast.info("Selecione um arquivo para importar (simulado).")}>
          <FileUp className="mr-1.5 h-4 w-4" /> Importar
        </Button>
        <Button variant="outline" size="sm" onClick={() => setReportsOpen(true)}>
          <FileText className="mr-1.5 h-4 w-4" /> Relatórios
        </Button>
        <FichaCadastralMenu entidade="Clientes" onNova={() => navigate({ to: "/clientes/novo" })} />
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
          <Input value={filtros.codigo} onChange={(e) => setFiltros({ ...filtros, codigo: e.target.value })} placeholder="Ex.: 1023" />
        </Field>
        <Field label="Razão Social">
          <Input value={filtros.razao} onChange={(e) => setFiltros({ ...filtros, razao: e.target.value })} />
        </Field>
        <Field label="Nome Fantasia">
          <Input value={filtros.fantasia} onChange={(e) => setFiltros({ ...filtros, fantasia: e.target.value })} />
        </Field>
        <Field label="CNPJ">
          <Input value={filtros.cnpj} onChange={(e) => setFiltros({ ...filtros, cnpj: e.target.value })} placeholder="00.000.000/0000-00" />
        </Field>
        <Field label="Vendedor">
          <Select value={filtros.vendedor} onValueChange={(v) => setFiltros({ ...filtros, vendedor: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {VENDEDORES_LIST.map((v) => <SelectItem key={v} value={v}>{v}</SelectItem>)}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Cidade">
          <Select value={filtros.cidade} onValueChange={(v) => setFiltros({ ...filtros, cidade: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              {CIDADES_LIST.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
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
        emptyTitle="Nenhum cliente encontrado"
        rowActions={(c) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" aria-label={`Ações de ${c.razaoSocial}`}>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => navigate({ to: "/clientes/$id", params: { id: c.id } })}>
                <Eye className="mr-2 h-4 w-4" /> Visualizar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate({ to: "/clientes/$id/editar", params: { id: c.id } })}>
                <Pencil className="mr-2 h-4 w-4" /> Editar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => duplicate(c.id)}>
                <Copy className="mr-2 h-4 w-4" /> Duplicar
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  clientesStore.update({
                    ...c,
                    situacao: c.situacao === "ativo" ? "inativo" : "ativo",
                    atualizadoEm: new Date().toISOString(),
                  });
                  toast.success(c.situacao === "ativo" ? "Cliente inativado" : "Cliente ativado");
                }}
              >
                {c.situacao === "ativo" ? <Ban className="mr-2 h-4 w-4" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}
                {c.situacao === "ativo" ? "Inativar" : "Ativar"}
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => {
                  setSelected([c.id]);
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
        title="Excluir cliente(s)?"
        description={`${selected.length} registro(s) serão removidos da listagem.`}
        confirmLabel="Excluir"
        destructive
        onConfirm={() => {
          clientesStore.remove(selected);
          toast.success(`${selected.length} cliente(s) excluído(s)`);
          setSelected([]);
          setDeleteOpen(false);
        }}
      />

      <ReportsDialog
        open={reportsOpen}
        onOpenChange={setReportsOpen}
        registros={filtered.length}
        options={[
          { id: "simples", label: "Lista simples de clientes", description: "Nome, cidade e dados de contato." },
          { id: "detalhado", label: "Dados detalhados de cada cliente", description: "Cadastro completo, contatos, sócios e endereços." },
          { id: "volume", label: "Clientes por volume de vendas", description: "Ordenado do maior para o menor faturamento." },
        ]}
      />
    </div>
  );
}
