import { createFileRoute } from "@tanstack/react-router";
import { ClienteForm } from "@/components/clientes/cliente-form";
import { MOCK_CLIENTES, type Cliente } from "@/data/mock-clientes";

export const Route = createFileRoute("/clientes/novo")({
  head: () => ({ meta: [{ title: "Novo Cliente — Metas Representações" }] }),
  component: NovoClientePage,
});

function NovoClientePage() {
  const nextCodigo = String(Math.max(...MOCK_CLIENTES.map((c) => Number(c.codigo))) + 1);
  const empty: Cliente = {
    id: "novo",
    codigo: nextCodigo,
    razaoSocial: "",
    nomeFantasia: "",
    cnpj: "",
    ie: "",
    im: "",
    email: "",
    emailNF: "",
    telefone: "",
    celular: "",
    vendedor: "",
    situacao: "ativo",
    cidade: "",
    uf: "SP",
    observacoes: "",
    limiteCredito: 0,
    prazoPagamento: "30 dias",
    condicaoPagamento: "Boleto",
    dadosBancarios: { banco: "", agencia: "", conta: "", tipo: "Corrente", pix: "" },
    enderecos: [],
    contatos: [],
    socios: [],
    referencias: [],
    criadoEm: new Date().toISOString(),
    atualizadoEm: new Date().toISOString(),
  };
  return <ClienteForm mode="novo" initial={empty} />;
}
