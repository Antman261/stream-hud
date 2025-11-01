import { LayoutKind } from './talon';
import { storedSignal } from './state/storedSignal';

export const layout = storedSignal<LayoutKind>('stream', 'layout');
