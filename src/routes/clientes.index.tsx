import { useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  Plus,
  Pencil,
  Trash2,
  CheckCircle2,
  XCircle,
  FileDown,
  FileUp,
  Printer,
  RefreshCw,
  Search,
  Eye,
  Copy,
  MoreHorizontal,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { PageHeader } from "@/components/layout/page-header";
import {
  MOCK_CLIENTES,
  UFS,
  VENDEDORES_LIST,
  type Cliente,
} from "@/data/mock-clientes";

export const Route = createFileRoute("/clientes/")({
  head: () => ({
    meta: [
      { title: "Clientes — Metas Representações" },
      { name: "description", content: "Consulta e gerenciamento de clientes cadastrados." },
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
  dataDe: string;
  dataAte: string;
}

const EMPTY_FILTROS: Filtros = {
  codigo: "",
  razao: "",
  fantasia: "",
  cnpj: "",
  vendedor: "all",
  cidade: "",
  uf: "all",
  situacao: "all",
  dataDe: "",
  dataAte: "",
};

function ClientesListPage() {
  const navigate = useNavigate();
  const [clientes, setClientes] = useState<Cliente[]>(MOCK_CLIENTES);
  const [filtros, setFiltros] = useState<Filtros>(EMPTY_FILTROS);
  const [quickSearch, setQuickSearch] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = quickSearch.trim().toLowerCase();
    return clientes.filter((c) => {
      if (filtros.codigo && !c.codigo.includes(filtros.codigo.trim())) return false;
      if (filtros.razao && !c.razaoSocial.toLowerCase().includes(filtros.razao.toLowerCase())) return false;
      if (filtros.fantasia && !c.nomeFantasia.toLowerCase().includes(filtros.fantasia.toLowerCase())) return false;
      if (filtros.cnpj && !c.cnpj.replace(/\D/g, "").includes(filtros.cnpj.replace(/\D/g, ""))) return false;
      if (filtros.vendedor !== "all" && c.vendedor !== filtros.vendedor) return false;
      if (filtros.cidade && !c.cidade.toLowerCase().includes(filtros.cidade.toLowerCase())) return false;
      if (filtros.uf !== "all" && c.uf !== filtros.uf) return false;
      if (filtros.situacao !== "all" && c.situacao !== filtros.situacao) return false;
      if (filtros.dataDe && new Date(c.criadoEm) < new Date(filtros.dataDe)) return false;
      if (filtros.dataAte && new Date(c.criadoEm) > new Date(filtros.dataAte)) return false;
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

  const allChecked = pageItems.length > 0 && pageItems.every((c) => selected.includes(c.id));
  const someChecked = pageItems.some((c) => selected.includes(c.id));

  function toggleAllOnPage(v: boolean) {
    const ids = pageItems.map((c) => c.id);
    setSelected((prev) =>
      v ? Array.from(new Set([...prev, ...ids])) : prev.filter((id) => !ids.includes(id)),
    );
  }

  function refresh() {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Lista atualizada");
    }, 600);
  }

  function changeSituacao(situacao: "ativo" | "inativo") {
    if (selected.length === 0) {
      toast.warning("Selecione ao menos um cliente");
      return;
    }
    setClientes((prev) => prev.map((c) => (selected.includes(c.id) ? { ...c, situacao } : c)));
    toast.success(`${selected.length} cliente(s) ${situacao === "ativo" ? "ativados" : "inativados"}`);
    setSelected([]);
  }

  function confirmDelete() {
    setClientes((prev) => prev.filter((c) => !selected.includes(c.id)));
    toast.success(`${selected.length} cliente(s) excluído(s)`);
    setSelected([]);
    setDeleteOpen(false);
  }

  function duplicate(id: string) {
    const original = clientes.find((c) => c.id === id);
    if (!original) return;
    const novo: Cliente = {
      ...original,
      id: `c${Date.now()}`,
      codigo: String(Math.max(...clientes.map((c) => Number(c.codigo))) + 1),
      razaoSocial: `${original.razaoSocial} (cópia)`,
      criadoEm: new Date().toISOString(),
      atualizadoEm: new Date().toISOString(),
    };
    setClientes((prev) => [novo, ...prev]);
    toast.success("Cliente duplicado");
  }

  const cidadesUnicas = useMemo(
    () => Array.from(new Set(MOCK_CLIENTES.map((c) => c.cidade))).sort(),
    [],
  );

  return (
    <div className="space-y-5">
      <PageHeader
        title="Clientes"
        description="Consulta e gerenciamento de clientes cadastrados."
        breadcrumbs={[{ label: "Início", to: "/" }, { label: "Pessoal" }, { label: "Clientes" }]}
        actions={
          <Button asChild>
            <Link to="/clientes/novo">
              <Plus className="mr-1.5 h-4 w-4" /> Novo Cliente
            </Link>
          </Button>
        }
      />

      {/* Barra de ações */}
      <Card>
        <CardContent className="flex flex-wrap items-center gap-2 p-3">
          <div className="relative min-w-[220px] flex-1">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={quickSearch}
              onChange={(e) => {
                setQuickSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Busca rápida..."
              className="h-9 pl-8"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={selected.length !== 1}
              onClick={() => navigate({ to: "/clientes/$id/editar", params: { id: selected[0] } })}
            >
              <Pencil className="mr-1.5 h-4 w-4" /> Editar
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={selected.length === 0}
              onClick={() => setDeleteOpen(true)}
            >
              <Trash2 className="mr-1.5 h-4 w-4" /> Excluir
            </Button>
            <Button variant="outline" size="sm" disabled={selected.length === 0} onClick={() => changeSituacao("ativo")}>
              <CheckCircle2 className="mr-1.5 h-4 w-4" /> Ativar
            </Button>
            <Button variant="outline" size="sm" disabled={selected.length === 0} onClick={() => changeSituacao("inativo")}>
              <XCircle className="mr-1.5 h-4 w-4" /> Inativar
            </Button>
            <Button variant="outline" size="sm" onClick={() => toast.info("Exportação iniciada")}>
              <FileDown className="mr-1.5 h-4 w-4" /> Exportar Excel
            </Button>
            <Button variant="outline" size="sm" onClick={() => toast.info("Selecione um arquivo .xlsx")}>
              <FileUp className="mr-1.5 h-4 w-4" /> Importar Excel
            </Button>
            <Button variant="outline" size="sm" onClick={() => window.print()}>
              <Printer className="mr-1.5 h-4 w-4" /> Imprimir
            </Button>
            <Button variant="outline" size="sm" onClick={refresh}>
              <RefreshCw className={`mr-1.5 h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Atualizar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Filtros */}
      <Card>
        <CardContent className="space-y-3 p-4">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Filter className="h-4 w-4" /> Filtros avançados
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Field label="Código">
              <Input
                value={filtros.codigo}
                onChange={(e) => setFiltros({ ...filtros, codigo: e.target.value })}
                placeholder="Ex.: 1023"
              />
            </Field>
            <Field label="Razão Social">
              <Input
                value={filtros.razao}
                onChange={(e) => setFiltros({ ...filtros, razao: e.target.value })}
                placeholder="Buscar por razão"
              />
            </Field>
            <Field label="Nome Fantasia">
              <Input
                value={filtros.fantasia}
                onChange={(e) => setFiltros({ ...filtros, fantasia: e.target.value })}
                placeholder="Buscar por fantasia"
              />
            </Field>
            <Field label="CNPJ">
              <Input
                value={filtros.cnpj}
                onChange={(e) => setFiltros({ ...filtros, cnpj: e.target.value })}
                placeholder="00.000.000/0000-00"
              />
            </Field>
            <Field label="Vendedor">
              <Select value={filtros.vendedor} onValueChange={(v) => setFiltros({ ...filtros, vendedor: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {VENDEDORES_LIST.map((v) => (
                    <SelectItem key={v} value={v}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Cidade">
              <Select value={filtros.cidade || "all"} onValueChange={(v) => setFiltros({ ...filtros, cidade: v === "all" ? "" : v })}>
                <SelectTrigger><SelectValue placeholder="Todas" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  {cidadesUnicas.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
            <Field label="Cadastro de">
              <Input type="date" value={filtros.dataDe} onChange={(e) => setFiltros({ ...filtros, dataDe: e.target.value })} />
            </Field>
            <Field label="Cadastro até">
              <Input type="date" value={filtros.dataAte} onChange={(e) => setFiltros({ ...filtros, dataAte: e.target.value })} />
            </Field>
          </div>
          <div className="flex flex-wrap justify-end gap-2 pt-1">
            <Button variant="ghost" size="sm" onClick={() => { setFiltros(EMPTY_FILTROS); setQuickSearch(""); setPage(1); }}>
              <X className="mr-1.5 h-4 w-4" /> Limpar filtros
            </Button>
            <Button size="sm" onClick={() => { setPage(1); toast.success(`${filtered.length} resultado(s)`); }}>
              <Search className="mr-1.5 h-4 w-4" /> Pesquisar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabela */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead className="w-10">
                  <Checkbox
                    checked={allChecked ? true : someChecked ? "indeterminate" : false}
                    onCheckedChange={(v) => toggleAllOnPage(!!v)}
                    aria-label="Selecionar todos"
                  />
                </TableHead>
                <TableHead className="w-20">Código</TableHead>
                <TableHead>Razão Social</TableHead>
                <TableHead>Nome Fantasia</TableHead>
                <TableHead className="w-44">CNPJ</TableHead>
                <TableHead>Cidade</TableHead>
                <TableHead className="w-14">UF</TableHead>
                <TableHead className="w-36">Telefone</TableHead>
                <TableHead>Vendedor</TableHead>
                <TableHead className="w-24">Situação</TableHead>
                <TableHead className="w-28">Cadastro</TableHead>
                <TableHead className="w-32">Última alteração</TableHead>
                <TableHead className="w-28 text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={13}>
                      <div className="h-6 w-full animate-pulse rounded bg-muted" />
                    </TableCell>
                  </TableRow>
                ))
              ) : pageItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={13} className="py-16 text-center">
                    <div className="mx-auto flex max-w-sm flex-col items-center gap-2 text-muted-foreground">
                      <Search className="h-8 w-8" />
                      <div className="text-sm font-medium">Nenhum cliente encontrado</div>
                      <div className="text-xs">Ajuste os filtros ou tente outra busca.</div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                pageItems.map((c) => (
                  <TableRow key={c.id} className="hover:bg-muted/30">
                    <TableCell>
                      <Checkbox
                        checked={selected.includes(c.id)}
                        onCheckedChange={(v) =>
                          setSelected((prev) => (v ? [...prev, c.id] : prev.filter((id) => id !== c.id)))
                        }
                        aria-label={`Selecionar ${c.razaoSocial}`}
                      />
                    </TableCell>
                    <TableCell className="font-mono text-xs">{c.codigo}</TableCell>
                    <TableCell>
                      <Link to="/clientes/$id/visualizar" params={{ id: c.id }} className="font-medium hover:underline">
                        {c.razaoSocial}
                      </Link>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{c.nomeFantasia}</TableCell>
                    <TableCell className="font-mono text-xs">{c.cnpj}</TableCell>
                    <TableCell>{c.cidade}</TableCell>
                    <TableCell>{c.uf}</TableCell>
                    <TableCell className="font-mono text-xs">{c.telefone}</TableCell>
                    <TableCell>{c.vendedor}</TableCell>
                    <TableCell>
                      {c.situacao === "ativo" ? (
                        <Badge className="border-success/30 bg-success/10 text-success hover:bg-success/15">Ativo</Badge>
                      ) : (
                        <Badge variant="secondary" className="text-muted-foreground">Inativo</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(c.criadoEm).toLocaleDateString("pt-BR")}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(c.atualizadoEm).toLocaleDateString("pt-BR")}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-0.5">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button asChild variant="ghost" size="icon" className="h-7 w-7">
                              <Link to="/clientes/$id/visualizar" params={{ id: c.id }}>
                                <Eye className="h-3.5 w-3.5" />
                              </Link>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Visualizar</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button asChild variant="ghost" size="icon" className="h-7 w-7">
                              <Link to="/clientes/$id/editar" params={{ id: c.id }}>
                                <Pencil className="h-3.5 w-3.5" />
                              </Link>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Editar</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => duplicate(c.id)}>
                              <Copy className="h-3.5 w-3.5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Duplicar</TooltipContent>
                        </Tooltip>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7">
                              <MoreHorizontal className="h-3.5 w-3.5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => { setSelected([c.id]); changeSituacao(c.situacao === "ativo" ? "inativo" : "ativo"); }}>
                              {c.situacao === "ativo" ? "Inativar" : "Ativar"}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toast.info(`Histórico de ${c.razaoSocial}`)}>
                              Ver histórico
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => { setSelected([c.id]); setDeleteOpen(true); }}
                            >
                              <Trash2 className="mr-2 h-4 w-4" /> Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Paginação */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t bg-muted/20 px-4 py-2.5 text-sm">
          <div className="text-muted-foreground">
            {filtered.length} registro(s){selected.length > 0 && ` · ${selected.length} selecionado(s)`}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Itens por página</span>
              <Select value={String(perPage)} onValueChange={(v) => { setPerPage(Number(v)); setPage(1); }}>
                <SelectTrigger className="h-8 w-[72px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {[10, 25, 50, 100].map((n) => <SelectItem key={n} value={String(n)}>{n}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="icon" className="h-8 w-8" disabled={currentPage <= 1} onClick={() => setPage(currentPage - 1)}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="px-2 text-xs">
                Página {currentPage} de {totalPages}
              </span>
              <Button variant="outline" size="icon" className="h-8 w-8" disabled={currentPage >= totalPages} onClick={() => setPage(currentPage + 1)}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir cliente(s)?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. {selected.length} cliente(s) serão permanentemente removidos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}
