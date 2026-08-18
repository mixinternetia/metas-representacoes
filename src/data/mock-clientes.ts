export type Situacao = "ativo" | "inativo";
export type ClienteSituacao = Situacao;

export const TIPOS_CONTATO = [
  "Celular",
  "E-mail",
  "Skype",
  "Facebook",
  "Instagram",
  "Telefone Fixo",
  "X",
] as const;
export type TipoContato = (typeof TIPOS_CONTATO)[number];

export const OPERADORAS = ["Vivo", "Claro", "TIM", "Oi", "Algar", "Outra"] as const;

export const TIPOS_ENDERECO = [
  "Entrega de mercadoria",
  "Contato",
  "Correspondência financeira",
  "Outros",
] as const;
export type TipoEndereco = (typeof TIPOS_ENDERECO)[number];

export interface Endereco {
  id: string;
  tipo: TipoEndereco;
  cep: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  uf: string;
}

export interface Contato {
  id: string;
  nome: string;
  setor: string;
  tipo: TipoContato;
  descricao: string;
  operadora?: string;
}

export interface Socio {
  id: string;
  nome: string;
  cpf: string;
  dataNascimento: string;
  participacao: number;
}

export interface ReferenciaComercial {
  id: string;
  nome: string;
  telefone: string;
  situacao: Situacao;
}

export interface DadosBancarios {
  banco: string;
  agencia: string;
  conta: string;
  correntista: string;
  telefoneCorrentista: string;
}

export interface Cliente {
  id: string;
  codigo: string;
  razaoSocial: string;
  nomeFantasia: string;
  cnpj: string;
  ie: string;
  im?: string;
  email: string;
  emailDanfe?: string;
  emailCopia?: string;
  telefone: string;
  celular?: string;
  vendedor: string;
  situacao: Situacao;
  cidade: string;
  uf: string;
  observacoes?: string;
  dadosBancarios: DadosBancarios;
  enderecos: Endereco[];
  contatos: Contato[];
  socios: Socio[];
  referencias: ReferenciaComercial[];
  criadoEm: string;
  atualizadoEm: string;
  volumeVendas: number;
}

export interface Vendedor {
  codigo: string;
  nome: string;
}

export const VENDEDORES: Vendedor[] = [
  { codigo: "V001", nome: "Carlos Andrade" },
  { codigo: "V002", nome: "Marina Souza" },
  { codigo: "V003", nome: "Ricardo Lima" },
  { codigo: "V004", nome: "Patrícia Mendes" },
  { codigo: "V005", nome: "João Pereira" },
  { codigo: "V006", nome: "Fernanda Castro" },
];

export const VENDEDORES_LIST = VENDEDORES.map((v) => v.nome);

const CIDADES: Array<[string, string]> = [
  ["São Paulo", "SP"],
  ["Campinas", "SP"],
  ["Ribeirão Preto", "SP"],
  ["Rio de Janeiro", "RJ"],
  ["Niterói", "RJ"],
  ["Belo Horizonte", "MG"],
  ["Uberlândia", "MG"],
  ["Curitiba", "PR"],
  ["Londrina", "PR"],
  ["Porto Alegre", "RS"],
  ["Caxias do Sul", "RS"],
  ["Florianópolis", "SC"],
  ["Joinville", "SC"],
  ["Salvador", "BA"],
  ["Recife", "PE"],
  ["Fortaleza", "CE"],
  ["Natal", "RN"],
  ["Goiânia", "GO"],
  ["Manaus", "AM"],
  ["Vitória", "ES"],
];

const RAZOES = [
  "Indústria Metalúrgica Aurora Ltda",
  "Comercial Atlas Distribuidora S/A",
  "Têxtil Horizonte Confecções Ltda",
  "Alfa Componentes Elétricos Ltda",
  "Beta Suprimentos Industriais S/A",
  "Gamma Logística e Transportes Ltda",
  "Delta Engenharia e Construções Ltda",
  "Epsilon Soluções em TI S/A",
  "Zeta Plásticos e Embalagens Ltda",
  "Ômega Aço e Ferro Ltda",
  "Polo Norte Distribuidora Ltda",
  "Vale Verde Agroindústria S/A",
  "Costa Azul Pescados Ltda",
  "Pampa Sul Alimentos Ltda",
  "Serra Dourada Mineração Ltda",
  "Cerrado Bebidas Ltda",
  "Atlântico Comercial S/A",
  "Pacífico Importação Ltda",
  "Mediterrâneo Cosméticos Ltda",
  "Caribe Distribuidora Ltda",
  "Andes Logística Internacional S/A",
  "Himalaia Confecções Ltda",
  "Sahara Construtora Ltda",
  "Amazônia Madeireira Ltda",
  "Pantanal Alimentos S/A",
  "Iguaçu Energia e Soluções Ltda",
  "São Bento Indústria Têxtil Ltda",
  "Santa Clara Laticínios Ltda",
  "Bom Jardim Hortifrúti Ltda",
  "Boa Vista Distribuidora S/A",
];

const FANTASIAS = [
  "Aurora Metais", "Atlas Distribuidora", "Horizonte Têxtil", "Alfa Elétrica",
  "Beta Suprimentos", "Gamma Log", "Delta Engenharia", "Epsilon TI",
  "Zeta Pack", "Ômega Aços", "Polo Norte", "Vale Verde",
  "Costa Azul", "Pampa Sul", "Serra Dourada", "Cerrado Beverages",
  "Atlântico Co.", "Pacífico Imports", "Med Cosméticos", "Caribe Dist.",
  "Andes Log", "Himalaia Wear", "Sahara Build", "Amazônia Wood",
  "Pantanal Foods", "Iguaçu Energy", "São Bento Têxtil", "Santa Clara",
  "Bom Jardim", "Boa Vista",
];

