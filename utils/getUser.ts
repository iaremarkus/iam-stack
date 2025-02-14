import { User } from "@prisma/client";

import { auth } from "@/auth";

export const getUser = async (): Promise<User | null> => {
  const session = await auth();
  if (!session) return null;

  const { user } = session as unknown as { user: User };

  return user;
};
