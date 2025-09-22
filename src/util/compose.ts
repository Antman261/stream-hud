import { Func } from "./Func";

export type Hof<Fn extends Func> = (fn: Fn) => Fn;

export const compose = <Fn extends Func>(fn: Fn, hofs: Hof<Fn>[]): Fn => hofs.reduceRight<Fn>(enhanceFn, fn);

const enhanceFn = <Fn extends Func>(fn: Fn, hof: Hof<Fn>) => (fn = hof(fn));