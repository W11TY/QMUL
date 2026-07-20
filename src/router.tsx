import { QueryClient } from "@tanstack/react-query";
import { createRouter, createHashHistory } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient();

  const hashHistory = typeof document !== 'undefined' ? createHashHistory() : undefined;

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    basepath: "/QMUL",
    ...(hashHistory ? { history: hashHistory } : {}),
  });

  return router;
};
