import { signal } from '@preact/signals';
import { MessageEvent } from '@twurple/easy-bot';
import { mergeObjects } from '../../util/mergeObjects';
import { username } from './constants';
import { getBot } from './setupChatbot';

type Nullish = undefined | null;

export type ChatMessages = typeof messages;
export type Message = {
  id: string;
  name: string;
  color: string | Nullish;
  text: string;
  fragments: Fragment[];
  userId: string;
  deleteMessage(): Promise<void>;
  sentAt: number;
};
export type Fragment =
  | { type: 'text'; text: string }
  | { type: 'emote'; emote: Emoji }
  | { type: 'mention'; text: string; mention: unknown }
  | { type: 'cheermote'; text: string; cheermote: Cheermote };
export type Cheermote = { prefix: string; bits: number; tier: number };
export type Emoji = { id: string; format: string[] };

const MESSAGE_DURATION_TS = 5 * 60 * 1000;
const recent = JSON.parse(localStorage.getItem('recentChat') ?? '[]');

export const messages = mergeObjects(signal<Message[]>(recent), {
  addMessage: (
    msg: Omit<Message, 'sentAt' | 'deleteMessage'>,
    e?: MessageEvent
  ) => {
    console.log('msg:', msg);
    messages.value = [
      Object.assign(msg, {
        sentAt: Date.now(),
        deleteMessage: async () => {
          messages.value = messages.value.filter((m) => msg !== m);
          await getBot().deleteMessage(username, msg.id);
        },
      }),
      ...messages.value.slice(0, 50),
    ];
  },
  cleanExpiredMessages: () => {
    const expiryAge = Date.now() - MESSAGE_DURATION_TS;
    messages.value = messages.value.filter((m) => m.sentAt > expiryAge);
  },
} as const);

messages.subscribe(() => {
  localStorage.setItem('recentChat', JSON.stringify(messages.value));
});

setInterval(messages.cleanExpiredMessages, 10_000);
