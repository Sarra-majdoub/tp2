// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  
  // Créer des utilisateurs
  const user1 = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john@example.com',
      role: 'USER',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'ADMIN',
    },
  });

  // Créer des compétences
  const skill1 = await prisma.skill.create({
    data: {
      designation: 'JavaScript',
    },
  });

  const skill2 = await prisma.skill.create({
    data: {
      designation: 'TypeScript',
    },
  });

  const skill3 = await prisma.skill.create({
    data: {
      designation: 'GraphQL',
    },
  });

  const skill4 = await prisma.skill.create({
    data: {
      designation: 'NestJS',
    },
  });

  // Créer des CVs avec les relations
  const cv1 = await prisma.cv.create({
    data: {
      name: 'John CV',
      age: 28,
      job: 'Developer',
      userId: user1.id,
      skills: {
        create: [
          { skill: { connect: { id: skill1.id } } },
          { skill: { connect: { id: skill3.id } } },
        ],
      },
    },
  });

  const cv2 = await prisma.cv.create({
    data: {
      name: 'Jane CV',
      age: 32,
      job: 'Tech Lead',
      userId: user2.id,
      skills: {
        create: [
          { skill: { connect: { id: skill1.id } } },
          { skill: { connect: { id: skill2.id } } },
          { skill: { connect: { id: skill3.id } } },
          { skill: { connect: { id: skill4.id } } },
        ],
      },
    },
  });

  console.log({ user1, user2, skill1, skill2, skill3, skill4, cv1, cv2 });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });