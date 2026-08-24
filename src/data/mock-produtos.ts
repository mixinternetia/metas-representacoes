import type { Situacao } from "./mock-clientes";
import { MOCK_REPRESENTADAS } from "./mock-representadas";

export const GRUPOS_PRODUTO = [
  "Ferragens",
  "Elétricos",
  "Hidráulicos",
  "Pintura",
  "Embalagens",
  "Utilidades",
] as const;

export const TABELAS_PRECO_NOMES = [
  "Varejo",
  "Atacado",
  "Distribuidor",
  "Especial",
] as const;

export interface PrecoTabela {
  tabelaId: string;
  tabela: string;
  preco: number;
  atualizadoEm: string;
  situacao: Situacao;
}

export interface Catalogo {
  numero: number;
  pagina: number;
  ordem: number;
}

export interface Produto {
  id: string;
  codigo: string;
  descricao: string;
  representadaId: string;
  representada: string;
  codigoFabrica: string;
  grupo: string;
  embalagem: string;
  codigoBarras: string;
  dum14: string;
  ncm: string;
  estoque: number;
  emLinha: boolean;
  catalogo: Catalogo;
  precoAtual: number;
  tabelaAtual: string;
  precos: PrecoTabela[];
  criadoEm: string;
  atualizadoEm: string;
}

const BASES = [
  "Produto Alfa 10",
  "Produto Alfa 20",
  "Produto Beta Premium",
  "Produto Gama Standard",
  "Produto Delta Plus",
  "Produto Omega 500",
  "Produto Sigma 120",
  "Produto Lambda Compact",
  "Produto Zeta Industrial",
  "Produto Kappa Reforçado",
];

const EMBALAGENS = ["Caixa 12 un", "Caixa 24 un", "Pacote 6 un", "Unidade", "Fardo 10 kg", "Galão 18 L"];
const NCMS = ["3925.90.80", "8536.50.90", "3917.40.00", "3208.10.10", "4819.10.00", "7326.90.90"];

function d(day: number) {
  const base = new Date(2026, 7, 1);
  base.setDate(base.getDate() + (day % 20));
  return base.toISOString();
}

export const MOCK_PRODUTOS: Produto[] = Array.from({ length: 30 }, (_, i) => {
  const rep = MOCK_REPRESENTADAS[i % MOCK_REPRESENTADAS.length];
  const base = BASES[i % BASES.length];
  const variante = Math.floor(i / BASES.length);
  const descricao = variante === 0 ? base : `${base} — Linha ${variante + 1}`;
  const precoBase = 45 + i * 11.35;
  const emLinha = i % 7 !== 3;

  const precos: PrecoTabela[] = TABELAS_PRECO_NOMES.map((nome, t) => ({
    tabelaId: `TP00${t + 1}`,
    tabela: nome,
    preco: Number((precoBase * [1.35, 1.15, 1.05, 0.95][t]).toFixed(2)),
    atualizadoEm: d(i + t),
    situacao: t === 3 && i % 5 === 0 ? "inativo" : "ativo",
  }));

  return {
    id: `p${i + 1}`,
    codigo: String(10001 + i),
    descricao,
    representadaId: rep.id,
    representada: rep.nomeFantasia,
    codigoFabrica: `F-${1000 + i * 7}`,
    grupo: GRUPOS_PRODUTO[i % GRUPOS_PRODUTO.length],
    embalagem: EMBALAGENS[i % EMBALAGENS.length],
    codigoBarras: `789${String(100000000 + i * 137).slice(0, 10)}`,
    dum14: `1789${String(100000000 + i * 137).slice(0, 10)}`,
    ncm: NCMS[i % NCMS.length],
    estoque: (i * 37) % 480,
    emLinha,
    catalogo: { numero: (i % 4) + 1, pagina: (i % 12) + 1, ordem: (i % 6) + 1 },
    precoAtual: precos[0].preco,
    tabelaAtual: "Varejo",
    precos,
    criadoEm: d(i),
    atualizadoEm: d(i + 3),
  };
});

/** Indicadores fictícios exibidos nos cards de resumo. */
export const PRODUTOS_KPI = {
  total: 1248,
  ativos: 1102,
  foraLinha: 146,
  representadas: 12,
  precoAtualizado: 1087,
};

export function formatBRL(n: number) {
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 2 });
}
