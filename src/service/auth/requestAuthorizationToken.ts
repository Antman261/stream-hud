import { openUrl } from '@tauri-apps/plugin-opener';
import { getStreamServer } from '../../streamServer.ts';
import { twClientId, twSecret } from '../../env.ts';
import { AccessToken, exchangeCode } from '@twurple/auth';

let pendingAuthorization: PromiseWithResolvers<string> | undefined;
const redirectUri = 'http://localhost:7500/auth/twitch/codegrant';
const scopes = [
  'chat:read',
  'chat:edit',
  'moderator:manage:chat_messages',
  'moderator:read:followers',
  'user:read:chat',
].join(' ');

export const requestAuthorizationToken = async (): Promise<AccessToken> => {
  (await getStreamServer()).lastMessage.subscribe((v) => {
    switch (v?.k) {
      case 0:
        pendingAuthorization?.resolve(v.code);
        break;
    }
  });
  const url = new URL('oauth2/authorize', 'https://id.twitch.tv');
  url.searchParams.append('client_id', twClientId);
  url.searchParams.append('redirect_uri', redirectUri);
  url.searchParams.append('response_type', 'code');
  url.searchParams.append('scope', scopes);
  pendingAuthorization = Promise.withResolvers<string>();
  await openUrl(url);
  const code = await pendingAuthorization.promise;
  return await exchangeCode(twClientId, twSecret, code, redirectUri);
};
