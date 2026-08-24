import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { ArrowLeft, Ban, CheckCircle2, Copy, Pencil, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/page-header";
import { FormSection, ReadField } from "@/components/shared/form-section";
import { StatusBadge } from "@/components/shared/status-badge";
import { AddressCard } from "@/components/shared/address-section";
import { ContactCard } from "@/components/shared/contact-section";
import { EmptyState } from "@/components/shared/states";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { representadasStore } from "@/store/representadas-store";
import { newId } from "@/store/entity-store";
import { formatDate, formatPercent } from "@/lib/masks";

export const Route = createFileRoute("/representadas/$id/")({
  head: () => ({
    meta: [
      { title: "Detalhes da Representada — Metas Representações" },
      { name: "description", content: "Visualização completa dos dados da representada." },
      { property: "og:title", content: "Detalhes da Representada — Metas Representações" },
      { property: "og:description", content: "Visualização completa dos dados da representada." },
    ],
  }),
  component: RepresentadaDetalhePage,
});

function RepresentadaDetalhePage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const r = representadasStore.useById(id);
  const [confirmSituacao, setConfirmSituacao] = useState(false);
  const [confirmExcluir, setConfirmExcluir] = useState(false);

  if (!r) {
    return (
      <EmptyState
        title="Representada não encontrada"
        description="O registro solicitado não existe ou foi removido."
        action={<Button asChild><Link to="/representadas">Voltar para a lista</Link></Button>}
      />
    );
  }

  const ativo = r.situacao === "ativo";

  function duplicar() {
    if (!r) return;
    const now = new Date().toISOString();
    const nova = {
      ...r,
      id: newId("rep"),
      codigo: representadasStore.nextCodigo(),
      nome: `${r.nome} (cópia)`,
      criadoEm: now,
      atualizadoEm: now,
    };
    representadasStore.add(nova);
    toast.success("Representada duplicada com sucesso.");
    navigate({ to: "/representadas/$id/editar", params: { id: nova.id } });
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title={r.nomeFantasia || r.nome}
        description="Visualização detalhada do cadastro."
        breadcrumbs={[
          { label: "Dashboard", to: "/" },
          { label: "Representadas", to: "/representadas" },
          { label: "Representada" },
        ]}
        actions={
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" asChild>
              <Link to="/representadas"><ArrowLeft className="mr-1.5 h-4 w-4" />Voltar</Link>
            </Button>
            <Button variant="outline" onClick={duplicar}>
              <Copy className="mr-1.5 h-4 w-4" /> Duplicar
            </Button>
            <Button variant="outline" onClick={() => setConfirmSituacao(true)}>
              {ativo ? <Ban className="mr-1.5 h-4 w-4" /> : <CheckCircle2 className="mr-1.5 h-4 w-4" />}
              {ativo ? "Inativar" : "Ativar"}
            </Button>
            <Button variant="outline" className="text-destructive" onClick={() => setConfirmExcluir(true)}>
              <Trash2 className="mr-1.5 h-4 w-4" /> Excluir
            </Button>
            <Button asChild>
              <Link to="/representadas/$id/editar" params={{ id: r.id }}>
                <Pencil className="mr-1.5 h-4 w-4" /> Editar
              </Link>
            </Button>
          </div>
        }
      />

      <Card>
        <CardContent className="grid grid-cols-2 gap-4 p-4 md:grid-cols-5">
          <ReadField label="Código" value={<span className="font-mono">{r.codigo}</span>} />
          <ReadField label="Nome Fantasia" value={r.nomeFantasia} />
          <ReadField label="Razão Social" value={r.nome} />
          <ReadField label="CNPJ" value={<span className="font-mono">{r.cnpj}</span>} />
          <ReadField label="Status" value={<StatusBadge situacao={r.situacao} />} />
        </CardContent>
      </Card>

      <FormSection title="Dados Gerais">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <ReadField label="Inscrição Estadual" value={r.ie} />
          <ReadField label="Inscrição Municipal" value={r.im} />
          <ReadField label="Comissão padrão" value={formatPercent(r.comissaoPadrao)} />
          <ReadField label="E-mail" value={r.email} />
          <ReadField label="Telefone Fixo" value={r.telefone} />
          <ReadField label="Celular" value={r.celular} />
          <ReadField label="Cidade / UF" value={`${r.cidade} - ${r.uf}`} />
          <ReadField label="Data de cadastro" value={formatDate(r.criadoEm)} />
          <ReadField label="Última alteração" value={formatDate(r.atualizadoEm)} />
          <div className="sm:col-span-2 lg:col-span-4">
            <ReadField label="Observações" value={r.observacoes} />
          </div>
        </div>
      </FormSection>

      <FormSection title="Contatos">
        {r.contatos.length === 0 ? (
          <EmptyState compact title="Nenhum contato cadastrado" />
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {r.contatos.map((ct) => <ContactCard key={ct.id} contato={ct} readOnly />)}
          </div>
        )}
      </FormSection>

      <FormSection title="Endereços">
        {r.enderecos.length === 0 ? (
          <EmptyState compact title="Nenhum endereço cadastrado" />
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {r.enderecos.map((e) => <AddressCard key={e.id} endereco={e} readOnly />)}
          </div>
        )}
      </FormSection>

      <ConfirmDialog
        open={confirmSituacao}
        onOpenChange={setConfirmSituacao}
        title={ativo ? "Inativar representada?" : "Ativar representada?"}
        description={`${r.nome} será marcada como ${ativo ? "inativa" : "ativa"}.`}
        confirmLabel={ativo ? "Inativar" : "Ativar"}
        onConfirm={() => {
          representadasStore.update({
            ...r,
            situacao: ativo ? "inativo" : "ativo",
            atualizadoEm: new Date().toISOString(),
          });
          setConfirmSituacao(false);
          toast.success(ativo ? "Representada inativada." : "Representada ativada.");
        }}
      />

      <ConfirmDialog
        open={confirmExcluir}
        onOpenChange={setConfirmExcluir}
        title="Excluir representada?"
        description="Esta ação remove o registro da listagem."
        confirmLabel="Excluir"
        destructive
        onConfirm={() => {
          representadasStore.remove([r.id]);
          toast.success("Representada excluída.");
          navigate({ to: "/representadas" });
        }}
      />
    </div>
  );
}
