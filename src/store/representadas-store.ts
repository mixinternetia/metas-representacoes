import { MOCK_REPRESENTADAS, type Representada } from "@/data/mock-representadas";
import { createEntityStore } from "./entity-store";

export const representadasStore = createEntityStore<Representada>(MOCK_REPRESENTADAS);

export function emptyRepresentada(codigo: string): Representada {
  const now = new Date().toISOString();
  return {
    id: "novo",
    codigo,
    nome: "",
    nomeFantasia: "",
    cnpj: "",
    ie: "",
    im: "",
    email: "",
    telefone: "",
    celular: "",
    comissaoPadrao: 0,
    observacoes: "",
    situacao: "ativo",
    cidade: "",
    uf: "SP",
    enderecos: [],
    contatos: [],
    criadoEm: now,
    atualizadoEm: now,
  };
}
