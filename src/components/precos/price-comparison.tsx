import { useMemo, useState } from "react";
import { GitCompareArrows } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Field } from "@/components/shared/form-section";
import { formatBRL } from "@/data/mock-produtos";
import { MOCK_TABELAS_PRECOS } from "@/data/mock-tabelas-precos";

/** 7.8 — Comparação demonstrativa de preços entre duas tabelas. */
export function PriceComparison({ tabelaPadraoId }: { tabelaPadraoId?: string }) {
  const [a, setA] = useState(tabelaPadraoId ?? MOCK_TABELAS_PRECOS[0].id);
  const [b, setB] = useState(MOCK_TABELAS_PRECOS[1].id);

  const tabelaA = MOCK_TABELAS_PRECOS.find((t) => t.id === a)!;
  const tabelaB = MOCK_TABELAS_PRECOS.find((t) => t.id === b)!;

  const linhas = useMemo(() => {
    return tabelaA.itens
      .map((item) => {
        const par = tabelaB.itens.find((i) => i.codigo === item.codigo);
        if (!par) return null;
        const dif = ((par.preco - item.preco) / item.preco) * 100;
        return { codigo: item.codigo, produto: item.produto, precoA: item.preco, precoB: par.preco, dif };
      })
      .filter((x): x is NonNullable<typeof x> => x !== null);
  }, [tabelaA, tabelaB]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Field label="Tabela A">
          <Select value={a} onValueChange={setA}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {MOCK_TABELAS_PRECOS.map((t) => (
                <SelectItem key={t.id} value={t.id}>{t.codigo} · {t.nome}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Tabela B">
          <Select value={b} onValueChange={setB}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {MOCK_TABELAS_PRECOS.map((t) => (
                <SelectItem key={t.id} value={t.id}>{t.codigo} · {t.nome}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </div>

      {linhas.length === 0 ? (
        <div className="flex items-center gap-2 rounded-md border bg-muted/40 p-4 text-sm text-muted-foreground">
          <GitCompareArrows className="h-4 w-4" />
          Nenhum produto em comum entre as tabelas selecionadas.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead className="w-24">Código</TableHead>
                <TableHead>Produto</TableHead>
                <TableHead className="w-32 text-right">{tabelaA.nome}</TableHead>
                <TableHead className="w-32 text-right">{tabelaB.nome}</TableHead>
                <TableHead className="w-28 text-right">Diferença</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {linhas.map((l) => (
                <TableRow key={l.codigo} className="hover:bg-muted/30">
                  <TableCell className="font-mono text-xs">{l.codigo}</TableCell>
                  <TableCell className="font-medium">{l.produto}</TableCell>
                  <TableCell className="text-right tabular-nums">{formatBRL(l.precoA)}</TableCell>
                  <TableCell className="text-right tabular-nums">{formatBRL(l.precoB)}</TableCell>
                  <TableCell className="text-right">
                    {Math.abs(l.dif) < 0.005 ? (
                      <Badge variant="secondary" className="text-muted-foreground">0%</Badge>
                    ) : l.dif > 0 ? (
                      <Badge className="border-success/30 bg-success/10 text-success hover:bg-success/15">
                        +{l.dif.toFixed(2).replace(".", ",")}%
                      </Badge>
                    ) : (
                      <Badge variant="destructive">{l.dif.toFixed(2).replace(".", ",")}%</Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
