import { pseudoTel, type ReferenciaComercial } from "./mock-clientes";

/**
 * Cadastro de Referências Comerciais do sistema.
 * No cadastro de cliente, as referências são importadas daqui.
 */
export const MOCK_REFERENCIAS: ReferenciaComercial[] = [
  "Fornecedor Plus Ltda",
  "Distribuidora Nacional S/A",
  "Comercial Bandeirantes Ltda",
  "Atacadão Real Ltda",
  "Insumos do Vale S/A",
  "Casa das Ferragens Ltda",
  "Nordeste Suprimentos Ltda",
  "Sul Componentes Ltda",
  "Central de Embalagens Ltda",
  "Prime Distribuidora S/A",
  "Rede Forte Comercial Ltda",
  "Mercantil Aurora Ltda",
].map((nome, i) => ({
  id: `ref${i + 1}`,
  nome,
  telefone: pseudoTel(i + 900),
  situacao: i % 5 === 0 ? "inativo" : "ativo",
}));
