import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/tabelas-precos")({
  component: () => <Outlet />,
});
