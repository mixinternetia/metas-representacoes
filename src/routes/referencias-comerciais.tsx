import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/referencias-comerciais")({
  component: () => <Outlet />,
});
