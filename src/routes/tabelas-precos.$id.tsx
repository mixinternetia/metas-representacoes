import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { ArrowLeft, Copy, GitCompareArrows, History, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "@/components/layout/page-header";
import { Field, FormSection, ReadField } from "@/components/shared/form-section";
import { SearchInput } from "@/components/shared/filter-panel";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/states";
import { SummaryCard, SummaryCards } from "@/components/shared/summary-card";
import { PriceComparison } from "@/components/precos/price-comparison";
import { TableAdjustmentDialog, avisoProximaFase } from "@/components/precos/price-dialogs";
import { formatBRL } from "@/data/mock-produtos";
import { MOCK_HISTORICO, MOCK_TABELAS_PRECOS } from "@/data/mock-tabelas-precos";
import { formatDate } from "@/lib/masks";

export const Route = createFileRoute("/tabelas-precos/$id")({
  head: () => ({
    meta: [
      { title: "Detalhes da Tabela de Preços — Metas Representações" },
      { name: "description", content: "Produtos, comparação, ajustes simulados e histórico da tabela de preços." },
      { property: "og:title", content: "Detalhes da Tabela de Preços — Metas Representações" },
      {
        property: "og:description",
        content: "Produtos, comparação, ajustes simulados e histórico da tabela de preços.",
      },
    ],
  }),
  component: TabelaPrecoDetalhePage,
});

function TabelaPrecoDetalhePage() {
  const { id } = Route.useParams();
  const [busca, setBusca] = useState("");
  const [grupo, setGrupo] = useState("all");
  const [produto, setProduto] = useState("all");
  const [ajusteOpen, setAjusteOpen] = useState(false);
  const [compararOpen, setCompararOpen] = useState(false);

  const t = MOCK_TABELAS_PRECOS.find((x) => x.id === id);

  const itens = useMemo(() => {
    if (!t) return [];
    const q = busca.trim().toLowerCase();
    return t.itens.filter((i) => {
      if (grupo !== "all" && i.grupo !== grupo) return false;
      if (produto !== "all" && i.codigo !== produto) return false;
      if (q && !`${i.codigo} ${i.produto}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [t, busca, grupo, produto]);

  if (!t) {
    return (
      <EmptyState
        title="Tabela não encontrada"
        description="O registro solicitado não existe nos dados de demonstração."
        action={
          <Button asChild>
            <Link to="/tabelas-precos">Voltar para a lista</Link>
          </Button>
        }
      />
    );
  }

  const precos = t.itens.map((i) => i.preco);
  const media = precos.reduce((s, p) => s + p, 0) / (precos.length || 1);
  const grupos = Array.from(new Set(t.itens.map((i) => i.grupo)));

  return (
    <div className="space-y-5">
      <PageHeader
        title={`Tabela ${t.nome}`}
        description="Visualização detalhada da tabela de preços."
        breadcrumbs={[
          { label: "Dashboard", to: "/" },
          { label: "Tabelas de Preços", to: "/tabelas-precos" },
          { label: t.codigo },
        ]}
        actions={
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" asChild>
              <Link to="/tabelas-precos">
                <ArrowLeft className="mr-1.5 h-4 w-4" /> Voltar
              </Link>
            </Button>
            <Button variant="outline" onClick={avisoProximaFase}>
              <Copy className="mr-1.5 h-4 w-4" /> Duplicar
            </Button>
            <Button variant="outline" onClick={() => setCompararOpen((v) => !v)}>
              <GitCompareArrows className="mr-1.5 h-4 w-4" /> Comparar Tabelas
            </Button>
            <Button onClick={() => setAjusteOpen(true)}>
              <Wand2 className="mr-1.5 h-4 w-4" /> Ajustar preços
            </Button>
          </div>
        }
      />

      <SummaryCards>
        <SummaryCard label="Produtos" value={t.itens.length} />
        <SummaryCard label="Preço médio" value={formatBRL(media)} />
        <SummaryCard label="Maior preço" value={formatBRL(Math.max(...precos))} />
        <SummaryCard label="Menor preço" value={formatBRL(Math.min(...precos))} />
      </SummaryCards>

      <Card>
        <CardContent className="grid grid-cols-2 gap-4 p-4 md:grid-cols-5">
          <ReadField label="Código" value={<span className="font-mono">{t.codigo}</span>} />
          <ReadField label="Nome" value={t.nome} />
          <ReadField label="Representada" value={t.representada} />
          <ReadField label="Situação" value={<StatusBadge situacao={t.situacao} />} />
          <ReadField label="Última alteração" value={formatDate(t.atualizadoEm)} />
        </CardContent>
      </Card>

      <FormSection title="Dados da Tabela">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <ReadField label="Data de criação" value={formatDate(t.criadoEm)} />
          <ReadField label="Última atualização" value={formatDate(t.atualizadoEm)} />
          <ReadField label="Produtos com preço" value={t.itens.length} />
          <ReadField label="Descrição" value={t.descricao} className="sm:col-span-2 lg:col-span-4" />
        </div>
      </FormSection>

      <FormSection title="Produtos da Tabela" description="Preços vigentes dos produtos vinculados a esta tabela.">
        <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <SearchInput value={busca} onChange={setBusca} placeholder="Pesquisar produto..." />
          <Field label="Grupo">
            <Select value={grupo} onValueChange={setGrupo}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os grupos</SelectItem>
                {grupos.map((g) => (
                  <SelectItem key={g} value={g}>{g}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Produto">
            <Select value={produto} onValueChange={setProduto}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os produtos</SelectItem>
                {t.itens.map((i) => (
                  <SelectItem key={i.id} value={i.codigo}>{i.codigo} · {i.produto}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </div>

        <div className="overflow-x-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead className="w-24">Código</TableHead>
                <TableHead>Produto</TableHead>
                <TableHead className="w-28">Grupo</TableHead>
                <TableHead className="w-32 text-right">Preço</TableHead>
                <TableHead className="w-32">Atualização</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {itens.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-6 text-center text-sm text-muted-foreground">
                    Nenhum produto encontrado com os filtros aplicados.
                  </TableCell>
                </TableRow>
              ) : (
                itens.map((i) => (
                  <TableRow key={i.id} className="hover:bg-muted/30">
                    <TableCell className="font-mono text-xs">{i.codigo}</TableCell>
                    <TableCell className="font-medium">{i.produto}</TableCell>
                    <TableCell>{i.grupo}</TableCell>
                    <TableCell className="text-right tabular-nums">{formatBRL(i.preco)}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{formatDate(i.atualizadoEm)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </FormSection>

      {compararOpen && (
        <FormSection title="Comparar Tabelas" description="Comparação demonstrativa de preços entre duas tabelas.">
          <PriceComparison tabelaPadraoId={t.id} />
        </FormSection>
      )}

      <FormSection
        title="Histórico de alterações"
        description="Registro demonstrativo das alterações aplicadas às tabelas."
        actions={<History className="h-4 w-4 text-muted-foreground" />}
      >
        <div className="overflow-x-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead className="w-28">Data</TableHead>
                <TableHead>Usuário</TableHead>
                <TableHead>Tabela</TableHead>
                <TableHead className="w-32">Produtos</TableHead>
                <TableHead className="w-24 text-right">Alteração</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_HISTORICO.map((h) => (
                <TableRow key={h.id} className="hover:bg-muted/30">
                  <TableCell className="text-xs">{h.data}</TableCell>
                  <TableCell>{h.usuario}</TableCell>
                  <TableCell>{h.tabela}</TableCell>
                  <TableCell className="tabular-nums">{h.produtos} produtos</TableCell>
                  <TableCell className="text-right font-medium tabular-nums">{h.alteracao}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </FormSection>

      <TableAdjustmentDialog
        open={ajusteOpen}
        onOpenChange={setAjusteOpen}
        tabelaPadrao={t.nome}
        precoMedio={Number(media.toFixed(2))}
      />
    </div>
  );
}
