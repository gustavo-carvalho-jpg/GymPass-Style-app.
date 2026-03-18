import fastify from 'fastify';
import { PrismaClient } from '../generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';

export const app = fastify();

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

prisma.user.create({
  data: {
    name: 'Gustavo',
    email: 'gustavo@gmail.com',
  },
});
