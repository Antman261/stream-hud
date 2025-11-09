import z from 'zod';
import { jsonCodec } from './jsonCodec.ts';

export const accessTokenCodec = jsonCodec(
  z.object({
    accessToken: z.string(),
    refreshToken: z.string().nullable(),
    scope: z.string().array(),
    expiresIn: z.number().nullable(),
    obtainmentTimestamp: z.number(),
  })
);
