import { Func } from "./Func";

export const callWith = <F extends Func>(...args: Parameters<F>) => (fn: F) => fn(...args);