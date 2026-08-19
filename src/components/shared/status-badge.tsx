import { Badge } from "@/components/ui/badge";
import type { Situacao } from "@/data/mock-clientes";

export function StatusBadge({ situacao }: { situacao: Situacao }) {
  return situacao === "ativo" ? (
    <Badge className="border-success/30 bg-success/10 text-success hover:bg-success/15">Ativo</Badge>
  ) : (
    <Badge variant="secondary" className="text-muted-foreground">
      Inativo
    </Badge>
  );
}
