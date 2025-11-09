import { initChatbot } from '../../service/twitch.ts';
import { EventSubWsListener } from '@twurple/eventsub-ws';
import { ChatMessages } from './chatState.ts';
import { Bot } from '@twurple/easy-bot';
import { handleCommands } from './commands.ts';
import { followIntervalMs, followText, pre, username } from './constants.ts';
import { isStreaming } from '../../service/obs.ts';
import { getStreamServer } from '../../streamServer.ts';

type Listener = ReturnType<Bot['on']>;
let bot: Bot;
export const getBot = (): Bot => bot;
const sayBot = (text: string) => bot.say(username, pre + text);

const userColorMap: Record<string, string> = {};
export const setupChatbot = async (messages: ChatMessages) => {
  try {
    const listeners: Listener[] = [];
    const server = await getStreamServer();
    bot = await initChatbot();
    const user = await bot.api.users.getUserByName(username);
    if (user == null)
      throw new Error(
        `No user returned from bot.api.users.getUserByName("${username}")`!
      );
    const followInterval = setInterval(() => {
      const hasRecentActivity = messages.value.length > 0;
      if (hasRecentActivity && isStreaming.value) {
        sayBot(followText);
      }
    }, followIntervalMs);
    const websocket = new EventSubWsListener({ apiClient: bot.api });
    websocket.onChannelFollow(user, user, (e) => {
      sayBot(`Thanks for the follow ${e.userDisplayName}!`);
    });
    websocket.onChannelChatMessage(user, user, (d) => {
      messages.addMessage({
        id: d.messageId,
        name: d.chatterDisplayName,
        text: d.messageText,
        userId: d.chatterId,
        fragments: d.messageParts,
        color: d.color ?? getUserColor(d.chatterId),
      });
    });
    websocket.start();
    listeners.push(
      bot.onMessage(async (e) => {
        await handleCommands(bot, e);
      })
    );
    return async () => {
      clearInterval(followInterval);
      await server.exit();
      websocket.stop();
      listeners.forEach(bot.removeListener.bind(bot));
    };
  } catch (error) {
    console.error('Error setting up chatbot', error);
  }
};

const getUserColor = (userId: string): string =>
  userColorMap[userId] ?? (userColorMap[userId] = nextColor());
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
