import { createFileRoute } from "@tanstack/react-router";
import { Explorer } from "@/components/explorer/Explorer";

type SearchParams = {
  anatomy?: string;
};

export const Route = createFileRoute("/explorer")({
  validateSearch: (search: Record<string, unknown>): SearchParams => {
    return {
      anatomy: search.anatomy as string | undefined,
    };
  },
  component: ExplorerPage,
});

function ExplorerPage() {
  const { anatomy } = Route.useSearch();
  return <Explorer initialAnatomy={anatomy} />;
}
