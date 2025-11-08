import {
  BaseDirectory,
  readTextFile,
  writeTextFile,
  mkdir,
} from '@tauri-apps/plugin-fs';
import { AccessToken, RefreshingAuthProvider } from '@twurple/auth';
import { deftok, twClientId, twSecret } from '../env';
import { Bot } from '@twurple/easy-bot';

const tokenPath = 'twRefreshToken.json';
const baseDir = { baseDir: BaseDirectory.AppData };
const safeReadTextFile = async () => {
  try {
    await mkdir('', baseDir);
    return await readTextFile(tokenPath, baseDir);
  } catch (error) {
    await writeTextFile(tokenPath, JSON.stringify(deftok, null, 4), baseDir);
    return deftok;
  }
};

export const initChatbot = async () => {
  console.log('Starting chatbot...');

  const tokenData = JSON.parse(await safeReadTextFile()) as AccessToken;

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
    commands: [],
  });
  return bot;
};
