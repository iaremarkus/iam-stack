import { dehydrate } from "@tanstack/react-query";

import { prisma } from "@/prisma/db";
import { Items } from "@/types";

import { QC } from "./queryClient";
import { serializeData } from "./serialize";

export type QueryKeys =
  | "users"
  | "events"
  | "attendance"
  | "languages"
  | "translations"
  | "series"
  | "talks"
  | "locations";

interface QueryConfig {
  key: QueryKeys;
  fn: () => Promise<Items>;
}

export async function hydrateQueries() {
  const queries: QueryConfig[] = [
    {
      key: "users",
      fn: () => prisma.user.findMany(),
    },
    {
      key: "languages",
      fn: () => prisma.language.findMany(),
    },
    {
      key: "translations",
      fn: () => prisma.translation.findMany(),
    },
    {
      key: "series",
      fn: () => prisma.series.findMany(),
    },
    {
      key: "talks",
      fn: () => prisma.talk.findMany(),
    },
    {
      key: "locations",
      fn: () => prisma.location.findMany(),
    },
    {
      key: "events",
      fn: () => prisma.event.findMany(),
    },
  ];

  await Promise.all(
    queries.map(({ key, fn }) =>
      QC.prefetchQuery({
        queryKey: [key],
        queryFn: async () => {
          const data = await fn();
          return serializeData(data);
        },
      })
    )
  );

  return dehydrate(QC);
}
