import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ClienteForm } from "@/components/clientes/cliente-form";
import { MOCK_CLIENTES } from "@/data/mock-clientes";

export const Route = createFileRoute("/clientes/$id/editar")({
  head: () => ({ meta: [{ title: "Editar Cliente — Metas Representações" }] }),
  component: EditarClientePage,
});

function EditarClientePage() {
  const { id } = Route.useParams();
  const cliente = MOCK_CLIENTES.find((c) => c.id === id);
  if (!cliente) return <NotFound />;
  return <ClienteForm mode="editar" initial={cliente} />;
}

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
      <h2 className="text-lg font-semibold">Cliente não encontrado</h2>
      <p className="text-sm text-muted-foreground">O cliente solicitado não existe ou foi removido.</p>
      <Button asChild><Link to="/clientes">Voltar para a lista</Link></Button>
    </div>
  );
}
