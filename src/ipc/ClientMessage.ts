import z from 'zod';
import { jsonCodec } from './jsonCodec';

export type ClientMessage = z.output<typeof clientMsgSchema>;

export const dummyEventOccurred = z.object({
  k: z.literal(0),
});

export const clientMsgSchema = z.discriminatedUnion('k', [dummyEventOccurred]);

export const clientMsgCodec = jsonCodec(clientMsgSchema);
