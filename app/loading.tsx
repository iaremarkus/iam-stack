import { Metadata } from "next";

import { Loading } from "@/blocks/atoms";

export const metadata: Metadata = {
  title: `Loading... | ${process.env.SITE_NAME}`,
};

export default async function LoadingPage() {
  return (
    <div className="~p-4/8">
      <Loading text="Loading application..." />
    </div>
  );
}
