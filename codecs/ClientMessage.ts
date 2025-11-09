import z from 'zod';

export type ClientMessage = z.output<typeof clientMsgSchema>;

export const dummyEventOccurred = z.object({
  k: z.literal(0),
});

export const clientMsgSchema = z.discriminatedUnion('k', [dummyEventOccurred]);
