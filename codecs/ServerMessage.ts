import z from 'zod';
import { jsonCodec } from './jsonCodec.ts';

export type ServerMessage = z.output<typeof serverMsgSchema>;
export type AuthCodeGranted = z.output<typeof twitchAuthCodeGranted>;

export const twitchAuthCodeGranted = z.object({
  k: z.literal(0),
  code: z.string(),
});

export const serverMsgSchema = z.discriminatedUnion('k', [
  twitchAuthCodeGranted,
]);

export const serverMsgCodec = jsonCodec(serverMsgSchema);
