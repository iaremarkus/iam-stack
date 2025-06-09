import { revalidatePath } from "next/cache";

import { QueryKeys } from "./hydrate";
import { QC } from "./queryClient";

type InvalidateQueries = {
  queries?: QueryKeys[];
  paths?: { pathname: string; type?: "layout" | "page" }[];
};

export function invalidateQueries({ queries, paths }: InvalidateQueries) {
  if (queries)
    queries.forEach((key) => {
      QC.invalidateQueries({ queryKey: [key] });
    });

  if (paths)
    paths.forEach(({ pathname, type }) => revalidatePath(pathname, type));
}
