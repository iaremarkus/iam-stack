import { NextAuthConfig } from "next-auth";
import Sendgrid from "next-auth/providers/sendgrid";

export default {
  providers: [
    Sendgrid({
      apiKey: process.env.SENDGRID_API_KEY,
      from: process.env.SENDGRID_FROM,
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
    verifyRequest: "/login?sent=true",
  },
} satisfies NextAuthConfig;
