import { Func } from './Func.ts';

export const withSafety = <F extends Func>(f: F): F =>
  (async (...args) => {
    try {
      return await f(...args);
    } catch (error) {
      console.debug(`Error thrown calling ${f}:`, error);
      return error;
    }
  }) as F;
