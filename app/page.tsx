import { HydrationBoundary } from "@tanstack/react-query";

import { LanguageChairman } from "@/blocks/views";
import { checkUser } from "@/utils/checkUser";
import { hydrateQueries } from "@/utils/hydrate";

export default async function Home() {
  const user = await checkUser();

  return (
    <HydrationBoundary state={await hydrateQueries()}>
      <div className="w-full h-screen">
        <pre>{JSON.stringify({ user }, null, 2)}</pre>
      </div>
    </HydrationBoundary>
  );
}
