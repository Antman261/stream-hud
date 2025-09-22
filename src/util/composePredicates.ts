import { TalonEvent } from "../talon/talonEvents";

type EventPredicate = <T>(e: TalonEvent) => T;

export const composePredicates = <T>(...fns: EventPredicate[]) => (e: TalonEvent): T => fns.every((fn) => fn(e)) as T;