import {
  pseudoCEP,
  pseudoCNPJ,
  pseudoTel,
  type Contato,
  type Endereco,
  type Situacao,
  type TipoContato,
} from "./mock-clientes";

export interface Filial {
  id: string;
  nome: string;
  uf: string;
  telefone: string;
  email: string;
  cep: string;
  logradouro: string;
  numero: string;
  cidade: string;
  bairro: string;
  complemento?: string;
}

export interface Transportadora {
  id: string;
  codigo: string;
  nome: string;
  nomeFantasia: string;
  cnpj: string;
  email: string;
  telefone: string;
  celular: string;
  cidade: string;
  uf: string;
  situacao: Situacao;
  observacoes?: string;
  filiais: Filial[];
  contatos: Contato[];
  enderecos: Endereco[];
  criadoEm: string;
  atualizadoEm: string;
}

const NOMES = [
  "TransLog Nordeste Transportes Ltda",
  "Rota Express Logística Ltda",
  "Nordeste Cargas Transportes S/A",
  "Via Brasil Transportes Ltda",
  "RN Logística e Distribuição Ltda",
  "Expresso Potiguar Transportes Ltda",
  "Carga Forte Transportes Ltda",
  "Brasil Norte Transportes S/A",
  "Sul Rápido Cargas Ltda",
  "Atlântico Transportes Rodoviários Ltda",
  "Planalto Cargas Ltda",
  "Litoral Log Transportes Ltda",
  "Serra Azul Transportes Ltda",
  "Interior Express Cargas Ltda",
  "Meta Rodo Transportes S/A",
];

const FANTASIAS = [
  "TransLog Nordeste", "Rota Express", "Nordeste Cargas", "Via Brasil",
  "RN Logística", "Expresso Potiguar", "Carga Forte", "Brasil Norte",
  "Sul Rápido", "Atlântico Rodo", "Planalto Cargas", "Litoral Log",
  "Serra Azul", "Interior Express", "Meta Rodo",
];

const CIDADES: Array<[string, string]> = [
  ["Natal", "RN"], ["Recife", "PE"], ["Fortaleza", "CE"],
  ["São Paulo", "SP"], ["Mossoró", "RN"], ["João Pessoa", "PB"],
  ["Salvador", "BA"], ["Belém", "PA"], ["Porto Alegre", "RS"],
  ["Vitória", "ES"], ["Goiânia", "GO"], ["Maceió", "AL"],
  ["Belo Horizonte", "MG"], ["Campinas", "SP"], ["Curitiba", "PR"],
];

const BAIRROS = ["Distrito Industrial", "Centro", "Zona Norte", "Alecrim", "Boa Viagem", "Bairro Industrial"];

const UFS_FILIAIS: Array<[string, string]> = [
  ["RN", "Natal"], ["PE", "Recife"], ["CE", "Fortaleza"],
  ["SP", "São Paulo"], ["BA", "Salvador"], ["PB", "João Pessoa"],
];

export const MOCK_TRANSPORTADORAS: Transportadora[] = Array.from({ length: 15 }, (_, i) => {
  const [cidade, uf] = CIDADES[i % CIDADES.length];
  const slug = FANTASIAS[i].toLowerCase().replace(/[^a-z]/g, "");
  const qtdFiliais = (i % 3) + 1;

  return {
    id: `t${i + 1}`,
    codigo: String(3001 + i),
    nome: NOMES[i],
    nomeFantasia: FANTASIAS[i],
    cnpj: pseudoCNPJ(i + 500),
    email: `contato@${slug}.com.br`,
    telefone: pseudoTel(i + 300).replace(") 9", ") 3"),
    celular: pseudoTel(i + 340),
    cidade,
    uf,
    situacao: i % 5 === 0 ? "inativo" : "ativo",
    observacoes:
      i % 4 === 0
        ? "Atende entregas em todo o Nordeste com coleta programada às terças e quintas."
        : "Prazo médio de entrega de 3 a 5 dias úteis para capitais.",
    filiais: Array.from({ length: qtdFiliais }, (_, j) => {
      const [fuf, fcidade] = UFS_FILIAIS[(i + j) % UFS_FILIAIS.length];
      return {
        id: `f${i}-${j}`,
        nome: `Filial ${fuf}`,
        uf: fuf,
        telefone: pseudoTel(i * 3 + j + 10).replace(") 9", ") 3"),
        email: `${fcidade.toLowerCase().replace(/[^a-z]/g, "")}@${slug}.com.br`,
        cep: pseudoCEP(i * 5 + j + 7),
        logradouro: ["Av. das Indústrias", "Rod. BR-101, Km", "Rua dos Transportes"][(i + j) % 3],
        numero: String(100 + i * 13 + j * 7),
        cidade: fcidade,
        bairro: BAIRROS[(i + j) % BAIRROS.length],
        complemento: j % 2 === 0 ? `Galpão ${j + 1}` : "",
      } satisfies Filial;
    }),
    contatos: [
      {
        id: `tc${i}-1`,
        nome: ["Adriano Melo", "Juliana Torres", "Marcos Vinícius", "Renata Alves"][i % 4],
        setor: "Operações / Coleta",
        tipo: "Celular" as TipoContato,
        descricao: pseudoTel(i + 700),
        operadora: ["Vivo", "Claro", "TIM"][i % 3],
      },
      {
        id: `tc${i}-2`,
        nome: ["Sandra Vieira", "Eduardo Pinto", "Larissa Gomes"][i % 3],
        setor: "Faturamento",
        tipo: "E-mail" as TipoContato,
        descricao: `financeiro@${slug}.com.br`,
      },
      {
        id: `tc${i}-3`,
        nome: ["Central de Atendimento", "SAC Transporte"][i % 2],
        setor: "Atendimento",
        tipo: "Telefone Fixo" as TipoContato,
        descricao: pseudoTel(i + 120).replace(") 9", ") 3"),
      },
      {
        id: `tc${i}-4`,
        nome: FANTASIAS[i],
        setor: "Marketing",
        tipo: (["Instagram", "Facebook", "Skype", "X"] as TipoContato[])[i % 4],
        descricao: `@${slug}`,
      },
    ],
    enderecos: [
      {
        id: `te${i}-1`,
        tipo: "Contato",
        cep: pseudoCEP(i + 60),
        logradouro: "Av. Logística",
        numero: String(500 + i * 9),
        complemento: i % 2 === 0 ? "Terminal 2" : "",
        bairro: BAIRROS[i % BAIRROS.length],
        cidade,
        uf,
      },
      {
        id: `te${i}-2`,
        tipo: "Correspondência financeira",
        cep: pseudoCEP(i + 90),
        logradouro: "Rua do Comércio",
        numero: String(50 + i * 3),
        bairro: "Centro",
        cidade,
        uf,
      },
    ],
    criadoEm: new Date(2023, (i * 2) % 12, ((i * 5) % 27) + 1).toISOString(),
    atualizadoEm: new Date(2026, (i * 3) % 8, ((i * 4) % 27) + 1).toISOString(),
  } satisfies Transportadora;
});
