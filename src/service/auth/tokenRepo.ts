import {
  BaseDirectory,
  mkdir,
  readTextFile,
  writeTextFile,
} from '@tauri-apps/plugin-fs';
import { AccessToken } from '@twurple/auth';
import { accessTokenCodec } from 'codecs';
import { requestAuthorizationToken } from './requestAuthorizationToken.ts';
import { withSafety } from '../../util/withSafety.ts';

const tokenPath = 'twRefreshToken.json';
const baseDir = { baseDir: BaseDirectory.AppData };
const mkdirSafely = withSafety(mkdir);

export const tokenRepo = {
  read: async (): Promise<AccessToken> => {
    try {
      await mkdirSafely('', baseDir);
      return accessTokenCodec.decode(await readTextFile(tokenPath, baseDir));
    } catch (e) {
      console.log(`Error reading ${tokenPath}:`, e);
      const newToken = await requestAuthorizationToken();
      await tokenRepo.write(newToken);
      return newToken;
    }
  },
  write: (token: AccessToken) =>
    writeTextFile(tokenPath, accessTokenCodec.encode(token), baseDir),
};
