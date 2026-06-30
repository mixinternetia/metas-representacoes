export type ClienteSituacao = "ativo" | "inativo";

export interface Endereco {
  id: string;
  tipo: "Comercial" | "Cobrança" | "Entrega" | "Residencial";
  cep: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  uf: string;
  principal?: boolean;
}

export interface Contato {
  id: string;
  nome: string;
  cargo: string;
  email: string;
  telefone: string;
  celular?: string;
}

export interface Socio {
  id: string;
  nome: string;
  cpf: string;
  participacao: number;
  cargo: string;
}

export interface ReferenciaComercial {
  id: string;
  empresa: string;
  contato: string;
  telefone: string;
  observacoes?: string;
}

export interface DadosBancarios {
  banco: string;
  agencia: string;
  conta: string;
  tipo: "Corrente" | "Poupança";
  pix?: string;
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
  emailNF?: string;
  telefone: string;
  celular?: string;
  vendedor: string;
  situacao: ClienteSituacao;
  cidade: string;
  uf: string;
  observacoes?: string;
  limiteCredito: number;
  prazoPagamento: string;
  condicaoPagamento: string;
  dadosBancarios: DadosBancarios;
  enderecos: Endereco[];
  contatos: Contato[];
  socios: Socio[];
  referencias: ReferenciaComercial[];
  criadoEm: string;
  atualizadoEm: string;
}

const VENDEDORES = [
  "Carlos Andrade",
  "Marina Souza",
  "Ricardo Lima",
  "Patrícia Mendes",
  "João Pereira",
  "Fernanda Castro",
];

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
  ["Brasília", "DF"],
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

function pseudoCNPJ(i: number) {
  const base = (10000000000000 + i * 137311).toString().padStart(14, "0").slice(0, 14);
  return `${base.slice(0, 2)}.${base.slice(2, 5)}.${base.slice(5, 8)}/${base.slice(8, 12)}-${base.slice(12)}`;
}
function pseudoTel(i: number) {
  const ddd = 11 + (i % 80);
  const n = (90000000 + i * 1234).toString().slice(0, 8);
  return `(${ddd}) 9${n.slice(0, 4)}-${n.slice(4)}`;
}
function pseudoCEP(i: number) {
  const n = (1000000 + i * 9173).toString().slice(0, 8).padStart(8, "0");
  return `${n.slice(0, 5)}-${n.slice(5, 8)}`;
}

export const MOCK_CLIENTES: Cliente[] = Array.from({ length: 30 }, (_, i) => {
  const [cidade, uf] = CIDADES[i % CIDADES.length];
  const situacao: ClienteSituacao = i % 7 === 0 ? "inativo" : "ativo";
  const criado = new Date(2023, (i * 2) % 12, ((i * 5) % 27) + 1);
  const atualizado = new Date(2025, (i * 3) % 12, ((i * 7) % 27) + 1);
  return {
    id: `c${i + 1}`,
    codigo: String(1001 + i),
    razaoSocial: RAZOES[i],
    nomeFantasia: FANTASIAS[i],
    cnpj: pseudoCNPJ(i + 1),
    ie: String(100000000 + i * 9871).slice(0, 12),
    im: i % 3 === 0 ? String(10000 + i) : undefined,
    email: `contato@${FANTASIAS[i].toLowerCase().replace(/[^a-z]/g, "")}.com.br`,
    emailNF: `nf@${FANTASIAS[i].toLowerCase().replace(/[^a-z]/g, "")}.com.br`,
    telefone: pseudoTel(i),
    celular: pseudoTel(i + 50),
    vendedor: VENDEDORES[i % VENDEDORES.length],
    situacao,
    cidade,
    uf,
    observacoes: i % 4 === 0 ? "Cliente preferencial — atenção especial em prazos." : undefined,
    limiteCredito: 25000 + (i % 10) * 7500,
    prazoPagamento: ["30 dias", "30/60", "30/60/90", "À vista", "28 DDL"][i % 5],
    condicaoPagamento: ["Boleto", "Boleto", "PIX", "Depósito", "Cartão"][i % 5],
    dadosBancarios: {
      banco: ["Banco do Brasil", "Itaú", "Bradesco", "Santander", "Sicredi"][i % 5],
      agencia: String(1000 + i).padStart(4, "0"),
      conta: `${10000 + i * 73}-${i % 10}`,
      tipo: i % 2 === 0 ? "Corrente" : "Poupança",
      pix: `${pseudoCNPJ(i + 1)}`,
    },
    enderecos: [
      {
        id: "e1",
        tipo: "Comercial",
        cep: pseudoCEP(i),
        logradouro: `Av. Brasil`,
        numero: String(100 + i * 13),
        complemento: i % 2 === 0 ? "Sala 1201" : undefined,
        bairro: "Centro",
        cidade,
        uf,
        principal: true,
      },
      {
        id: "e2",
        tipo: "Entrega",
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
        cargo: "Compras",
        email: `compras${i}@empresa.com.br`,
        telefone: pseudoTel(i + 100),
        celular: pseudoTel(i + 200),
      },
      {
        id: "ct2",
        nome: ["Felipe Alves", "Giovana Tavares", "Heitor Nunes", "Isabela Rocha"][i % 4],
        cargo: "Financeiro",
        email: `financeiro${i}@empresa.com.br`,
        telefone: pseudoTel(i + 300),
      },
    ],
    socios: [
      {
        id: "s1",
        nome: ["Roberto Almeida", "Sandra Vieira", "Tiago Moraes"][i % 3],
        cpf: `${(100 + i).toString().padStart(3, "0")}.${(200 + i).toString().padStart(3, "0")}.${(300 + i).toString().padStart(3, "0")}-${(10 + (i % 89)).toString().padStart(2, "0")}`,
        participacao: 60,
        cargo: "Sócio Administrador",
      },
      {
        id: "s2",
        nome: ["Vera Lúcia", "Marcos Paulo", "Renata Dias"][i % 3],
        cpf: `${(400 + i).toString().padStart(3, "0")}.${(500 + i).toString().padStart(3, "0")}.${(600 + i).toString().padStart(3, "0")}-${(20 + (i % 79)).toString().padStart(2, "0")}`,
        participacao: 40,
        cargo: "Sócio",
      },
    ],
    referencias: [
      {
        id: "r1",
        empresa: "Fornecedor Plus Ltda",
        contato: "Marcelo Aguiar",
        telefone: pseudoTel(i + 500),
        observacoes: "Relacionamento há mais de 5 anos.",
      },
      {
        id: "r2",
        empresa: "Distribuidora Nacional S/A",
        contato: "Joana Prado",
        telefone: pseudoTel(i + 600),
      },
    ],
    criadoEm: criado.toISOString(),
    atualizadoEm: atualizado.toISOString(),
  };
});

export const UFS = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"
];

export const VENDEDORES_LIST = VENDEDORES;
