import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
////"dev": "ts-node src/index.ts"
//npx prisma migrate dev --name add-order-model
// npm run migrate
//npx tsc prisma/seed.ts
//node prisma/seed.js
const app = express();
const port = 3000;
app.use(express.json());
const Router = express.Router();
import userRoutes from '../routes/userRoutes';
import adminRoutes from '../routes/adminRoutes';
const rateLimit = require('express-rate-limit');

// Define the rate limit
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  message: 'Too many requests from this IP, please try again after 15 minutes',
});

// Apply the rate limit to all requests
app.use(limiter);

app.get('/', (req, res) => {
  res.json({ message: 'Hello from API v1!' });
});


app.get('/userType', async (req: Request, res: Response) => {
  const userType = await prisma.userType.findMany();
  res.json({data:userType});
});

app.use('/api/v1', Router);

app.use('/users', userRoutes);
app.use('/admin', adminRoutes);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

export default  app;