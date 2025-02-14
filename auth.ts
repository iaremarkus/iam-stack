import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import NextAuth from "next-auth";

import authConfig from "./auth.config";

const prisma = new PrismaClient();

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  callbacks: {
    signIn: async ({ user }) => {
      const userExists = await prisma.user.findFirst({
        where: {
          email: user.email,
          AND: {
            role: {
              in: ["SUPER", "ADMIN"], // add all roles that are allowed to login
            },
          },
        },
      });

      if (!userExists) {
        return "/login?exists=false";
      }

      return true;
    },
  },
});
