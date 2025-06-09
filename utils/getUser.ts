import { User } from "@prisma/client";

import { auth } from "@/auth";
import { prisma } from "@/prisma/db";

export const getUser = async (): Promise<User | null> => {
  const session = await auth();
  if (!session) return null;

  const user = prisma.user.findFirstOrThrow({
    where: {
      id: session.user.id,
    },
  });

  return user;
};
