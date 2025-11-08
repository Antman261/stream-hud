import { listen, emitTo } from '@tauri-apps/api/event';
import { state } from './stateManager';
import { talonState } from './reducer';
import { TalonEvent } from './talonEvents';

export const initSocketListener = () => {
  listen<string>('talon-event', ({ payload }) => {
    const event = JSON.parse(payload) as TalonEvent;
    emitToHistory(event);
    // @ts-expect-error cbf
    state.value = talonState(state.value, event);
  });
};

const emitables: TalonEvent['type'][] = ['PHRASE_UTTERED', 'NOTIFIED'];
const emitToHistory = (event: TalonEvent) =>
  emitables.includes(event.type) && emitTo('commands', 'ENTRY_ADDED', event);
