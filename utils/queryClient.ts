import { QueryClient } from "@tanstack/react-query";

export const QC = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 1,
      refetchOnMount: true,
      //   refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
  },
});
