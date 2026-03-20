import { FastifyInstance } from 'fastify';
import { register } from './register';
import { authenticate } from './authenticate';

export const appRoutes = async (app: FastifyInstance) => {
  app.post('/users', register);

  app.post('/sessions', authenticate);
};
