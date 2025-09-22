import { TalonEvent } from './talonEvents';

const AGE_MS = 12000;
export const isRecent = (e: TalonEvent) => e.occurredAt > Date.now() - AGE_MS;
