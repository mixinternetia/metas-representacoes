import { createFileRoute } from "@tanstack/react-router";
import { RepresentadaForm } from "@/components/representadas/representada-form";
import { emptyRepresentada, representadasStore } from "@/store/representadas-store";

export const Route = createFileRoute("/representadas/novo")({
  head: () => ({
    meta: [
      { title: "Nova Representada — Metas Representações" },
      { name: "description", content: "Cadastro de uma nova representada / fornecedor." },
      { property: "og:title", content: "Nova Representada — Metas Representações" },
      { property: "og:description", content: "Cadastro de uma nova representada / fornecedor." },
    ],
  }),
  component: NovaRepresentadaPage,
});

function NovaRepresentadaPage() {
  return <RepresentadaForm mode="novo" initial={emptyRepresentada(representadasStore.nextCodigo())} />;
}
