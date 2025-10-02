import { Bot, MessageEvent } from '@twurple/easy-bot';
import { msgs } from './msgs';
import { pre, username } from './constants';

type BotCommandHandler = (
  e: MessageEvent,
  bot: Bot,
  words: string[]
) => Promise<void>;

type CommandMap = Record<string, BotCommandHandler>;

const reply = (text: string) => (e: MessageEvent) => e.reply(pre + text);
const say = (text: string) => (_e: MessageEvent, bot: Bot) =>
  bot.say(username, pre + text);

const commandMap: CommandMap = {
  socials: reply(
    `Follow AntmanCodes at: https://github.com/Antman261 - Github https://bsky.app/profile/antman.bsky.social - BlueSky https://antman-does-software.com - Website`
  ),
  github: reply(`Follow Antman on GitHub at https://github.com/Antman261`),
  website: reply(
    `Subscribe to Antman's software blog at https://antman-does-software.com`
  ),
  bsky: reply(
    `Follow AntmanCodes at https://bsky.app/profile/antman.bsky.social`
  ),
  lurk: (e, bot) => {
    const msg = msgs[Math.round(Math.random() * msgs.length - 1)];
    return say(`@${e.userDisplayName} ${msg}`)(e, bot);
  },
};
commandMap.social = commandMap.socials!;

const helpText = `${pre}Available commands: ${Object.keys(commandMap)
  .map((v) => '!' + v)
  .join(', ')}`;
const isCommand = (e: MessageEvent): boolean => e.text.at(0) === '!';

export const handleCommands = async (bot: Bot, e: MessageEvent) => {
  if (!isCommand(e)) return;
  const [commandName, ...words] = e.text.split(' ');
  const command =
    commandMap[commandName?.replace('!', '') as keyof typeof commandMap];
  if (!command) return await e.reply(helpText);
  await command(e, bot, words);
};
