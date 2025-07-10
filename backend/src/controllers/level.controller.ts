// controllers/level.controller.ts

import {ClassicInitGame, KillerInitGame} from '@/types';
import {FastifyReply, FastifyRequest} from 'fastify';
import {generateBoard} from '../services/board.service';

export async function getGeneratedBoard(
  request: FastifyRequest<{
    Params: {level: string};
    Querystring: {mode: string};
  }>,
  reply: FastifyReply,
) {
  const {level} = request.params;
  const {mode} = request.query;

  if (!['killer', 'classic'].includes(mode)) {
    return reply
      .status(400)
      .send({error: 'Invalid mode: must be killer or classic'});
  }

  try {
    const board = generateBoard(level, mode) as
      | ClassicInitGame
      | KillerInitGame;
    const result = {
      ...board,
      mode: mode,
    };
    return reply.send(result);
  } catch (err) {
    return reply.status(500).send({error: 'Failed to generate board'});
  }
}
