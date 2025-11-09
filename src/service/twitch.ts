import { Bot } from '@twurple/easy-bot';
import { getAuthProvider } from './auth/getAuthProvider.ts';

export const initChatbot = async () =>
  new Bot({
    authProvider: await getAuthProvider(),
    channel: 'antmancodes',
    chatClientOptions: { requestMembershipEvents: true },
    commands: [],
  });
