import { signal, Signal } from '@preact/signals';
import { withSafety } from '../util/withSafety';

const decode = <T>(v: any, defaultValue: T): T =>
  v == null
    ? defaultValue
    : typeof defaultValue === 'string'
    ? v
    : (JSON.parse(v) as T);
const encode = <T>(v: T): string =>
  typeof v === 'string' ? v : JSON.stringify(v);

export const storedSignal = <T>(
  defaultValue: T,
  storageKey: string
): Signal<T> => {
  const localValue = decode(localStorage.getItem(storageKey), defaultValue);
  const sig = signal<T>((localValue ?? defaultValue) as T);
  sig.subscribe(withSafety((v) => localStorage.setItem(storageKey, encode(v))));
  return sig;
};
