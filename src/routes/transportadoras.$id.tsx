import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { ArrowLeft, Building2, FileText, Pencil } from "lucide-react";
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
import { ContactCard } from "@/components/shared/contact-section";
import { EmptyState } from "@/components/shared/states";
import { MOCK_TRANSPORTADORAS } from "@/data/mock-transportadoras";
import { formatDateTime } from "@/lib/masks";

export const Route = createFileRoute("/transportadoras/$id")({
  head: () => ({
    meta: [
      { title: "Detalhes da Transportadora — Metas Representações" },
      { name: "description", content: "Dados gerais, filiais, contatos e endereços da transportadora." },
      { property: "og:title", content: "Detalhes da Transportadora — Metas Representações" },
      { property: "og:description", content: "Dados gerais, filiais, contatos e endereços da transportadora." },
    ],
  }),
  component: TransportadoraDetalhePage,
});

function TransportadoraDetalhePage() {
  const { id } = Route.useParams();
  const t = MOCK_TRANSPORTADORAS.find((x) => x.id === id);

  if (!t) {
    return (
      <EmptyState
        title="Transportadora não encontrada"
        description="O registro solicitado não existe nos dados de demonstração."
        action={
          <Button asChild>
            <Link to="/transportadoras">Voltar para a lista</Link>
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title={t.nomeFantasia}
        description="Visualização detalhada da transportadora."
        breadcrumbs={[
          { label: "Dashboard", to: "/" },
          { label: "Transportadoras", to: "/transportadoras" },
          { label: "Transportadora" },
        ]}
        actions={
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" asChild>
              <Link to="/transportadoras">
                <ArrowLeft className="mr-1.5 h-4 w-4" /> Voltar
              </Link>
            </Button>
            <Button variant="outline" onClick={() => toast.info("Relatório disponível na próxima etapa.")}>
              <FileText className="mr-1.5 h-4 w-4" /> Relatório detalhado
            </Button>
            <Button
              onClick={() => toast.info("A edição de transportadoras será implementada em uma próxima fase.")}
            >
              <Pencil className="mr-1.5 h-4 w-4" /> Editar
            </Button>
          </div>
        }
      />

      <Card>
        <CardContent className="grid grid-cols-2 gap-4 p-4 md:grid-cols-5">
          <ReadField label="Código" value={<span className="font-mono">{t.codigo}</span>} />
          <ReadField label="Nome Fantasia" value={t.nomeFantasia} />
          <ReadField label="Razão Social" value={t.nome} />
          <ReadField label="CNPJ" value={<span className="font-mono">{t.cnpj}</span>} />
          <ReadField label="Situação" value={<StatusBadge situacao={t.situacao} />} />
        </CardContent>
      </Card>

      <FormSection title="Dados Gerais">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <ReadField label="E-mail" value={t.email} />
          <ReadField label="Telefone Fixo" value={<span className="font-mono">{t.telefone}</span>} />
          <ReadField label="Celular" value={<span className="font-mono">{t.celular}</span>} />
          <ReadField label="Cidade / UF" value={`${t.cidade} - ${t.uf}`} />
          <ReadField label="Cadastro" value={formatDateTime(t.criadoEm)} />
          <ReadField label="Última alteração" value={formatDateTime(t.atualizadoEm)} />
          <ReadField label="Filiais" value={`${t.filiais.length} filial(is)`} />
          <ReadField label="Observações" value={t.observacoes} />
        </div>
      </FormSection>

      <FormSection
        title="Filiais"
        description="Uma transportadora pode possuir filiais em diferentes estados brasileiros."
        actions={
          <Badge variant="secondary" className="gap-1">
            <Building2 className="h-3.5 w-3.5" /> {t.filiais.length}
          </Badge>
        }
      >
        <div className="overflow-x-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead>Filial</TableHead>
                <TableHead className="w-14">UF</TableHead>
                <TableHead className="w-36">Telefone</TableHead>
                <TableHead>E-mail</TableHead>
                <TableHead className="w-28">CEP</TableHead>
                <TableHead>Logradouro</TableHead>
                <TableHead className="w-20">Número</TableHead>
                <TableHead>Cidade</TableHead>
                <TableHead>Bairro</TableHead>
                <TableHead>Complemento</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {t.filiais.map((f) => (
                <TableRow key={f.id} className="hover:bg-muted/30">
                  <TableCell className="font-medium">{f.nome}</TableCell>
                  <TableCell>{f.uf}</TableCell>
                  <TableCell className="font-mono text-xs">{f.telefone}</TableCell>
                  <TableCell className="text-xs">{f.email}</TableCell>
                  <TableCell className="font-mono text-xs">{f.cep}</TableCell>
                  <TableCell>{f.logradouro}</TableCell>
                  <TableCell>{f.numero}</TableCell>
                  <TableCell>{f.cidade}</TableCell>
                  <TableCell>{f.bairro}</TableCell>
                  <TableCell className="text-muted-foreground">{f.complemento || "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </FormSection>

      <FormSection title="Outros Contatos" description="Diversos meios de contato por pessoa.">
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          {t.contatos.map((c) => (
            <ContactCard key={c.id} contato={c} readOnly />
          ))}
        </div>
      </FormSection>

      <FormSection title="Endereços">
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          {t.enderecos.map((e) => (
            <AddressCard key={e.id} endereco={e} readOnly />
          ))}
        </div>
      </FormSection>
    </div>
  );
}
