import { Func } from './Func';

export const mergeObjects = <
  A extends object | Func,
  const B extends unknown = unknown
>(
  a: A,
  b: B
): A & B => Object.assign(a, b);

export const extendFunc = <A extends Func, const B extends object>(
  a: A,
  b: B
): A & B => Object.assign(a, b);
