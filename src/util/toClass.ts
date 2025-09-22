export const toClass = (...args: (string | undefined | boolean)[]): string =>
  args.filter((s): s is string => !!s).join(' ');
