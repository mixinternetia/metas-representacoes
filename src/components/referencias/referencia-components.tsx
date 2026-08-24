import { useState } from "react";
import { toast } from "sonner";
import { ArrowDown, Building2, Clock, Mail, Phone, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field } from "@/components/shared/form-section";
import { ReadField } from "@/components/shared/form-section";
import { StatusBadge } from "@/components/shared/status-badge";
import { maskTelefone, formatDateTime } from "@/lib/masks";
import { MOCK_CLIENTES } from "@/data/mock-clientes";
import type { ClienteVinculado, HistoricoItem, ReferenciaComercialCadastro } from "@/data/mock-referencias-comerciais";

/** Card destacado com os dados do cliente vinculado à referência. */
export function ClientRelationCard({ cliente }: { cliente: ClienteVinculado }) {
  return (
    <Card>
      <CardContent className="space-y-4 p-4">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Building2 className="h-4 w-4 text-primary" /> Cliente Vinculado
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <ReadField label="Código do cliente" value={<span className="font-mono">{cliente.codigo}</span>} />
          <ReadField label="Razão Social" value={cliente.razaoSocial} />
          <ReadField label="Nome Fantasia" value={cliente.nomeFantasia} />
          <ReadField label="CNPJ" value={<span className="font-mono">{cliente.cnpj}</span>} />
          <ReadField label="Telefone" value={<span className="font-mono">{cliente.telefone}</span>} />
          <ReadField label="Cidade / UF" value={`${cliente.cidade} - ${cliente.uf}`} />
          <ReadField label="Situação" value={<StatusBadge situacao={cliente.situacao} />} />
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => toast.info("Navegação para o cadastro do cliente — demonstração desta fase.")}
        >
          Visualizar Cliente
        </Button>
      </CardContent>
    </Card>
  );
}

/** Diagrama simples Cliente → Referência Comercial. */
export function RelacaoClienteReferencia({ referencia }: { referencia: ReferenciaComercialCadastro }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="w-full max-w-md rounded-md border bg-muted/40 p-3 text-center">
        <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Cliente</p>
        <p className="text-sm font-semibold">{referencia.cliente.nomeFantasia}</p>
        <p className="text-xs text-muted-foreground">{referencia.cliente.razaoSocial}</p>
      </div>
      <ArrowDown className="h-4 w-4 text-muted-foreground" />
      <div className="w-full max-w-md rounded-md border border-primary/40 bg-primary/5 p-3 text-center">
        <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Referência Comercial</p>
        <p className="flex items-center justify-center gap-1.5 text-sm font-semibold">
          <UserRound className="h-4 w-4" /> {referencia.nome}
        </p>
        <div className="mt-1 flex flex-wrap items-center justify-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1 font-mono">
            <Phone className="h-3.5 w-3.5" /> {referencia.telefone}
          </span>
          <span className="flex items-center gap-1">
            <Mail className="h-3.5 w-3.5" /> {referencia.email}
          </span>
        </div>
        <div className="mt-2 flex justify-center">
          <StatusBadge situacao={referencia.situacao} />
        </div>
      </div>
    </div>
  );
}

/** Timeline demonstrativa de eventos da referência. */
export function CommercialReferenceTimeline({ itens }: { itens: HistoricoItem[] }) {
  return (
    <ol className="relative space-y-5 border-l pl-5">
      {itens.map((h, i) => (
        <li key={i} className="relative">
          <span className="absolute -left-[27px] flex h-4 w-4 items-center justify-center rounded-full border bg-background">
            <Clock className="h-2.5 w-2.5 text-muted-foreground" />
          </span>
          <p className="text-xs text-muted-foreground">{formatDateTime(h.data)}</p>
          <p className="text-sm font-medium">{h.titulo}</p>
          <p className="text-xs text-muted-foreground">
            {h.descricao} — {h.usuario}
          </p>
        </li>
      ))}
    </ol>
  );
}

/** Modal demonstrativo de nova referência comercial (sem persistência). */
export function NovaReferenciaDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [cliente, setCliente] = useState(MOCK_CLIENTES[0]?.id ?? "");
  const [situacao, setSituacao] = useState("ativo");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Nova Referência Comercial</DialogTitle>
          <DialogDescription>Interface demonstrativa — os dados não são gravados nesta fase.</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Field label="Nome">
              <Input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex.: Carlos Eduardo" />
            </Field>
          </div>
          <Field label="Telefone">
            <Input
              value={telefone}
              onChange={(e) => setTelefone(maskTelefone(e.target.value))}
              placeholder="(84) 99999-0001"
            />
          </Field>
          <Field label="E-mail">
            <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="contato@exemplo.com" />
          </Field>
          <Field label="Cliente vinculado">
            <Select value={cliente} onValueChange={setCliente}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {MOCK_CLIENTES.slice(0, 15).map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.codigo} — {c.nomeFantasia}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Situação">
            <Select value={situacao} onValueChange={setSituacao}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ativo">Ativo</SelectItem>
                <SelectItem value="inativo">Inativo</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button
            onClick={() => {
              onOpenChange(false);
              toast.success(
                "Cadastro de referência comercial — demonstração. A persistência será implementada em uma próxima fase.",
              );
            }}
          >
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
