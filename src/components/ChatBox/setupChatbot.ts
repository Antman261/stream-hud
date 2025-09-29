import { initChatbot } from '../../service/twitch';
import { EventSubWsListener } from '@twurple/eventsub-ws';
import { ChatMessages } from './chatState';
import { Bot, MessageEvent } from '@twurple/easy-bot';
import { handleCommands } from './commands';
import { pre, username } from './constants';

type Listener = ReturnType<Bot['on']>;

const userColorMap: Record<string, string> = {};

export const setupChatbot = async (messages: ChatMessages) => {
  try {
    const listeners: Listener[] = [];
    const bot = await initChatbot();
    const user = await bot.api.users.getUserByName(username);
    if (user == null)
      throw new Error(
        `No user returned from bot.api.users.getUserByName("${username}")`!
      );
    const websocket = new EventSubWsListener({ apiClient: bot.api });
    websocket.onChannelFollow(user, user, (e) => {
      console.log('onChannelFollow:', e);
      bot.say(username, pre + `Thanks for the follow ${e.userDisplayName}!`);
    });
    websocket.onChannelChatMessage(user, user, (d) => {
      console.log('onChannelChatMessage:', d);
    });
    listeners.push(
      bot.onMessage(async (e) => {
        const { text, userId } = e;
        const message = {
          name: e.userDisplayName,
          text,
          userId,
          color: await getUserColor(e, bot),
          deleteMessage: async () => {
            messages.value = messages.value.filter((msg) => msg !== message);
            await e.delete();
          },
        };
        messages.addMessage(message);
        await handleCommands(bot, e);
      })
    );
    return () => {
      websocket.stop();
      listeners.forEach(bot.removeListener.bind(bot));
    };
  } catch (error) {
    console.error('Error setting up chatbot', error);
  }
};

const getUserColor = async (e: MessageEvent, bot: Bot) => {
  const color = userColorMap[e.userId];
  if (color) return color;
  const user = await e.getUser();
  const colorResult = await bot.api.chat.getColorForUser(user);
  return (userColorMap[e.userId] = colorResult ?? nextColor());
};
const colors = [
  '#6363fd',
  'hsl(0, 87%, 44%)',
  'hsl(45, 74%, 57%)',
  'hsl(307, 94%, 46%)',
  'hsl(88, 25%, 90%)',
  'hsl(22, 100%, 37%)',
  'hsl(90, 83%, 38%)',
];
let colorIdx = 0;
const nextColor = (): string => {
  const color = colors[colorIdx]!;
  colorIdx = (colorIdx + 1) % colors.length;
  return color;
};
