import { RefreshingAuthProvider } from '@twurple/auth';
import { twClientId, twSecret } from '../../env.ts';
import { tokenRepo } from './tokenRepo.ts';
import { requestAuthorizationToken } from './requestAuthorizationToken.ts';

let authProvider: RefreshingAuthProvider | undefined;

export const getAuthProvider = async (): Promise<RefreshingAuthProvider> =>
  (authProvider ??= await initAuthProvider());

const initAuthProvider = async () => {
  const tokenData = await tokenRepo.read();
  authProvider = new RefreshingAuthProvider({
    clientId: twClientId,
    clientSecret: twSecret,
  });
  authProvider.onRefreshFailure((_id) => {
    console.error(`Failed to refresh token for ${_id}`);
    requestAuthorizationToken();
  });
  authProvider.onRefresh((_userId, newTokenData) =>
    tokenRepo.write(newTokenData)
  );
  await authProvider.addUserForToken(tokenData, ['chat']);
  return authProvider;
};
