import { Func } from './Func';

export const withSafety = <F extends Func>(f: F): F =>
  ((...args) => {
    try {
      return f(...args);
    } catch (error) {
      console.log(`Error thrown calling ${f}:`, error);
      return error;
    }
  }) as F;
