import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { RepresentadaForm } from "@/components/representadas/representada-form";
import { EmptyState } from "@/components/shared/states";
import { representadasStore } from "@/store/representadas-store";

export const Route = createFileRoute("/representadas/$id/editar")({
  head: () => ({
    meta: [
      { title: "Editar Representada — Metas Representações" },
      { name: "description", content: "Atualize os dados cadastrais da representada." },
      { property: "og:title", content: "Editar Representada — Metas Representações" },
      { property: "og:description", content: "Atualize os dados cadastrais da representada." },
    ],
  }),
  component: EditarRepresentadaPage,
});

function EditarRepresentadaPage() {
  const { id } = Route.useParams();
  const representada = representadasStore.useById(id);
  if (!representada) {
    return (
      <EmptyState
        title="Representada não encontrada"
        description="O registro solicitado não existe ou foi removido."
        action={<Button asChild><Link to="/representadas">Voltar para a lista</Link></Button>}
      />
    );
  }
  return <RepresentadaForm key={representada.id} mode="editar" initial={representada} />;
}
