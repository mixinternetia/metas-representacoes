import { useEffect, useState } from "react";
import { Bell, HelpCircle, Search, Moon, Sun, LogOut, Settings, User } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function useTheme() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const initial = stored ? stored === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDark(initial);
    document.documentElement.classList.toggle("dark", initial);
  }, []);
  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };
  return { dark, toggle };
}

export function AppHeader() {
  const { dark, toggle } = useTheme();
  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-2 border-b bg-background/80 px-3 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mx-1 h-6" />

      <div className="relative flex max-w-xl flex-1 items-center">
        <Search className="pointer-events-none absolute left-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Pesquisar clientes, pedidos, produtos..."
          className="h-9 w-full pl-8 pr-16"
        />
        <kbd className="pointer-events-none absolute right-2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground sm:flex">
          ⌘K
        </kbd>
      </div>

      <div className="ml-auto flex items-center gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={toggle} aria-label="Alternar tema">
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>Tema {dark ? "claro" : "escuro"}</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Ajuda">
              <HelpCircle className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Ajuda</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="relative" aria-label="Notificações">
              <Bell className="h-4 w-4" />
              <Badge
                variant="destructive"
                className="absolute -right-0.5 -top-0.5 h-4 min-w-4 justify-center rounded-full px-1 text-[10px]"
              >
                3
              </Badge>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Notificações</TooltipContent>
        </Tooltip>

        <Separator orientation="vertical" className="mx-1 h-6" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-md p-1 pr-2 transition-colors hover:bg-accent">
              <Avatar className="h-7 w-7">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                  MR
                </AvatarFallback>
              </Avatar>
              <div className="hidden text-left leading-tight md:block">
                <div className="text-xs font-medium">Marcelo Ramos</div>
                <div className="text-[10px] text-muted-foreground">Administrador</div>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Minha conta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem><User className="mr-2 h-4 w-4" />Perfil</DropdownMenuItem>
            <DropdownMenuItem><Settings className="mr-2 h-4 w-4" />Preferências</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              <LogOut className="mr-2 h-4 w-4" />Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
