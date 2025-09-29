import {
  BaseDirectory,
  readTextFile,
  writeTextFile,
  mkdir,
} from '@tauri-apps/plugin-fs';
import { RefreshingAuthProvider } from '@twurple/auth';
import { deftok, twClientId, twSecret } from '../env';
import { Bot } from '@twurple/easy-bot';

const tokenPath = 'twRefreshToken.json';
const baseDir = { baseDir: BaseDirectory.AppData };
const safeReadTextFile = async () => {
  try {
    await mkdir('', baseDir);
    return await readTextFile(tokenPath, baseDir);
  } catch (error) {
    console.log('safeReadTextFile.error before write');
    await writeTextFile(tokenPath, JSON.stringify(deftok, null, 4), baseDir);
    console.log('safeReadTextFile.error after write');
    return deftok;
  }
};

export const initChatbot = async () => {
  console.log('Starting chatbot...');

  const tokenData = JSON.parse(await safeReadTextFile());

  const authProvider = new RefreshingAuthProvider({
    clientId: twClientId,
    clientSecret: twSecret,
  });

  authProvider.onRefresh(async (_userId, newTokenData) => {
    console.log('Refreshing token');
    await writeTextFile(
      tokenPath,
      JSON.stringify(newTokenData, null, 4),
      baseDir
    );
  });

  await authProvider.addUserForToken(tokenData, ['chat']);
  const bot = new Bot({
    authProvider,
    channel: 'antmancodes',

    chatClientOptions: { requestMembershipEvents: true },
    // commands: toBotCommands(),
    commands: [],
  });
  return bot;
};
