import { Link, useRouterState } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  LayoutDashboard,
  Users,
  Building2,
  Truck,
  UserCog,
  Handshake,
  Package,
  Tags,
  FileText,
  ShoppingCart,
  Receipt,
  FileSpreadsheet,
  ShieldCheck,
  Settings,
  UserCircle2,
  BookOpen,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

type NavLeaf = {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  soon?: boolean;
};
type NavGroup = { label: string; items: NavLeaf[] };

const DASHBOARD: NavLeaf = { title: "Dashboard", url: "/", icon: LayoutDashboard };

const GROUPS: NavGroup[] = [
  {
    label: "Pessoal",
    items: [
      { title: "Clientes", url: "/clientes", icon: Users },
      { title: "Representadas", url: "/representadas", icon: Building2 },
      { title: "Transportadoras", url: "/transportadoras", icon: Truck },
      { title: "Vendedores", url: "/vendedores", icon: UserCog },
      { title: "Referências Comerciais", url: "/referencias-comerciais", icon: Handshake },
    ],
  },
  {
    label: "Vendas",
    items: [
      { title: "Produtos", url: "/produtos", icon: Package },
      { title: "Tabelas de Preços", url: "/tabelas-precos", icon: Tags },
      { title: "Orçamentos", url: "/orcamentos", icon: FileText, soon: true },
      { title: "Pedidos", url: "/pedidos", icon: ShoppingCart, soon: true },
      { title: "Notas Fiscais", url: "/notas-fiscais", icon: Receipt, soon: true },
      { title: "Duplicatas", url: "/duplicatas", icon: FileSpreadsheet, soon: true },
    ],
  },
  {
    label: "Utilitários",
    items: [
      { title: "Usuários", url: "/usuarios", icon: UserCircle2, soon: true },
      { title: "Perfis", url: "/perfis", icon: ShieldCheck, soon: true },
      { title: "Configurações", url: "/configuracoes", icon: Settings, soon: true },
      { title: "Design System", url: "/design-system", icon: BookOpen },
    ],
  },
];

function isActivePath(current: string, url: string) {
  if (url === "/") return current === "/";
  return current === url || current.startsWith(url + "/");
}

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-1 py-1">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-sm">
            <Sparkles className="h-5 w-5" />
          </div>
          {!collapsed && (
            <div className="flex min-w-0 flex-col leading-tight">
              <span className="truncate text-sm font-semibold">Metas Representações</span>
              <span className="truncate text-[11px] text-muted-foreground">ERP Comercial</span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="gap-0">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActivePath(pathname, DASHBOARD.url)} tooltip="Dashboard">
                  <Link to={DASHBOARD.url}>
                    <DASHBOARD.icon className="h-4 w-4" />
                    <span>{DASHBOARD.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {GROUPS.map((group) => {
          const groupActive = group.items.some((i) => isActivePath(pathname, i.url));
          return (
            <Collapsible key={group.label} defaultOpen={groupActive} className="group/collapsible">
              <SidebarGroup>
                {!collapsed && (
                  <SidebarGroupLabel asChild>
                    <CollapsibleTrigger className="flex w-full items-center justify-between hover:text-foreground">
                      {group.label}
                      <ChevronDown className="h-3.5 w-3.5 transition-transform group-data-[state=closed]/collapsible:-rotate-90" />
                    </CollapsibleTrigger>
                  </SidebarGroupLabel>
                )}
                <CollapsibleContent>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {group.items.map((item) =>
                        item.soon ? (
                          <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                              tooltip={`${item.title} — Em breve`}
                              className="cursor-default opacity-60"
                              onClick={() =>
                                toast.info("Esta funcionalidade será implementada em uma próxima fase.")
                              }
                            >
                              <item.icon className="h-4 w-4" />
                              <span className="flex-1 truncate">{item.title}</span>
                              <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                                Em breve
                              </span>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        ) : (
                          <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                              asChild
                              isActive={isActivePath(pathname, item.url)}
                              tooltip={item.title}
                            >
                              <Link to={item.url}>
                                <item.icon className="h-4 w-4" />
                                <span>{item.title}</span>
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        ),
                      )}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </CollapsibleContent>
              </SidebarGroup>
            </Collapsible>
          );
        })}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        {!collapsed && (
          <div className="px-2 py-1 text-[11px] text-muted-foreground">
            v1.0 · © Metas {new Date().getFullYear()}
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
