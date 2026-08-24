import {
  pseudoCEP,
  pseudoCPF,
  pseudoTel,
  type Endereco,
  type Situacao,
} from "./mock-clientes";
import { MOCK_REPRESENTADAS } from "./mock-representadas";

export interface ComissaoRepresentada {
  id: string;
  representadaId: string;
  representada: string;
  cnpj: string;
  comissao: number;
  situacao: Situacao;
}

export interface VendedorCadastro {
  id: string;
  codigo: string;
  nome: string;
  cpf: string;
  rg: string;
  dataNascimento: string;
  telefone: string;
  email: string;
  cidade: string;
  uf: string;
  situacao: Situacao;
  observacoes?: string;
  comissoes: ComissaoRepresentada[];
  enderecos: Endereco[];
  clientesAtendidos: number;
  criadoEm: string;
  atualizadoEm: string;
}

const NOMES = [
  "Carlos Henrique Almeida",
  "Marcelo Fernandes",
  "Rafael Oliveira",
  "André Martins",
  "Paulo Henrique Costa",
  "Bruno Carvalho",
  "Felipe Rodrigues",
  "Gustavo Ramalho",
  "Leandro Bezerra",
  "Thiago Barbosa",
  "Juliana Peixoto",
  "Mariana Duarte",
  "Patrícia Nogueira",
  "Fernanda Coelho",
  "Camila Siqueira",
  "Rodrigo Tavares",
  "Vinícius Amorim",
  "Eduardo Sampaio",
  "Larissa Monteiro",
  "Aline Bastos",
];

const CIDADES: Array<[string, string]> = [
  ["Natal", "RN"], ["Recife", "PE"], ["Fortaleza", "CE"],
  ["São Paulo", "SP"], ["Mossoró", "RN"], ["João Pessoa", "PB"],
  ["Salvador", "BA"], ["Belo Horizonte", "MG"], ["Curitiba", "PR"],
  ["Porto Alegre", "RS"],
];

export const MOCK_VENDEDORES: VendedorCadastro[] = Array.from({ length: 20 }, (_, i) => {
  const [cidade, uf] = CIDADES[i % CIDADES.length];
  const nome = NOMES[i];
  const slug = nome.toLowerCase().split(" ")[0];
  const qtdReps = (i % 4) + 1;

  return {
    id: `v${i + 1}`,
    codigo: String(4001 + i),
    nome,
    cpf: pseudoCPF(i + 40),
    rg: String(1000000 + i * 4321),
    dataNascimento: new Date(1975 + (i % 20), (i * 3) % 12, ((i * 7) % 27) + 1).toISOString(),
    telefone: pseudoTel(i + 900),
    email: `${slug}.${i + 1}@metasrepresentacoes.com.br`,
    cidade,
    uf,
    situacao: i % 6 === 0 ? "inativo" : "ativo",
    observacoes:
      i % 3 === 0
        ? "Atua principalmente na carteira do interior, com foco em lojas de material de construção."
        : "Vendedor externo com rota semanal definida.",
    comissoes: Array.from({ length: qtdReps }, (_, j) => {
      const rep = MOCK_REPRESENTADAS[(i + j * 3) % MOCK_REPRESENTADAS.length];
      return {
        id: `vc${i}-${j}`,
        representadaId: rep.id,
        representada: rep.nomeFantasia,
        cnpj: rep.cnpj,
        comissao: 3.5 + ((i + j) % 6) * 0.5,
        situacao: (j % 5 === 4 ? "inativo" : "ativo") as Situacao,
      } satisfies ComissaoRepresentada;
    }),
    enderecos: [
      {
        id: `ve${i}-1`,
        tipo: "Correspondência financeira",
        cep: pseudoCEP(i + 15),
        logradouro: ["Rua das Acácias", "Av. Central", "Rua Projetada"][i % 3],
        numero: String(30 + i * 6),
        complemento: i % 2 === 0 ? `Apto ${100 + i}` : "",
        bairro: ["Tirol", "Centro", "Jardim Europa", "Boa Viagem"][i % 4],
        cidade,
        uf,
      },
      {
        id: `ve${i}-2`,
        tipo: "Contato",
        cep: pseudoCEP(i + 55),
        logradouro: "Av. Comercial",
        numero: String(800 + i * 4),
        bairro: "Centro",
        cidade,
        uf,
      },
    ],
    clientesAtendidos: 12 + ((i * 7) % 45),
    criadoEm: new Date(2022, (i * 4) % 12, ((i * 3) % 27) + 1).toISOString(),
    atualizadoEm: new Date(2026, (i * 2) % 8, ((i * 5) % 27) + 1).toISOString(),
  } satisfies VendedorCadastro;
});

export function comissaoMedia(v: VendedorCadastro) {
  if (v.comissoes.length === 0) return 0;
  return v.comissoes.reduce((s, c) => s + c.comissao, 0) / v.comissoes.length;
}
