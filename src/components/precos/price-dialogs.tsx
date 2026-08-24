import { useMemo, useState } from "react";
import { toast } from "sonner";
import { ArrowRightLeft, Calculator, FileSpreadsheet, Percent, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Field } from "@/components/shared/form-section";
import { GRUPOS_PRODUTO, MOCK_PRODUTOS, TABELAS_PRECO_NOMES, formatBRL } from "@/data/mock-produtos";
import { MOCK_REPRESENTADAS } from "@/data/mock-representadas";

const PROXIMA_FASE = "Esta funcionalidade será implementada em uma próxima fase.";

function PreviewRow({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className={strong ? "font-semibold tabular-nums" : "tabular-nums"}>{value}</span>
    </div>
  );
}

function Preview({ children }: { children: React.ReactNode }) {
  return <div className="space-y-1.5 rounded-md border bg-muted/40 p-3">{children}</div>;
}

/** 6.10 — Ajuste de preços de um produto (simulação). */
export function PriceAdjustmentDialog({
  open,
  onOpenChange,
  precoAtual,
  produto,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  precoAtual: number;
  produto: string;
}) {
  const [tipo, setTipo] = useState<"acrescimo" | "desconto">("acrescimo");
  const [percentual, setPercentual] = useState("10");
  const [simulado, setSimulado] = useState<number | null>(null);

  const pct = Number(percentual.replace(",", ".")) || 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Ajuste de Preços</DialogTitle>
          <DialogDescription>{produto} — simulação sem alteração dos dados.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Field label="Tipo de alteração">
            <RadioGroup value={tipo} onValueChange={(v) => setTipo(v as typeof tipo)} className="flex gap-6">
              <div className="flex items-center gap-2">
                <RadioGroupItem value="acrescimo" id="aj-acr" />
                <Label htmlFor="aj-acr" className="text-sm font-normal">Aplicar acréscimo</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="desconto" id="aj-desc" />
                <Label htmlFor="aj-desc" className="text-sm font-normal">Aplicar desconto</Label>
              </div>
            </RadioGroup>
          </Field>

          <Field label="Percentual (%)">
            <Input value={percentual} onChange={(e) => setPercentual(e.target.value)} inputMode="decimal" />
          </Field>

          {simulado !== null && (
            <Preview>
              <PreviewRow label="Preço atual" value={formatBRL(precoAtual)} />
              <PreviewRow label="Percentual" value={`${tipo === "desconto" ? "-" : "+"}${pct}%`} />
              <PreviewRow label="Novo preço simulado" value={formatBRL(simulado)} strong />
            </Preview>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Fechar</Button>
          <Button
            onClick={() => {
              const fator = tipo === "desconto" ? 1 - pct / 100 : 1 + pct / 100;
              setSimulado(Number((precoAtual * fator).toFixed(2)));
              toast.success("Prévia da alteração gerada.");
            }}
          >
            <Calculator className="mr-1.5 h-4 w-4" /> Simular alteração
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/** 6.11 — Copiar preços entre produtos. */
export function CopyPricesDialog({
  open,
  onOpenChange,
  origemPadrao,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  origemPadrao?: string;
}) {
  const [origem, setOrigem] = useState(origemPadrao ?? MOCK_PRODUTOS[0].id);
  const [destino, setDestino] = useState(MOCK_PRODUTOS[1].id);
  const [tabela, setTabela] = useState<string>(TABELAS_PRECO_NOMES[0]);
  const [percentual, setPercentual] = useState("0");
  const [resultado, setResultado] = useState<{ de: number; para: number } | null>(null);

  const produtoOrigem = MOCK_PRODUTOS.find((p) => p.id === origem)!;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Copiar preços entre produtos</DialogTitle>
          <DialogDescription>Simulação da cópia de preços de um produto para outro.</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label="Produto origem">
            <Select value={origem} onValueChange={setOrigem}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {MOCK_PRODUTOS.map((p) => (
                  <SelectItem key={p.id} value={p.id}>{p.codigo} · {p.descricao}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Produto destino">
            <Select value={destino} onValueChange={setDestino}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {MOCK_PRODUTOS.map((p) => (
                  <SelectItem key={p.id} value={p.id}>{p.codigo} · {p.descricao}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Tabela de preço">
            <Select value={tabela} onValueChange={setTabela}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {TABELAS_PRECO_NOMES.map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Percentual de ajuste (%)">
            <Input value={percentual} onChange={(e) => setPercentual(e.target.value)} inputMode="decimal" />
          </Field>
        </div>

        {resultado && (
          <Preview>
            <PreviewRow label={`Preço origem (${tabela})`} value={formatBRL(resultado.de)} />
            <PreviewRow label="Percentual" value={`${percentual}%`} />
            <PreviewRow label="Preço aplicado no destino" value={formatBRL(resultado.para)} strong />
          </Preview>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Fechar</Button>
          <Button
            onClick={() => {
              const de = produtoOrigem.precos.find((p) => p.tabela === tabela)?.preco ?? produtoOrigem.precoAtual;
              const pct = Number(percentual.replace(",", ".")) || 0;
              setResultado({ de, para: Number((de * (1 + pct / 100)).toFixed(2)) });
              toast.success("Prévia da cópia gerada.");
            }}
          >
            <ArrowRightLeft className="mr-1.5 h-4 w-4" /> Simular
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/** 6.12 — Alterações gerais de preços. */
export function GeneralPriceChangesDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [representada, setRepresentada] = useState(MOCK_REPRESENTADAS[0].id);
  const [grupo, setGrupo] = useState<string>(GRUPOS_PRODUTO[0]);
  const [tabela, setTabela] = useState<string>(TABELAS_PRECO_NOMES[0]);
  const [tipo, setTipo] = useState<"acrescimo" | "desconto">("acrescimo");
  const [percentual, setPercentual] = useState("5");
  const [simulado, setSimulado] = useState(false);

  const precoMedioAtual = 152.4;
  const pct = Number(percentual.replace(",", ".")) || 0;
  const novoMedio = useMemo(
    () => Number((precoMedioAtual * (tipo === "desconto" ? 1 - pct / 100 : 1 + pct / 100)).toFixed(2)),
    [pct, tipo],
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Alterações Gerais de Preços</DialogTitle>
          <DialogDescription>Prévia de alteração em lote — nenhum dado é salvo nesta fase.</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label="Representada">
            <Select value={representada} onValueChange={setRepresentada}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {MOCK_REPRESENTADAS.map((r) => (
                  <SelectItem key={r.id} value={r.id}>{r.nomeFantasia}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Grupo">
            <Select value={grupo} onValueChange={setGrupo}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {GRUPOS_PRODUTO.map((g) => (
                  <SelectItem key={g} value={g}>{g}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Tabela de Preço">
            <Select value={tabela} onValueChange={setTabela}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {TABELAS_PRECO_NOMES.map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Percentual (%)">
            <Input value={percentual} onChange={(e) => setPercentual(e.target.value)} inputMode="decimal" />
          </Field>
          <Field label="Tipo" className="sm:col-span-2">
            <RadioGroup value={tipo} onValueChange={(v) => setTipo(v as typeof tipo)} className="flex gap-6">
              <div className="flex items-center gap-2">
                <RadioGroupItem value="acrescimo" id="ag-acr" />
                <Label htmlFor="ag-acr" className="text-sm font-normal">Acréscimo</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="desconto" id="ag-desc" />
                <Label htmlFor="ag-desc" className="text-sm font-normal">Desconto</Label>
              </div>
            </RadioGroup>
          </Field>
        </div>

        <Preview>
          <div className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Prévia da alteração
          </div>
          <PreviewRow label="Produtos afetados" value="128" />
          <PreviewRow label="Preço médio atual" value={formatBRL(precoMedioAtual)} />
          <PreviewRow
            label="Novo preço médio"
            value={simulado ? formatBRL(novoMedio) : "—"}
            strong
          />
        </Preview>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Fechar</Button>
          <Button
            onClick={() => {
              setSimulado(true);
              toast.success("Prévia da alteração gerada.");
            }}
          >
            <Percent className="mr-1.5 h-4 w-4" /> Simular alteração
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/** 6.14 — Planilha de produtos (exportação simulada). */
export function SpreadsheetDialog({
  open,
  onOpenChange,
  registros,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  registros: number;
}) {
  const [formato, setFormato] = useState("excel");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Exportar produtos</DialogTitle>
          <DialogDescription>Planilha de produtos — prévia sem geração de arquivo.</DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <Field label="Filtros aplicados">
            <Input value={`Todos · ${registros} produto(s)`} readOnly />
          </Field>
          <Field label="Formato">
            <Select value={formato} onValueChange={setFormato}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="excel">Excel (.xlsx)</SelectItem>
                <SelectItem value="csv">CSV</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Fechar</Button>
          <Button
            onClick={() => {
              toast.success("Prévia de exportação gerada.");
              onOpenChange(false);
            }}
          >
            <FileSpreadsheet className="mr-1.5 h-4 w-4" /> Simular exportação
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/** 7.9 — Ajuste de preços de uma tabela. */
export function TableAdjustmentDialog({
  open,
  onOpenChange,
  tabelaPadrao,
  precoMedio,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  tabelaPadrao: string;
  precoMedio: number;
}) {
  const [representada, setRepresentada] = useState(MOCK_REPRESENTADAS[0].id);
  const [grupo, setGrupo] = useState("todos");
  const [produtos, setProdutos] = useState("todos");
  const [tipo, setTipo] = useState<"acrescimo" | "desconto">("acrescimo");
  const [percentual, setPercentual] = useState("5");
  const [simulado, setSimulado] = useState(false);

  const pct = Number(percentual.replace(",", ".")) || 0;
  const novo = Number((precoMedio * (tipo === "desconto" ? 1 - pct / 100 : 1 + pct / 100)).toFixed(2));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Ajustar preços</DialogTitle>
          <DialogDescription>Tabela {tabelaPadrao} — simulação sem gravação.</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label="Representada">
            <Select value={representada} onValueChange={setRepresentada}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {MOCK_REPRESENTADAS.map((r) => (
                  <SelectItem key={r.id} value={r.id}>{r.nomeFantasia}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Tabela">
            <Input value={tabelaPadrao} readOnly />
          </Field>
          <Field label="Grupo">
            <Select value={grupo} onValueChange={setGrupo}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os grupos</SelectItem>
                {GRUPOS_PRODUTO.map((g) => (
                  <SelectItem key={g} value={g}>{g}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Produtos">
            <Select value={produtos} onValueChange={setProdutos}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os produtos da tabela</SelectItem>
                <SelectItem value="selecionados">Somente selecionados</SelectItem>
                <SelectItem value="emlinha">Somente em linha</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Tipo de alteração">
            <RadioGroup value={tipo} onValueChange={(v) => setTipo(v as typeof tipo)} className="flex gap-6">
              <div className="flex items-center gap-2">
                <RadioGroupItem value="acrescimo" id="tp-acr" />
                <Label htmlFor="tp-acr" className="text-sm font-normal">Acréscimo</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="desconto" id="tp-desc" />
                <Label htmlFor="tp-desc" className="text-sm font-normal">Desconto</Label>
              </div>
            </RadioGroup>
          </Field>
          <Field label="Percentual (%)">
            <Input value={percentual} onChange={(e) => setPercentual(e.target.value)} inputMode="decimal" />
          </Field>
        </div>

        <Preview>
          <PreviewRow label="Preço médio atual" value={formatBRL(precoMedio)} />
          <PreviewRow label="Percentual" value={`${tipo === "desconto" ? "-" : "+"}${pct}%`} />
          <PreviewRow label="Preço médio simulado" value={simulado ? formatBRL(novo) : "—"} strong />
        </Preview>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Fechar</Button>
          <Button
            onClick={() => {
              setSimulado(true);
              toast.success("Prévia da alteração gerada.");
            }}
          >
            <Wand2 className="mr-1.5 h-4 w-4" /> Simular
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function avisoProximaFase() {
  toast.info(PROXIMA_FASE);
}
