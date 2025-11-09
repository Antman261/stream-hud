import { mergeObjects } from '../../util/mergeObjects.ts';
import { MESSAGE_DURATION_TS, username } from './constants.ts';
import { getBot } from './setupChatbot.ts';
import { storedSignal } from '../../state/storedSignal.ts';

type Nullish = undefined | null;

export type ChatMessages = typeof messages;
export type Message = {
  id: string;
  name: string;
  color: string | Nullish;
  text: string;
  fragments: Fragment[];
  badges: string[];
  userId: string;
  deleteMessage(): Promise<void>;
  sentAt: number;
};
type MessageInput = Omit<Message, 'sentAt' | 'deleteMessage'>;
export type Fragment =
  | { type: 'text'; text: string }
  | { type: 'emote'; emote: Emoji }
  | { type: 'mention'; text: string; mention: unknown }
  | { type: 'cheermote'; text: string; cheermote: Cheermote };
export type Cheermote = { prefix: string; bits: number; tier: number };
export type Emoji = { id: string; format: string[] };

export const messages = mergeObjects(
  storedSignal<Message[]>([], 'recentChat'),
  {
    addMessage: (msg: MessageInput) => {
      const msgs = messages.value.slice(0, 50);
      msgs.unshift(
        Object.assign(msg, {
          sentAt: Date.now(),
          deleteMessage: async () => {
            messages.value = messages.value.filter((m) => msg !== m);
            await getBot().deleteMessage(username, msg.id);
          },
        })
      );
      messages.value = msgs;
    },
    cleanExpiredMessages: () => {
      const expiryAge = Date.now() - MESSAGE_DURATION_TS;
      messages.value = messages.value.filter((m) => m.sentAt > expiryAge);
    },
  } as const
);

setInterval(messages.cleanExpiredMessages, 10_000);
