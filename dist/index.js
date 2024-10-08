import express from 'express';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
////"dev": "ts-node src/index.ts"
// npm run migrate
//npx tsc prisma/seed.ts
//node prisma/seed.js
const app = express();
const port = 3000;
app.get('/', async (req, res) => {
    res.send('Hello, Express with TypeScript!');
});
app.get('/userType', async (req, res) => {
    const users = await prisma.userType.findMany();
    res.json(users);
    //res.send('Hello, Express with TypeScript!');
});
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
