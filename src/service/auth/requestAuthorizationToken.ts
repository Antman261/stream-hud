import { openUrl } from '@tauri-apps/plugin-opener';

type Args = { clientId: string; redirectUri: string; scopes: string[] };

export const requestAuthorizationToken = async ({
  clientId,
  redirectUri = 'http://localhost/auth/twitch/codegrant',
  scopes,
}: Args) => {
  const url = new URL('oauth2/authorize', 'https://id.twitch.tv');
  url.searchParams.append('client_id', clientId);
  url.searchParams.append('redirect_uri', redirectUri);
  url.searchParams.append('response_type', 'code');
  url.searchParams.append('scope', scopes.join('+'));
  await openUrl(url);
};
