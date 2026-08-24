import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { ArrowLeft, FileText, Pencil, Percent } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageHeader } from "@/components/layout/page-header";
import { FormSection, ReadField } from "@/components/shared/form-section";
import { StatusBadge } from "@/components/shared/status-badge";
import { AddressCard } from "@/components/shared/address-section";
import { EmptyState } from "@/components/shared/states";
import { comissaoMedia, MOCK_VENDEDORES } from "@/data/mock-vendedores";
import { formatDateTime, formatPercent } from "@/lib/masks";

export const Route = createFileRoute("/vendedores/$id")({
  head: () => ({
    meta: [
      { title: "Detalhes do Vendedor — Metas Representações" },
      { name: "description", content: "Dados pessoais, comissões por representada e endereços do vendedor." },
      { property: "og:title", content: "Detalhes do Vendedor — Metas Representações" },
      { property: "og:description", content: "Dados pessoais, comissões por representada e endereços do vendedor." },
    ],
  }),
  component: VendedorDetalhePage,
});

function VendedorDetalhePage() {
  const { id } = Route.useParams();
  const v = MOCK_VENDEDORES.find((x) => x.id === id);

  if (!v) {
    return (
      <EmptyState
        title="Vendedor não encontrado"
        description="O registro solicitado não existe nos dados de demonstração."
        action={
          <Button asChild>
            <Link to="/vendedores">Voltar para a lista</Link>
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title={v.nome}
        description="Visualização detalhada do vendedor."
        breadcrumbs={[
          { label: "Dashboard", to: "/" },
          { label: "Vendedores", to: "/vendedores" },
          { label: "Vendedor" },
        ]}
        actions={
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" asChild>
              <Link to="/vendedores">
                <ArrowLeft className="mr-1.5 h-4 w-4" /> Voltar
              </Link>
            </Button>
            <Button variant="outline" onClick={() => toast.info("Relatório disponível na próxima etapa.")}>
              <FileText className="mr-1.5 h-4 w-4" /> Relatório detalhado
            </Button>
            <Button onClick={() => toast.info("A edição de vendedores será implementada em uma próxima fase.")}>
              <Pencil className="mr-1.5 h-4 w-4" /> Editar
            </Button>
          </div>
        }
      />

      <Card>
        <CardContent className="grid grid-cols-2 gap-4 p-4 md:grid-cols-5">
          <ReadField label="Código" value={<span className="font-mono">{v.codigo}</span>} />
          <ReadField label="Nome" value={v.nome} />
          <ReadField label="CPF" value={<span className="font-mono">{v.cpf}</span>} />
          <ReadField label="Comissão média" value={formatPercent(comissaoMedia(v))} />
          <ReadField label="Situação" value={<StatusBadge situacao={v.situacao} />} />
        </CardContent>
      </Card>

      <FormSection title="Dados Pessoais">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <ReadField label="RG" value={v.rg} />
          <ReadField label="E-mail" value={v.email} />
          <ReadField label="Telefone" value={<span className="font-mono">{v.telefone}</span>} />
          <ReadField label="Celular" value={<span className="font-mono">{v.celular}</span>} />
          <ReadField label="Cidade / UF" value={`${v.cidade} - ${v.uf}`} />
          <ReadField label="Clientes atendidos" value={v.clientesAtendidos} />
          <ReadField label="Cadastro" value={formatDateTime(v.criadoEm)} />
          <ReadField label="Última alteração" value={formatDateTime(v.atualizadoEm)} />
          <ReadField label="Observações" value={v.observacoes} />
        </div>
      </FormSection>

      <FormSection
        title="Comissão por Representada"
        description="Percentual de comissão configurado individualmente para cada representada."
        actions={
          <Badge variant="secondary" className="gap-1">
            <Percent className="h-3.5 w-3.5" /> {v.comissoes.length}
          </Badge>
        }
      >
        <div className="overflow-x-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead>Representada</TableHead>
                <TableHead className="w-48">CNPJ</TableHead>
                <TableHead className="w-32 text-right">Comissão</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {v.comissoes.map((c) => (
                <TableRow key={c.representadaId} className="hover:bg-muted/30">
                  <TableCell className="font-medium">{c.representadaNome}</TableCell>
                  <TableCell className="font-mono text-xs">{c.representadaCnpj}</TableCell>
                  <TableCell className="text-right tabular-nums">{formatPercent(c.percentual)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </FormSection>

      <FormSection title="Endereços">
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          {v.enderecos.map((e) => (
            <AddressCard key={e.id} endereco={e} readOnly />
          ))}
        </div>
      </FormSection>
    </div>
  );
}
