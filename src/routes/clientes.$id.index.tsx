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
import { PersonCard } from "@/components/shared/socios-section";
import { EmptyState } from "@/components/shared/states";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { clientesStore } from "@/store/clientes-store";
import { newId } from "@/store/entity-store";
import { formatCurrency, formatDate } from "@/lib/masks";

export const Route = createFileRoute("/clientes/$id/")({
  head: () => ({
    meta: [
      { title: "Detalhes do Cliente — Metas Representações" },
      { name: "description", content: "Visualização completa dos dados cadastrais do cliente." },
      { property: "og:title", content: "Detalhes do Cliente — Metas Representações" },
      { property: "og:description", content: "Visualização completa dos dados cadastrais do cliente." },
    ],
  }),
  component: ClienteDetalhePage,
});

function ClienteDetalhePage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const c = clientesStore.useById(id);
  const [confirmSituacao, setConfirmSituacao] = useState(false);
  const [confirmExcluir, setConfirmExcluir] = useState(false);

  if (!c) {
    return (
      <EmptyState
        title="Cliente não encontrado"
        description="O cliente solicitado não existe ou foi removido."
        action={<Button asChild><Link to="/clientes">Voltar para a lista</Link></Button>}
      />
    );
  }

  function duplicar() {
    if (!c) return;
    const now = new Date().toISOString();
    const novo = {
      ...c,
      id: newId("cli"),
      codigo: clientesStore.nextCodigo(),
      razaoSocial: `${c.razaoSocial} (cópia)`,
      criadoEm: now,
      atualizadoEm: now,
    };
    clientesStore.add(novo);
    toast.success("Cliente duplicado com sucesso.");
    navigate({ to: "/clientes/$id/editar", params: { id: novo.id } });
  }

  const ativo = c.situacao === "ativo";

  return (
    <div className="space-y-5">
      <PageHeader
        title={c.nomeFantasia || c.razaoSocial}
        description="Visualização detalhada do cadastro."
        breadcrumbs={[
          { label: "Dashboard", to: "/" },
          { label: "Clientes", to: "/clientes" },
          { label: "Cliente" },
        ]}
        actions={
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" asChild>
              <Link to="/clientes"><ArrowLeft className="mr-1.5 h-4 w-4" />Voltar</Link>
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
              <Link to="/clientes/$id/editar" params={{ id: c.id }}>
                <Pencil className="mr-1.5 h-4 w-4" /> Editar
              </Link>
            </Button>
          </div>
        }
      />

      <Card>
        <CardContent className="grid grid-cols-2 gap-4 p-4 md:grid-cols-5">
          <ReadField label="Código" value={<span className="font-mono">{c.codigo}</span>} />
          <ReadField label="Nome Fantasia" value={c.nomeFantasia} />
          <ReadField label="Razão Social" value={c.razaoSocial} />
          <ReadField label="CNPJ" value={<span className="font-mono">{c.cnpj}</span>} />
          <ReadField label="Status" value={<StatusBadge situacao={c.situacao} />} />
        </CardContent>
      </Card>

      <FormSection title="Dados Gerais">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <ReadField label="Inscrição Estadual" value={c.ie} />
          <ReadField label="Inscrição Municipal" value={c.im} />
          <ReadField label="Vendedor" value={c.vendedor} />
          <ReadField label="Volume de vendas" value={formatCurrency(c.volumeVendas)} />
          <ReadField label="E-mail" value={c.email} />
          <ReadField label="E-mail para DANFe" value={c.emailDanfe} />
          <ReadField label="E-mail Cópia" value={c.emailCopia} />
          <ReadField label="Telefone Fixo" value={c.telefone} />
          <ReadField label="Celular" value={c.celular} />
          <ReadField label="Cidade / UF" value={`${c.cidade} - ${c.uf}`} />
          <ReadField label="Data de cadastro" value={formatDate(c.criadoEm)} />
          <ReadField label="Última alteração" value={formatDate(c.atualizadoEm)} />
          <div className="sm:col-span-2 lg:col-span-4">
            <ReadField label="Observações" value={c.observacoes} />
          </div>
        </div>
      </FormSection>

      <FormSection title="Informações Financeiras">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <ReadField label="Banco" value={c.dadosBancarios.banco} />
          <ReadField label="Agência" value={c.dadosBancarios.agencia} />
          <ReadField label="Conta" value={c.dadosBancarios.conta} />
          <ReadField label="Correntista" value={c.dadosBancarios.correntista} />
          <ReadField label="Telefone do correntista" value={c.dadosBancarios.telefoneCorrentista} />
        </div>
      </FormSection>

      <FormSection title="Contatos">
        {c.contatos.length === 0 ? (
          <EmptyState compact title="Nenhum contato cadastrado" />
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {c.contatos.map((ct) => <ContactCard key={ct.id} contato={ct} readOnly />)}
          </div>
        )}
      </FormSection>

      <FormSection title="Sócios">
        {c.socios.length === 0 ? (
          <EmptyState compact title="Nenhum sócio cadastrado" />
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {c.socios.map((s) => <PersonCard key={s.id} socio={s} readOnly />)}
          </div>
        )}
      </FormSection>

      <FormSection title="Referências Comerciais">
        {c.referencias.length === 0 ? (
          <EmptyState compact title="Nenhuma referência vinculada" />
        ) : (
          <div className="overflow-x-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead>Nome</TableHead>
                  <TableHead className="w-40">Telefone</TableHead>
                  <TableHead className="w-24">Situação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {c.referencias.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.nome}</TableCell>
                    <TableCell className="font-mono text-xs">{r.telefone}</TableCell>
                    <TableCell><StatusBadge situacao={r.situacao} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </FormSection>

      <FormSection title="Endereços">
        {c.enderecos.length === 0 ? (
          <EmptyState compact title="Nenhum endereço cadastrado" />
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {c.enderecos.map((e) => <AddressCard key={e.id} endereco={e} readOnly />)}
          </div>
        )}
      </FormSection>

      <ConfirmDialog
        open={confirmSituacao}
        onOpenChange={setConfirmSituacao}
        title={ativo ? "Inativar cliente?" : "Ativar cliente?"}
        description={`O cliente ${c.razaoSocial} será marcado como ${ativo ? "inativo" : "ativo"}.`}
        confirmLabel={ativo ? "Inativar" : "Ativar"}
        onConfirm={() => {
          clientesStore.update({ ...c, situacao: ativo ? "inativo" : "ativo", atualizadoEm: new Date().toISOString() });
          setConfirmSituacao(false);
          toast.success(ativo ? "Cliente inativado." : "Cliente ativado.");
        }}
      />

      <ConfirmDialog
        open={confirmExcluir}
        onOpenChange={setConfirmExcluir}
        title="Excluir cliente?"
        description="Esta ação remove o cliente da listagem."
        confirmLabel="Excluir"
        destructive
        onConfirm={() => {
          clientesStore.remove([c.id]);
          toast.success("Cliente excluído.");
          navigate({ to: "/clientes" });
        }}
      />
    </div>
  );
}
