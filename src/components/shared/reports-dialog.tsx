import { useState } from "react";
import { toast } from "sonner";
import { FileText, Loader2, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export interface ReportOption {
  id: string;
  label: string;
  description: string;
}

export function ReportsDialog({
  open,
  onOpenChange,
  options,
  registros,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  options: ReportOption[];
  registros: number;
}) {
  const [selected, setSelected] = useState(options[0]?.id ?? "");
  const [loading, setLoading] = useState(false);

  function gerar() {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onOpenChange(false);
      const label = options.find((o) => o.id === selected)?.label ?? "Relatório";
      toast.success(`${label} gerado com ${registros} registro(s).`, {
        description: "Pré-visualização simulada — geração de PDF será implementada em fase futura.",
      });
    }, 900);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-4 w-4" /> Relatórios
          </DialogTitle>
          <DialogDescription>
            Os relatórios respeitam os filtros aplicados na consulta ({registros} registro(s)).
          </DialogDescription>
        </DialogHeader>
        <RadioGroup value={selected} onValueChange={setSelected} className="gap-2">
          {options.map((o) => (
            <label
              key={o.id}
              htmlFor={o.id}
              className="flex cursor-pointer items-start gap-3 rounded-md border p-3 hover:bg-muted/40 has-[button[data-state=checked]]:border-primary"
            >
              <RadioGroupItem id={o.id} value={o.id} className="mt-0.5" />
              <div className="space-y-0.5">
                <Label htmlFor={o.id} className="cursor-pointer text-sm font-medium">{o.label}</Label>
                <p className="text-xs text-muted-foreground">{o.description}</p>
              </div>
            </label>
          ))}
        </RadioGroup>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={gerar} disabled={loading}>
            {loading ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <Printer className="mr-1.5 h-4 w-4" />}
            Gerar relatório
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
