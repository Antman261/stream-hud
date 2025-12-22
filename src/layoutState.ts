import { LayoutKind } from './talon/index.ts';
import { storedSignal } from './state/storedSignal.ts';

export const layout = storedSignal<LayoutKind>('stream', 'layout');
