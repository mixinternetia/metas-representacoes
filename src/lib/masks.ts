export function maskCNPJ(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 14);
  return d
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2");
}
export function maskCPF(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 11);
  return d
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1-$2");
}
export function maskCEP(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 8);
  return d.replace(/^(\d{5})(\d)/, "$1-$2");
}
export function maskTelefone(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 10) {
    return d
      .replace(/^(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4})(\d)/, "$1-$2");
  }
  return d
    .replace(/^(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2");
}
export function maskPercent(v: string) {
  const d = v.replace(/[^\d,.]/g, "").replace(".", ",");
  return d;
}

export function isValidCNPJ(v: string) {
  return v.replace(/\D/g, "").length === 14;
}
export function isValidCPF(v: string) {
  return v.replace(/\D/g, "").length === 11;
}
export function isValidCEP(v: string) {
  return v.replace(/\D/g, "").length === 8;
}
export function isValidTelefone(v: string) {
  const d = v.replace(/\D/g, "").length;
  return d === 10 || d === 11;
}
export function isValidEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

export function formatDate(iso?: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "—" : d.toLocaleDateString("pt-BR");
}
export function formatDateTime(iso?: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? "—"
    : d.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
}
export function formatPercent(n: number) {
  return `${n.toFixed(2).replace(".", ",")}%`;
}
export function formatCurrency(n: number) {
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
}
