import { signal } from '@preact/signals';
import { mergeObjects } from '../../util/mergeObjects';

type Nullish = undefined | null;

export type ChatMessages = typeof messages;
export type Message = {
  name: string;
  color: string | Nullish;
  text: string;
  userId: string;
  deleteMessage(): Promise<void>;
  sentAt: number;
};

const MESSAGE_DURATION_TS = 5 * 60 * 1000;

export const messages = mergeObjects(signal<Message[]>([]), {
  addMessage: (msg: Omit<Message, 'sentAt'>) => {
    messages.value = [
      Object.assign(msg, { sentAt: Date.now() }),
      ...messages.value.slice(0, 50),
    ];
  },
  cleanExpiredMessages: () => {
    const expiryAge = Date.now() - MESSAGE_DURATION_TS;
    messages.value = messages.value.filter((m) => m.sentAt > expiryAge);
  },
} as const);

setInterval(messages.cleanExpiredMessages, 10_000);
