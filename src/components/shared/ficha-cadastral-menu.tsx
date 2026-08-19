import { useRef } from "react";
import { toast } from "sonner";
import { ClipboardList, Download, FilePlus2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function FichaCadastralMenu({
  entidade,
  onNova,
}: {
  entidade: string;
  onNova: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  function exportar() {
    const conteudo = `FICHA CADASTRAL — ${entidade.toUpperCase()}\n\nRazão Social / Nome: ____________________\nCNPJ: ____________________\nInscrição Estadual: ____________________\nE-mail: ____________________\nTelefone: ____________________\nEndereço: ____________________\nContatos: ____________________\n`;
    const blob = new Blob([conteudo], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ficha-cadastral-${entidade.toLowerCase()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Ficha cadastral exportada (modelo simulado).");
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <ClipboardList className="mr-1.5 h-4 w-4" /> Ficha cadastral
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-60">
          <DropdownMenuLabel>Ficha cadastral</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={onNova}>
            <FilePlus2 className="mr-2 h-4 w-4" /> Nova ficha cadastral
          </DropdownMenuItem>
          <DropdownMenuItem onClick={exportar}>
            <Download className="mr-2 h-4 w-4" /> Exportar ficha cadastral
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => inputRef.current?.click()}>
            <Upload className="mr-2 h-4 w-4" /> Importar ficha cadastral
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <input
        ref={inputRef}
        type="file"
        accept=".txt,.csv,.xlsx,.pdf"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) {
            toast.success(`Ficha "${f.name}" importada.`, {
              description: "Processamento simulado nesta fase — os dados não são gravados.",
            });
          }
          e.target.value = "";
        }}
      />
    </>
  );
}
