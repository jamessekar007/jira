import { PrismaClient } from '@prisma/client';

import { createHash, randomBytes } from 'crypto';
import * as dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();

async function main() {
  // Delete all users first (optional, based on your use case)
  await prisma.userType.deleteMany();
  await prisma.user.deleteMany();

  // Create new users
  const user1 = await prisma.userType.create({
    data: {
      name: 'Admin'
    },
  });

  const user2 = await prisma.userType.create({
    data: {
      name: 'Users'
    },
  });
  const salt = process.env.SALT || 'XYZABCD98765!@#$%EFGH1234IJKL%$#@!';
  const hash = createHash('sha512')
    .update(salt + 'admin') // Combine salt with the data
    .digest('hex');

  const user = await prisma.user.create({
    data: {
      name: 'Admin',
      userTypeId: 1,
      email:"admin@xzy.com",
      password:hash
    },
  });

  console.log({ user1, user2,user });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });