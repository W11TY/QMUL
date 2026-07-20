import { createFileRoute } from "@tanstack/react-router";
import { Explorer } from "@/components/explorer/Explorer";

export const Route = createFileRoute("/")({
  component: Explorer,
});
