// routes/level.routes.ts

import {getGeneratedBoard} from '@/controllers/level.controller';
import {FastifyInstance} from 'fastify';

export async function levelRoutes(fastify: FastifyInstance) {
  fastify.get('/api/level/:level', getGeneratedBoard);
}
