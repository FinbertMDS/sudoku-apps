// app.ts

import {levelRoutes} from '@/routes/level.routes';
import cors from '@fastify/cors';
import Fastify from 'fastify';

export function buildApp() {
  const app = Fastify({logger: true});

  app.register(cors);
  app.register(levelRoutes);

  return app;
}
