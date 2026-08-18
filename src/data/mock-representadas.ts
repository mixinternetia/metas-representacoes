import {
  pseudoCEP,
  pseudoCNPJ,
  pseudoTel,
  type Contato,
  type Endereco,
  type Situacao,
  type TipoContato,
} from "./mock-clientes";

export interface Representada {
  id: string;
  codigo: string;
  nome: string;
  nomeFantasia: string;
  cnpj: string;
  ie: string;
  im?: string;
  email: string;
  telefone: string;
  celular?: string;
  comissaoPadrao: number;
  observacoes?: string;
  situacao: Situacao;
  cidade: string;
  uf: string;
  enderecos: Endereco[];
  contatos: Contato[];
  criadoEm: string;
  atualizadoEm: string;
}

const NOMES = [
  "Indústria Ferrari Componentes Ltda",
  "Cerâmica Monte Alto S/A",
  "Tintas Coral Sul Ltda",
  "Eletro Master Indústria Ltda",
  "Plastibrás Injetados S/A",
  "Ferramentas Titan Ltda",
  "Química Nordeste Ltda",
  "Móveis Planalto Indústria Ltda",
  "Alumínio Real S/A",
  "Fios e Cabos Bandeirante Ltda",
  "Papelaria Industrial Vega Ltda",
  "Bombas Hidra Indústria Ltda",
  "Vidros Cristal Sul S/A",
  "Calçados Passo Firme Ltda",
  "Embalagens Prisma Ltda",
];

const FANTASIAS = [
  "Ferrari Componentes", "Monte Alto", "Coral Sul", "Eletro Master",
  "Plastibrás", "Titan Tools", "Química NE", "Móveis Planalto",
  "Alumínio Real", "Bandeirante Cabos", "Vega Papéis", "Hidra Bombas",
  "Cristal Sul", "Passo Firme", "Prisma Pack",
];

const CIDADES: Array<[string, string]> = [
  ["São Paulo", "SP"], ["Caxias do Sul", "RS"], ["Joinville", "SC"],
  ["Curitiba", "PR"], ["Belo Horizonte", "MG"], ["Recife", "PE"],
  ["Natal", "RN"], ["Goiânia", "GO"], ["Fortaleza", "CE"],
  ["Salvador", "BA"], ["Campinas", "SP"], ["Porto Alegre", "RS"],
  ["Vitória", "ES"], ["Londrina", "PR"], ["Rio de Janeiro", "RJ"],
];

export const MOCK_REPRESENTADAS: Representada[] = Array.from({ length: 15 }, (_, i) => {
  const [cidade, uf] = CIDADES[i % CIDADES.length];
  const slug = FANTASIAS[i].toLowerCase().replace(/[^a-z]/g, "");
  return {
    id: `r${i + 1}`,
    codigo: String(2001 + i),
    nome: NOMES[i],
    nomeFantasia: FANTASIAS[i],
    cnpj: pseudoCNPJ(i + 200),
    ie: String(200000000 + i * 7351).slice(0, 12),
    im: i % 3 === 0 ? String(20000 + i) : "",
    email: `comercial@${slug}.com.br`,
    telefone: pseudoTel(i + 20),
    celular: pseudoTel(i + 80),
    comissaoPadrao: 3 + (i % 6) * 0.5,
    observacoes: i % 5 === 0 ? "Comissão diferenciada em campanhas sazonais." : "",
    situacao: i % 6 === 0 ? "inativo" : "ativo",
    cidade,
    uf,
    enderecos: [
      {
        id: "e1",
        tipo: "Contato",
        cep: pseudoCEP(i + 30),
        logradouro: "Av. Industrial",
        numero: String(200 + i * 11),
        complemento: i % 2 === 0 ? "Galpão 3" : "",
        bairro: "Distrito Industrial",
        cidade,
        uf,
      },
    ],
    contatos: [
      {
        id: "ct1",
        nome: ["Paulo Menezes", "Cláudia Ferraz", "Sérgio Bastos", "Luana Prado"][i % 4],
        setor: "Comercial",
        tipo: "Celular" as TipoContato,
        descricao: pseudoTel(i + 400),
        operadora: ["Vivo", "Claro", "TIM"][i % 3],
      },
      {
        id: "ct2",
        nome: ["Rafael Duarte", "Camila Nogueira", "Otávio Brandão"][i % 3],
        setor: "Faturamento",
        tipo: "E-mail" as TipoContato,
        descricao: `faturamento@${slug}.com.br`,
      },
    ],
    criadoEm: new Date(2023, (i * 3) % 12, ((i * 4) % 27) + 1).toISOString(),
    atualizadoEm: new Date(2025, (i * 5) % 12, ((i * 6) % 27) + 1).toISOString(),
  } satisfies Representada;
});
