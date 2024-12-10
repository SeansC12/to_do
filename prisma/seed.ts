import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seed() {
  const email = "sean@test.com";

  // cleanup the existing database
  await prisma.user.delete({ where: { email } }).catch(() => {
    // no worries if it doesn't exist yet
  });

  const hashedPassword = await bcrypt.hash("testing123", 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });

  const todoPage1 = await prisma.todoPage.create({
    data: {
      title: "My first todo page",
      userId: user.id,
      createdAt: new Date(),
    },
  });

  const todoPage2 = await prisma.todoPage.create({
    data: {
      title: "My second to do page",
      userId: user.id,
      createdAt: new Date(),
    },
  });

  await prisma.todo.create({
    data: {
      content: "Page 1: Todo 1",
      todoPageId: todoPage1.id,
    },
  });

  await prisma.todo.create({
    data: {
      content: "Page 1: Todo 2",
      todoPageId: todoPage1.id,
    },
  });

  await prisma.todo.create({
    data: {
      content: "Page 2: Todo 1",
      todoPageId: todoPage2.id,
    },
  });

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
