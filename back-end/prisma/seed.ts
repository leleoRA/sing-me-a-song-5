import { prisma } from "../src/database.js";

/* async function main() {
  await prisma.recommendation.upsert({
    where: { name: "meu video" },
    update: {},
    create: {
      name: "meu video",
      youtubeLink: "https://www.youtube.com/watch?v=LhoLuui9gX8",
    },
  });
}

main()
  .catch((e) => {
    console.log(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); */
