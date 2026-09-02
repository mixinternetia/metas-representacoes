import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Users,
  Building2,
  Truck,
  UserCog,
  Handshake,
  Package,
  Tags,
  Search,
  Filter,
  Pencil,
  Trash2,
  Eye,
  Plus,
  Download,
  Upload,
  Settings,
  UserCircle2,
  Bell,
  HelpCircle,
  Menu,
  X,
  MoreHorizontal,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { DsBlock, DsCode, DsGrid, DsSection, DsSpecs } from "./ds-primitives";

/* ---------------------------- Cores ---------------------------- */

const TOKENS: { name: string; token: string; usage: string; onDark?: boolean }[] = [
  { name: "Primary", token: "--primary", usage: "Ações principais, links e destaques.", onDark: true },
  { name: "Secondary", token: "--secondary", usage: "Ações secundárias e superfícies neutras." },
  { name: "Success", token: "--success", usage: "Estados positivos, situação ativa.", onDark: true },
  { name: "Warning", token: "--warning", usage: "Alertas e situações de atenção." },
  { name: "Error / Destructive", token: "--destructive", usage: "Erros e ações destrutivas.", onDark: true },
  { name: "Info / Accent", token: "--accent", usage: "Informações e realces suaves." },
  { name: "Background", token: "--background", usage: "Fundo geral das páginas." },
  { name: "Surface / Card", token: "--card", usage: "Cards e áreas elevadas." },
  { name: "Border", token: "--border", usage: "Bordas, divisores e contornos de input." },
  { name: "Text Primary", token: "--foreground", usage: "Texto principal.", onDark: true },
  { name: "Text Secondary", token: "--secondary-foreground", usage: "Texto secundário em superfícies neutras.", onDark: true },
  { name: "Text Muted", token: "--muted-foreground", usage: "Texto auxiliar, labels e hints.", onDark: true },
];

function useResolvedColors() {
  const [colors, setColors] = useState<Record<string, { hex: string; rgb: string }>>({});
  useEffect(() => {
    const probe = document.createElement("div");
    probe.style.display = "none";
    document.body.appendChild(probe);
    const out: Record<string, { hex: string; rgb: string }> = {};
    for (const t of TOKENS) {
      probe.style.color = `var(${t.token})`;
      const computed = getComputedStyle(probe).color;
      const m = computed.match(/[\d.]+/g);
      let hex = "—";
      let rgb = computed;
      if (m && m.length >= 3) {
        const [r, g, b] = m.map((n) => Math.round(Number(n)));
        hex =
          "#" +
          [r, g, b]
            .map((n) => Math.max(0, Math.min(255, n)).toString(16).padStart(2, "0"))
            .join("")
            .toUpperCase();
        rgb = `rgb(${r}, ${g}, ${b})`;
      }
      out[t.token] = { hex, rgb };
    }
    probe.remove();
    setColors(out);
  }, []);
  return colors;
}

export function DsColors() {
  const colors = useResolvedColors();
  return (
    <DsSection
      id="cores"
      title="2. Cores"
      description="Paleta semântica em uso no sistema. Todos os valores vêm dos tokens CSS do projeto — nunca use cores fixas em componentes."
    >
      <DsGrid cols={3}>
        {TOKENS.map((t) => (
          <Card key={t.token} className="overflow-hidden">
            <div
              className="flex h-20 items-end justify-end p-2"
              style={{ backgroundColor: `var(${t.token})` }}
            >
              <span
                className="rounded bg-background/80 px-1.5 py-0.5 font-mono text-[10px] text-foreground"
              >
                {colors[t.token]?.hex ?? "…"}
              </span>
            </div>
            <CardContent className="space-y-1 p-3">
              <div className="text-sm font-medium">{t.name}</div>
              <div className="font-mono text-[11px] text-muted-foreground">
                {colors[t.token]?.rgb ?? "—"}
              </div>
              <div className="text-xs text-muted-foreground">{t.usage}</div>
              <DsCode>var({t.token})</DsCode>
            </CardContent>
          </Card>
        ))}
      </DsGrid>
    </DsSection>
  );
}

/* -------------------------- Tipografia -------------------------- */

