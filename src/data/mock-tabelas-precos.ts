import type { Situacao } from "./mock-clientes";
import { MOCK_PRODUTOS } from "./mock-produtos";

export interface ItemTabela {
  id: string;
  codigo: string;
  produto: string;
  grupo: string;
  preco: number;
  atualizadoEm: string;
}

export interface HistoricoAlteracao {
  id: string;
  data: string;
  usuario: string;
  tabela: string;
  produtos: number;
  alteracao: string;
}

export interface TabelaPreco {
  id: string;
  codigo: string;
  nome: string;
  representada: string;
  situacao: Situacao;
  descricao: string;
  criadoEm: string;
  atualizadoEm: string;
  itens: ItemTabela[];
}

const DEFS: Array<[string, string, number, Situacao, string]> = [
  ["Varejo", "Alfa Componentes", 1.35, "ativo", "Tabela padrão para vendas no varejo."],
  ["Atacado", "Beta Industrial", 1.15, "ativo", "Aplicada em pedidos com volume acima de 50 unidades."],
  ["Distribuidor", "Gama Distribuição", 1.05, "ativo", "Exclusiva para distribuidores homologados."],
  ["Especial", "Delta Suprimentos", 0.95, "inativo", "Negociações especiais aprovadas pela diretoria."],
  ["Nordeste", "Alfa Componentes", 1.22, "ativo", "Tabela regional para o Nordeste."],
  ["Grandes Clientes", "Beta Industrial", 1.02, "ativo", "Clientes-chave com contrato anual."],
  ["Promoção", "Gama Distribuição", 0.88, "ativo", "Campanha promocional sazonal."],
  ["Projeto", "Delta Suprimentos", 1.1, "inativo", "Preços para projetos sob encomenda."],
];

function dia(offset: number) {
  const base = new Date(2026, 7, 18);
  base.setDate(base.getDate() - offset);
  return base.toISOString();
}

export const MOCK_TABELAS_PRECOS: TabelaPreco[] = DEFS.map(([nome, representada, fator, situacao, descricao], i) => {
  const qtd = 10 + (i % 6);
  const itens: ItemTabela[] = MOCK_PRODUTOS.slice(i, i + qtd).map((p, j) => ({
    id: `${i + 1}-${p.id}`,
    codigo: p.codigo,
    produto: p.descricao,
    grupo: p.grupo,
    preco: Number((p.precos[0].preco * fator).toFixed(2)),
    atualizadoEm: dia((i + j) % 8),
  }));

  return {
    id: `TP00${i + 1}`,
    codigo: `TP00${i + 1}`,
    nome: nome,
    representada,
    situacao,
    descricao,
    criadoEm: dia(180 + i * 10),
    atualizadoEm: dia(i),
    itens,
  };
});

export const TABELAS_KPI = {
  ativas: MOCK_TABELAS_PRECOS.filter((t) => t.situacao === "ativo").length,
  inativas: MOCK_TABELAS_PRECOS.filter((t) => t.situacao === "inativo").length,
  produtosComPreco: 1248,
  ultimaAtualizacao: "18/08/2026",
};

export const MOCK_HISTORICO: HistoricoAlteracao[] = [
  { id: "h1", data: "18/08/2026", usuario: "Administrador", tabela: "Varejo", produtos: 128, alteracao: "+5%" },
  { id: "h2", data: "16/08/2026", usuario: "Administrador", tabela: "Atacado", produtos: 84, alteracao: "-3%" },
  { id: "h3", data: "12/08/2026", usuario: "Marcelo Ramos", tabela: "Distribuidor", produtos: 56, alteracao: "+2,5%" },
  { id: "h4", data: "05/08/2026", usuario: "Administrador", tabela: "Promoção", produtos: 42, alteracao: "-12%" },
  { id: "h5", data: "28/07/2026", usuario: "Juliana Peixoto", tabela: "Nordeste", produtos: 97, alteracao: "+4%" },
];
