import { MOCK_CLIENTES, type Cliente } from "@/data/mock-clientes";
import { createEntityStore } from "./entity-store";

export const clientesStore = createEntityStore<Cliente>(MOCK_CLIENTES);

export function emptyCliente(codigo: string): Cliente {
  const now = new Date().toISOString();
  return {
    id: "novo",
    codigo,
    razaoSocial: "",
    nomeFantasia: "",
    cnpj: "",
    ie: "",
    im: "",
    email: "",
    emailDanfe: "",
    emailCopia: "",
    telefone: "",
    celular: "",
    vendedor: "",
    situacao: "ativo",
    cidade: "",
    uf: "SP",
    observacoes: "",
    volumeVendas: 0,
    dadosBancarios: { banco: "", agencia: "", conta: "", correntista: "", telefoneCorrentista: "" },
    enderecos: [],
    contatos: [],
    socios: [],
    referencias: [],
    criadoEm: now,
    atualizadoEm: now,
  };
}
