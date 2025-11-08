import z from 'zod';
import { jsonCodec } from './jsonCodec';

export type ServerMessage = z.output<typeof serverMsgSchema>;

export const twitchAuthCodeGranted = z.object({
  k: z.literal(0),
  code: z.string(),
});

export const serverMsgSchema = z.discriminatedUnion('k', [
  twitchAuthCodeGranted,
]);

export const serverMsgCodec = jsonCodec(serverMsgSchema);