const TYPE_SCALE: { name: string; cls: string; specs: string; sample: string }[] = [
  { name: "H1", cls: "text-2xl font-semibold tracking-tight", specs: "24px / 600 / 1.2", sample: "Título principal da página" },
  { name: "H2", cls: "text-lg font-semibold tracking-tight", specs: "18px / 600 / 1.4", sample: "Título de seção" },
  { name: "H3", cls: "text-base font-semibold", specs: "16px / 600 / 1.5", sample: "Subtítulo" },
  { name: "Body Large", cls: "text-base", specs: "16px / 400 / 1.6", sample: "Texto de destaque para conteúdos importantes." },
  { name: "Body", cls: "text-sm", specs: "14px / 400 / 1.5", sample: "Texto padrão utilizado em tabelas, formulários e cards." },
  { name: "Body Small", cls: "text-xs", specs: "12px / 400 / 1.5", sample: "Texto auxiliar, labels e hints de campos." },
  { name: "Caption", cls: "text-[11px] uppercase tracking-wide text-muted-foreground", specs: "11px / 500 / 1.4", sample: "Informações secundárias" },
];

export function DsTypography() {
  return (
    <DsSection
      id="tipografia"
      title="3. Tipografia"
      description="Família única em todo o sistema: Inter (fallback ui-sans-serif / system-ui). Não utilizar outras fontes."
    >
      <DsBlock title="Família" hint="var(--font-sans) — Inter">
        <div className="space-y-1">
          <div className="text-2xl font-semibold">Aa Bb Cc Dd</div>
          <div className="text-sm">ABCDEFGHIJKLMNOPQRSTUVWXYZ</div>
          <div className="text-sm">abcdefghijklmnopqrstuvwxyz</div>
          <div className="text-sm tabular-nums">1234567890</div>
        </div>
      </DsBlock>

      <DsBlock title="Hierarquia">
        <div className="divide-y">
          {TYPE_SCALE.map((t) => (
            <div key={t.name} className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-[130px_1fr_auto] sm:items-baseline sm:gap-3">
              <div className="text-xs font-medium text-muted-foreground">{t.name}</div>
              <div className={t.cls}>{t.sample}</div>
              <div className="font-mono text-[11px] text-muted-foreground">Inter · {t.specs}</div>
            </div>
          ))}
        </div>
      </DsBlock>
    </DsSection>
  );
}

/* ------------------------- Espaçamentos ------------------------- */

const SPACES = [4, 8, 12, 16, 20, 24, 32, 40, 48, 64];

export function DsSpacing() {
  return (
    <DsSection
      id="espacamentos"
      title="4. Espaçamentos"
      description="Escala base de 4px. Utilize apenas múltiplos dessa escala através das utilidades Tailwind."
    >
      <DsBlock title="Escala">
        <div className="space-y-2">
          {SPACES.map((s) => (
            <div key={s} className="flex items-center gap-3">
              <span className="w-14 font-mono text-[11px] text-muted-foreground tabular-nums">{s}px</span>
              <div className="h-3 rounded bg-primary/70" style={{ width: s * 3 }} />
              <DsCode>{`p-${s / 4} / gap-${s / 4}`}</DsCode>
            </div>
          ))}
        </div>
      </DsBlock>
      <DsGrid cols={3}>
        <DsBlock title="Espaçamento interno" hint="Cards e painéis usam p-4 (16px); toolbars usam p-3 (12px)." >
          <div className="rounded-md border bg-muted/30 p-4 text-xs text-muted-foreground">p-4</div>
        </DsBlock>
        <DsBlock title="Entre campos" hint="Grid de formulário com gap-3 (12px) e label→campo space-y-1.5 (6px).">
          <div className="grid grid-cols-2 gap-3">
            <div className="h-8 rounded-md border bg-muted/30" />
            <div className="h-8 rounded-md border bg-muted/30" />
          </div>
        </DsBlock>
        <DsBlock title="Entre seções e páginas" hint="Seções: space-y-6 (24px). Página: p-4 no mobile e p-6 no desktop.">
          <div className="space-y-6">
            <div className="h-6 rounded bg-muted/50" />
            <div className="h-6 rounded bg-muted/50" />
          </div>
        </DsBlock>
      </DsGrid>
    </DsSection>
  );
}

