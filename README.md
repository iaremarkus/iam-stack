This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app). On top of that, the **iam stack** is configured to hit the ground running with the following integrations:

- [shadcn/ui](https://github.com/shadcn-ui/ui)
- [Next Auth Beta](https://github.com/nextauthjs/next-auth)
- [UploadThing](https://github.com/pingdotgg/uploadthing)
- [Prisma](https://github.com/prisma)
- [Sendgrid](https://github.com/sendgrid)
- [Fluid Tailwind](https://github.com/barvian/fluid-tailwind)
- [Framer Motion](https://github.com/motiondivision/motion)
- [Zod](https://github.com/colinhacks/zod)
- [zsa](https://github.com/IdoPesok/zsa)

## Getting Started

### Environment

Update `.env.example` to `.env` and fill in the required keys.

### Database

The `./prisma` folder has a db connection singleton, a schema file including the NextAuth required models for session management, and a basic seed script to create your `SUPER` user.

Do the usual Prisma init steps like `bunx prisma db push`, `bunx prisma generate`, `bun prisma migrate dev` and `bun prisma db seed`.

Then, you're ready to run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
