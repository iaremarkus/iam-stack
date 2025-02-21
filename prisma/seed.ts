import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const mark = await prisma.user.upsert({
    where: { email: "your-email@example.com" },
    update: {},
    create: {
      email: "", // your email
      firstName: "", // your first name
      lastName: "", // your last name
      role: "SUPER", // your role
    },
  });

  console.log({ mark });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
