import { prisma } from "@/prisma/db";

import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

export function useUsers() {
  return useSuspenseQuery(
    queryOptions({
      queryKey: ["users"],
      queryFn: async () => await prisma.user.findMany(),
    })
  );
}