export function pseudoCNPJ(i: number) {
  const base = (10000000000000 + i * 137311).toString().padStart(14, "0").slice(0, 14);
  return `${base.slice(0, 2)}.${base.slice(2, 5)}.${base.slice(5, 8)}/${base.slice(8, 12)}-${base.slice(12)}`;
}
export function pseudoTel(i: number) {
  const ddd = 11 + (i % 80);
  const n = (90000000 + i * 1234).toString().slice(0, 8);
  return `(${ddd}) 9${n.slice(0, 4)}-${n.slice(4)}`;
}
export function pseudoCEP(i: number) {
  const n = (1000000 + i * 9173).toString().slice(0, 8).padStart(8, "0");
  return `${n.slice(0, 5)}-${n.slice(5, 8)}`;
}
export function pseudoCPF(i: number) {
  const d = (10000000000 + i * 7654321).toString().slice(0, 11);
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
}

export const MOCK_CLIENTES: Cliente[] = Array.from({ length: 30 }, (_, i) => {
  const [cidade, uf] = CIDADES[i % CIDADES.length];
  const situacao: Situacao = i % 7 === 0 ? "inativo" : "ativo";
  const criado = new Date(2023, (i * 2) % 12, ((i * 5) % 27) + 1);
  const atualizado = new Date(2025, (i * 3) % 12, ((i * 7) % 27) + 1);
  const slug = FANTASIAS[i].toLowerCase().replace(/[^a-z]/g, "");
  return {
    id: `c${i + 1}`,
    codigo: String(1001 + i),
    razaoSocial: RAZOES[i],
    nomeFantasia: FANTASIAS[i],
    cnpj: pseudoCNPJ(i + 1),
    ie: String(100000000 + i * 9871).slice(0, 12),
    im: i % 3 === 0 ? String(10000 + i) : "",
    email: `contato@${slug}.com.br`,
    emailDanfe: `danfe@${slug}.com.br`,
    emailCopia: i % 2 === 0 ? `copia@${slug}.com.br` : "",
    telefone: pseudoTel(i),
    celular: pseudoTel(i + 50),
    vendedor: VENDEDORES[i % VENDEDORES.length].nome,
    situacao,
    cidade,
    uf,
    observacoes: i % 4 === 0 ? "Cliente preferencial — atenção especial em prazos." : "",
    volumeVendas: 45000 + ((i * 8123) % 320000),
    dadosBancarios: {
      banco: ["Banco do Brasil", "Itaú", "Bradesco", "Santander", "Sicredi"][i % 5],
      agencia: String(1000 + i).padStart(4, "0"),
      conta: `${10000 + i * 73}-${i % 10}`,
      correntista: RAZOES[i],
      telefoneCorrentista: pseudoTel(i + 700),
    },
    enderecos: [
      {
        id: "e1",
        tipo: "Entrega de mercadoria",
        cep: pseudoCEP(i),
        logradouro: "Av. Brasil",
        numero: String(100 + i * 13),
        complemento: i % 2 === 0 ? "Sala 1201" : "",
        bairro: "Centro",
        cidade,
        uf,
      },
      {
        id: "e2",
        tipo: "Correspondência financeira",
        cep: pseudoCEP(i + 7),
        logradouro: "Rod. Anhanguera, km",
        numero: String(20 + (i % 60)),
        bairro: "Distrito Industrial",
        cidade,
        uf,
      },
    ],
    contatos: [
      {
        id: "ct1",
        nome: ["Ana Lima", "Bruno Costa", "Carlos Reis", "Diana Souza", "Eduardo Pinto"][i % 5],
        setor: "Compras",
        tipo: "Celular" as TipoContato,
        descricao: pseudoTel(i + 100),
        operadora: ["Vivo", "Claro", "TIM"][i % 3],
      },
      {
        id: "ct2",
        nome: ["Felipe Alves", "Giovana Tavares", "Heitor Nunes", "Isabela Rocha"][i % 4],
        setor: "Financeiro",
        tipo: "E-mail" as TipoContato,
        descricao: `financeiro@${slug}.com.br`,
      },
    ],
    socios: [
      {
        id: "s1",
        nome: ["Roberto Almeida", "Sandra Vieira", "Tiago Moraes"][i % 3],
        cpf: pseudoCPF(i + 1),
        dataNascimento: `19${60 + (i % 30)}-0${(i % 9) + 1}-1${i % 9}`,
        participacao: 60,
      },
      {
        id: "s2",
        nome: ["Vera Lúcia Ramos", "Marcos Paulo Dias", "Renata Dias"][i % 3],
        cpf: pseudoCPF(i + 40),
        dataNascimento: `19${55 + (i % 30)}-0${(i % 9) + 1}-2${i % 8}`,
        participacao: 40,
      },
    ],
    referencias: [],
    criadoEm: criado.toISOString(),
    atualizadoEm: atualizado.toISOString(),
  } satisfies Cliente;
});

export const UFS = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"
];

export const CIDADES_LIST = Array.from(new Set(CIDADES.map(([c]) => c))).sort();
