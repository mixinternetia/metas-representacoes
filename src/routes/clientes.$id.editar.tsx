import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ClienteForm } from "@/components/clientes/cliente-form";
import { EmptyState } from "@/components/shared/states";
import { clientesStore } from "@/store/clientes-store";

export const Route = createFileRoute("/clientes/$id/editar")({
  head: () => ({
    meta: [
      { title: "Editar Cliente — Metas Representações" },
      { name: "description", content: "Atualize as informações cadastrais do cliente." },
      { property: "og:title", content: "Editar Cliente — Metas Representações" },
      { property: "og:description", content: "Atualize as informações cadastrais do cliente." },
    ],
  }),
  component: EditarClientePage,
});

function EditarClientePage() {
  const { id } = Route.useParams();
  const cliente = clientesStore.useById(id);
  if (!cliente) {
    return (
      <EmptyState
        title="Cliente não encontrado"
        description="O cliente solicitado não existe ou foi removido."
        action={
          <Button asChild>
            <Link to="/clientes">Voltar para a lista</Link>
          </Button>
        }
      />
    );
  }
  return <ClienteForm key={cliente.id} mode="editar" initial={cliente} />;
}
