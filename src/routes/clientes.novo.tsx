import { createFileRoute } from "@tanstack/react-router";
import { ClienteForm } from "@/components/clientes/cliente-form";
import { clientesStore, emptyCliente } from "@/store/clientes-store";

export const Route = createFileRoute("/clientes/novo")({
  head: () => ({
    meta: [
      { title: "Novo Cliente — Metas Representações" },
      { name: "description", content: "Cadastro completo de um novo cliente." },
      { property: "og:title", content: "Novo Cliente — Metas Representações" },
      { property: "og:description", content: "Cadastro completo de um novo cliente." },
    ],
  }),
  component: NovoClientePage,
});

function NovoClientePage() {
  return <ClienteForm mode="novo" initial={emptyCliente(clientesStore.nextCodigo())} />;
}
