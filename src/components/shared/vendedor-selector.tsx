import { useMemo, useState } from "react";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { VENDEDORES } from "@/data/mock-clientes";

export function VendedorSelector({
  value,
  disabled,
  onChange,
}: {
  value: string;
  disabled?: boolean;
  onChange: (nome: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    return VENDEDORES.filter(
      (v) => v.nome.toLowerCase().includes(t) || v.codigo.toLowerCase().includes(t),
    );
  }, [q]);

  const atual = VENDEDORES.find((v) => v.nome === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          className="w-full justify-between font-normal"
        >
          <span className="truncate">
            {atual ? `${atual.codigo} · ${atual.nome}` : value || "Selecionar vendedor"}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[320px] p-2">
        <div className="relative mb-2">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por nome ou código..."
            className="h-9 pl-8"
          />
        </div>
        <div className="max-h-60 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="p-3 text-center text-xs text-muted-foreground">Nenhum vendedor encontrado.</div>
          ) : (
            filtered.map((v) => (
              <button
                key={v.codigo}
                type="button"
                onClick={() => {
                  onChange(v.nome);
                  setOpen(false);
                }}
                className="flex w-full items-center justify-between rounded-md px-2 py-2 text-left text-sm hover:bg-muted"
              >
                <span>
                  <span className="font-mono text-xs text-muted-foreground">{v.codigo}</span> · {v.nome}
                </span>
                {value === v.nome && <Check className="h-4 w-4 text-primary" />}
              </button>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
