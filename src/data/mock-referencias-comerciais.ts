import { MOCK_CLIENTES, type Situacao } from "./mock-clientes";

export interface ClienteVinculado {
  id: string;
  codigo: string;
  razaoSocial: string;
  nomeFantasia: string;
  cnpj: string;
  telefone: string;
  cidade: string;
  uf: string;
  situacao: Situacao;
}

export interface HistoricoItem {
  data: string;
  titulo: string;
  descricao: string;
  usuario: string;
}

export interface ReferenciaComercialCadastro {
  id: string;
  codigo: string;
  nome: string;
  telefone: string;
  email: string;
  situacao: Situacao;
  cidade: string;
  uf: string;
  observacoes: string;
  cliente: ClienteVinculado;
  criadoEm: string;
  atualizadoEm: string;
  historico: HistoricoItem[];
}

const NOMES = [
  "Carlos Eduardo",
  "Roberto Almeida",
  "Marcos Ferreira",
  "João Martins",
  "André Costa",
  "Felipe Santos",
  "Ricardo Oliveira",
  "Juliana Peixoto",
  "Patrícia Nogueira",
  "Fernando Bezerra",
  "Luciana Amaral",
  "Sérgio Bastos",
  "Daniela Moura",
  "Otávio Rangel",
  "Renata Fialho",
  "Gustavo Prado",
  "Camila Teixeira",
  "Bruno Salgado",
  "Vanessa Lopes",
  "Eduardo Bonfim",
];

const CIDADES: [string, string][] = [
  ["Natal", "RN"],
  ["Mossoró", "RN"],
  ["Recife", "PE"],
  ["Fortaleza", "CE"],
  ["João Pessoa", "PB"],
  ["Salvador", "BA"],
  ["Maceió", "AL"],
  ["Aracaju", "SE"],
  ["São Paulo", "SP"],
  ["Belo Horizonte", "MG"],
];

function tel(i: number) {
  const ddds = ["84", "81", "85", "83", "71", "82", "79", "11", "31"];
  const ddd = ddds[i % ddds.length];
  const prefixo = 8000 + ((i * 431) % 1900);
  const sufixo = String(1000 + ((i * 1373) % 8999)).padStart(4, "0");
  return `(${ddd}) 9${prefixo}-${sufixo}`;
}

function iso(y: number, m: number, d: number) {
  return new Date(Date.UTC(y, m, d, 12, 30)).toISOString();
}

export const MOCK_REFERENCIAS_COMERCIAIS: ReferenciaComercialCadastro[] = NOMES.map((nome, i) => {
  const base = MOCK_CLIENTES[i % MOCK_CLIENTES.length];
  const [cidade, uf] = CIDADES[i % CIDADES.length];
  const slug = nome.toLowerCase().split(" ")[0].normalize("NFD").replace(/[^a-z]/g, "");
  const criado = iso(2026, 6, (i % 27) + 1);
  const atualizado = iso(2026, 7, ((i * 3) % 27) + 1);
  return {
    id: `rc${i + 1}`,
    codigo: `REF-${String(i + 1).padStart(3, "0")}`,
    nome,
    telefone: tel(i),
    email: `${slug}@exemplo.com`,
    situacao: (i % 6 === 0 ? "inativo" : "ativo") as Situacao,
    cidade,
    uf,
    observacoes:
      i % 3 === 0
        ? "Referência confirmada por telefone. Histórico de pagamentos em dia."
        : "Contato indicado pelo próprio cliente no momento do cadastro.",
    cliente: {
      id: base.id,
      codigo: base.codigo,
      razaoSocial: base.razaoSocial,
      nomeFantasia: base.nomeFantasia,
      cnpj: base.cnpj,
      telefone: base.telefone,
      cidade: base.cidade,
      uf: base.uf,
      situacao: base.situacao,
    },
    criadoEm: criado,
    atualizadoEm: atualizado,
    historico: [
      { data: criado, titulo: "Cadastro criado", descricao: "Referência comercial incluída no sistema.", usuario: "Administrador" },
      {
        data: iso(2026, 7, ((i * 2) % 20) + 1),
        titulo: "Telefone atualizado",
        descricao: `Contato alterado para ${tel(i)}.`,
        usuario: "Marcelo Ramos",
      },
      {
        data: atualizado,
        titulo: "Referência vinculada ao cliente",
        descricao: `Vinculada a ${base.nomeFantasia} (${base.codigo}).`,
        usuario: "Juliana Peixoto",
      },
    ],
  };
});

/** Totais demonstrativos exibidos nos cards de resumo. */
export const RESUMO_REFERENCIAS = {
  total: 128,
  ativas: 117,
  inativas: 11,
  clientesVinculados: 94,
};