/* --------------------- Bordas e sombras ------------------------- */

export function DsRadiusShadows() {
  return (
    <DsSection
      id="bordas"
      title="5. Bordas e sombras"
      description="Raio base do projeto: 0.5rem (var(--radius)). Sombras discretas — elevação é sinalizada principalmente por borda e contraste de superfície."
    >
      <DsGrid cols={4}>
        {[
          { label: "Pequeno", cls: "rounded-sm", spec: "calc(--radius - 4px)" },
          { label: "Médio", cls: "rounded-md", spec: "calc(--radius - 2px)" },
          { label: "Grande", cls: "rounded-lg", spec: "var(--radius)" },
          { label: "Full / Pill", cls: "rounded-full", spec: "9999px" },
        ].map((r) => (
          <DsBlock key={r.label} title={r.label} hint={r.spec}>
            <div className={`h-14 border bg-primary/10 ${r.cls}`} />
          </DsBlock>
        ))}
      </DsGrid>
      <DsGrid cols={4}>
        {[
          { label: "Sem sombra", cls: "shadow-none" },
          { label: "Pequena", cls: "shadow-sm" },
          { label: "Média", cls: "shadow-md" },
          { label: "Grande", cls: "shadow-lg" },
        ].map((s) => (
          <DsBlock key={s.label} title={s.label} hint={s.cls}>
            <div className={`h-14 rounded-lg border bg-card ${s.cls}`} />
          </DsBlock>
        ))}
      </DsGrid>
    </DsSection>
  );
}

/* ---------------------------- Ícones ---------------------------- */

const ICONS = [
  { Icon: LayoutDashboard, name: "LayoutDashboard", use: "Dashboard" },
  { Icon: Users, name: "Users", use: "Clientes" },
  { Icon: Building2, name: "Building2", use: "Representadas" },
  { Icon: Truck, name: "Truck", use: "Transportadoras" },
  { Icon: UserCog, name: "UserCog", use: "Vendedores" },
  { Icon: Handshake, name: "Handshake", use: "Referências comerciais" },
  { Icon: Package, name: "Package", use: "Produtos" },
  { Icon: Tags, name: "Tags", use: "Tabelas de preços" },
  { Icon: Search, name: "Search", use: "Busca" },
  { Icon: Filter, name: "Filter", use: "Filtro" },
  { Icon: Pencil, name: "Pencil", use: "Editar" },
  { Icon: Trash2, name: "Trash2", use: "Excluir" },
  { Icon: Eye, name: "Eye", use: "Visualizar" },
  { Icon: Plus, name: "Plus", use: "Adicionar" },
  { Icon: Download, name: "Download", use: "Download / exportar" },
  { Icon: Upload, name: "Upload", use: "Upload / importar" },
  { Icon: Settings, name: "Settings", use: "Configurações" },
  { Icon: UserCircle2, name: "UserCircle2", use: "Usuário" },
  { Icon: Bell, name: "Bell", use: "Notificações" },
  { Icon: HelpCircle, name: "HelpCircle", use: "Ajuda" },
  { Icon: Menu, name: "Menu", use: "Menu" },
  { Icon: X, name: "X", use: "Fechar" },
  { Icon: MoreHorizontal, name: "MoreHorizontal", use: "Mais opções" },
];

export function DsIcons() {
  return (
    <DsSection
      id="icones"
      title="6. Ícones"
      description="Biblioteca oficial: Lucide (lucide-react). Tamanho padrão h-4 w-4 em botões e menus; h-5 w-5 em destaques."
    >
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
        {ICONS.map(({ Icon, name, use }) => (
          <Card key={name}>
            <CardContent className="flex items-center gap-3 p-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <div className="truncate text-xs font-medium">{use}</div>
                <div className="truncate font-mono text-[11px] text-muted-foreground">{name}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <DsSpecs
        items={[
          ["Tamanho padrão", "16px (h-4 w-4)"],
          ["Stroke", "2"],
          ["Cor", "currentColor"],
        ]}
      />
    </DsSection>
  );
}
