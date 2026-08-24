import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRightLeft, BookOpen, Percent, Tags } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "@/components/layout/page-header";
import { FormSection, ReadField } from "@/components/shared/form-section";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/states";
import { SummaryCard, SummaryCards } from "@/components/shared/summary-card";
import { CopyPricesDialog, PriceAdjustmentDialog } from "@/components/precos/price-dialogs";
import { MOCK_PRODUTOS, formatBRL } from "@/data/mock-produtos";
import { formatDate } from "@/lib/masks";

export const Route = createFileRoute("/produtos/$id")({
  head: () => ({
    meta: [
      { title: "Detalhes do Produto — Metas Representações" },
      { name: "description", content: "Informações do produto, localização no catálogo e tabela de preço atual." },
      { property: "og:title", content: "Detalhes do Produto — Metas Representações" },
      {
        property: "og:description",
        content: "Informações do produto, localização no catálogo e tabela de preço atual.",
      },
    ],
  }),
  component: ProdutoDetalhePage,
});

function ProdutoDetalhePage() {
  const { id } = Route.useParams();
  const [ajusteOpen, setAjusteOpen] = useState(false);
  const [copyOpen, setCopyOpen] = useState(false);
  const p = MOCK_PRODUTOS.find((x) => x.id === id);

  if (!p) {
    return (
      <EmptyState
        title="Produto não encontrado"
        description="O registro solicitado não existe nos dados de demonstração."
        action={
          <Button asChild>
            <Link to="/produtos">Voltar para a lista</Link>
          </Button>
        }
      />
    );
  }

  const precoAtualRegistro = p.precos[0];

  return (
    <div className="space-y-5">
      <PageHeader
        title={p.descricao}
        description="Visualização detalhada do produto e dos seus preços."
        breadcrumbs={[
          { label: "Dashboard", to: "/" },
          { label: "Produtos", to: "/produtos" },
          { label: "Produto" },
        ]}
        actions={
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" asChild>
              <Link to="/produtos">
                <ArrowLeft className="mr-1.5 h-4 w-4" /> Voltar
              </Link>
            </Button>
            <Button variant="outline" onClick={() => setCopyOpen(true)}>
              <ArrowRightLeft className="mr-1.5 h-4 w-4" /> Copiar preços
            </Button>
            <Button onClick={() => setAjusteOpen(true)}>
              <Percent className="mr-1.5 h-4 w-4" /> Ajuste de Preços
            </Button>
          </div>
        }
      />

      <SummaryCards>
        <SummaryCard label="Preço atual" value={formatBRL(p.precoAtual)} hint={`Tabela ${p.tabelaAtual}`} />
        <SummaryCard label="Estoque" value={p.estoque} hint="Unidades disponíveis" />
        <SummaryCard label="Tabelas com preço" value={p.precos.length} icon={<Tags className="h-4 w-4" />} />
        <SummaryCard
          label="Situação"
          value={p.emLinha ? "Em linha" : "Fora de linha"}
          hint={`Atualizado em ${formatDate(p.atualizadoEm)}`}
        />
      </SummaryCards>

      <Card>
        <CardContent className="grid grid-cols-2 gap-4 p-4 md:grid-cols-5">
          <ReadField label="Código" value={<span className="font-mono">{p.codigo}</span>} />
          <ReadField label="Descrição" value={p.descricao} />
          <ReadField label="Representada" value={p.representada} />
          <ReadField label="Grupo" value={p.grupo} />
          <ReadField
            label="Status"
            value={
              p.emLinha ? (
                <Badge className="border-success/30 bg-success/10 text-success hover:bg-success/15">Em linha</Badge>
              ) : (
                <Badge variant="secondary" className="text-muted-foreground">Fora de linha</Badge>
              )
            }
          />
        </CardContent>
      </Card>

      <FormSection title="Informações do Produto">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <ReadField label="Código na fábrica" value={<span className="font-mono">{p.codigoFabrica}</span>} />
          <ReadField label="Embalagem" value={p.embalagem} />
          <ReadField label="Código de barras" value={<span className="font-mono">{p.codigoBarras}</span>} />
          <ReadField label="DUM14" value={<span className="font-mono">{p.dum14}</span>} />
          <ReadField label="NCM" value={<span className="font-mono">{p.ncm}</span>} />
          <ReadField label="Estoque" value={p.estoque} />
          <ReadField label="Cadastro" value={formatDate(p.criadoEm)} />
          <ReadField label="Última alteração" value={formatDate(p.atualizadoEm)} />
        </div>
      </FormSection>

      <FormSection
        title="Localização no Catálogo"
        description="Formada pelo número do catálogo, página e ordem na página."
        actions={<BookOpen className="h-4 w-4 text-muted-foreground" />}
      >
        <div className="grid grid-cols-3 gap-4">
          <ReadField label="Catálogo" value={p.catalogo.numero} />
          <ReadField label="Página" value={p.catalogo.pagina} />
          <ReadField label="Posição" value={p.catalogo.ordem} />
        </div>
      </FormSection>

      <FormSection title="Tabela de Preço Atual" description="Preço vigente e demais tabelas do produto.">
        <div className="mb-4 grid grid-cols-1 gap-4 rounded-md border bg-muted/40 p-4 sm:grid-cols-4">
          <ReadField label="Tabela" value={`Tabela ${precoAtualRegistro.tabela}`} />
          <ReadField
            label="Preço"
            value={<span className="text-lg font-semibold">{formatBRL(precoAtualRegistro.preco)}</span>}
          />
          <ReadField label="Última atualização" value={formatDate(precoAtualRegistro.atualizadoEm)} />
          <ReadField label="Situação" value={<StatusBadge situacao={precoAtualRegistro.situacao} />} />
        </div>

        <div className="overflow-x-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead>Tabela</TableHead>
                <TableHead className="w-32 text-right">Preço</TableHead>
                <TableHead className="w-36">Última atualização</TableHead>
                <TableHead className="w-28">Situação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {p.precos.map((pr) => (
                <TableRow key={pr.tabelaId} className="hover:bg-muted/30">
                  <TableCell className="font-medium">{pr.tabela}</TableCell>
                  <TableCell className="text-right tabular-nums">{formatBRL(pr.preco)}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{formatDate(pr.atualizadoEm)}</TableCell>
                  <TableCell><StatusBadge situacao={pr.situacao} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </FormSection>

      <PriceAdjustmentDialog
        open={ajusteOpen}
        onOpenChange={setAjusteOpen}
        precoAtual={p.precoAtual}
        produto={p.descricao}
      />
      <CopyPricesDialog open={copyOpen} onOpenChange={setCopyOpen} origemPadrao={p.id} />
    </div>
  );
}
