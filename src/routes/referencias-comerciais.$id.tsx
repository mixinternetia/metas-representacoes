import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { ArrowLeft, FileText, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/layout/page-header";
import { FormSection, ReadField } from "@/components/shared/form-section";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/states";
import {
  ClientRelationCard,
  CommercialReferenceTimeline,
  RelacaoClienteReferencia,
} from "@/components/referencias/referencia-components";
import { MOCK_REFERENCIAS_COMERCIAIS } from "@/data/mock-referencias-comerciais";
import { formatDateTime } from "@/lib/masks";

export const Route = createFileRoute("/referencias-comerciais/$id")({
  head: () => ({
    meta: [
      { title: "Detalhes da Referência Comercial — Metas Representações" },
      {
        name: "description",
        content: "Dados gerais, cliente vinculado e histórico da referência comercial.",
      },
      { property: "og:title", content: "Detalhes da Referência Comercial — Metas Representações" },
      {
        property: "og:description",
        content: "Dados gerais, cliente vinculado e histórico da referência comercial.",
      },
    ],
  }),
  component: ReferenciaDetalhePage,
});

const EM_BREVE = "Esta funcionalidade será implementada em uma próxima fase.";

function ReferenciaDetalhePage() {
  const { id } = Route.useParams();
  const r = MOCK_REFERENCIAS_COMERCIAIS.find((x) => x.id === id);

  if (!r) {
    return (
      <EmptyState
        title="Referência comercial não encontrada"
        description="O registro solicitado não existe nos dados de demonstração."
        action={
          <Button asChild>
            <Link to="/referencias-comerciais">Voltar para a lista</Link>
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Detalhes da Referência Comercial"
        description={`${r.codigo} — ${r.nome}`}
        breadcrumbs={[
          { label: "Dashboard", to: "/" },
          { label: "Referências Comerciais", to: "/referencias-comerciais" },
          { label: r.codigo },
        ]}
        actions={
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" asChild>
              <Link to="/referencias-comerciais">
                <ArrowLeft className="mr-1.5 h-4 w-4" /> Voltar
              </Link>
            </Button>
            <Button variant="outline" onClick={() => toast.info(EM_BREVE)}>
              <FileText className="mr-1.5 h-4 w-4" /> Relatório detalhado
            </Button>
            <Button onClick={() => toast.info(EM_BREVE)}>
              <Pencil className="mr-1.5 h-4 w-4" /> Editar
            </Button>
          </div>
        }
      />

      <Card>
        <CardContent className="grid grid-cols-2 gap-4 p-4 md:grid-cols-5">
          <ReadField label="Código" value={<span className="font-mono">{r.codigo}</span>} />
          <ReadField label="Nome" value={r.nome} />
          <ReadField label="Telefone" value={<span className="font-mono">{r.telefone}</span>} />
          <ReadField label="E-mail" value={r.email} />
          <ReadField label="Situação" value={<StatusBadge situacao={r.situacao} />} />
        </CardContent>
      </Card>

      <FormSection title="Dados Gerais">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <ReadField label="Cidade / UF" value={`${r.cidade} - ${r.uf}`} />
          <ReadField label="Cadastro" value={formatDateTime(r.criadoEm)} />
          <ReadField label="Última alteração" value={formatDateTime(r.atualizadoEm)} />
          <ReadField label="Observações" value={r.observacoes} />
        </div>
      </FormSection>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ClientRelationCard cliente={r.cliente} />
        </div>
        <FormSection title="Relação" description="Vínculo entre cliente e referência comercial.">
          <RelacaoClienteReferencia referencia={r} />
        </FormSection>
      </div>

      <FormSection title="Histórico" description="Registro demonstrativo de eventos da referência.">
        <CommercialReferenceTimeline itens={r.historico} />
      </FormSection>
    </div>
  );
}
