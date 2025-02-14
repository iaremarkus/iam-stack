"use server";

import { ModelType } from "@prisma/client";
import { redirect } from "next/navigation";

import { getUser } from "./getUser";

type CheckCanEditProps = {
  model: ModelType;
  id: string;
  redirectTo?: string;
};

/**
 * If this content is made by me, or I am an admin, then return true
 * @param user
 */
export const checkCanEdit = async ({
  model,
  id,
  redirectTo,
}: CheckCanEditProps): Promise<void | boolean> => {
  const user = await getUser();
  if (!user || !model || !id) return false;

  // am i an admin
  if (["SUPER", "ADMIN", "SOME_ROLE"].includes(user?.role)) return true;

  // am i the author
  let isAuthor;

  switch (
    model
    // case "CASE":
    //   isAuthor = await prisma.case.findUnique({
    //     where: { id, createdById: user?.id },
    //     ...cacheStrategy(["CASE"]),
    //   });
  ) {
  }

  if (isAuthor) return true;

  if (redirectTo) redirect(redirectTo);
};
