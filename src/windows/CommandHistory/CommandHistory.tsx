import './CommandHistory.css';
import { signal } from '@preact/signals';
import { Notified, PhraseUttered } from '../../talon';
import { listen } from '@tauri-apps/api/event';
import { JSX } from 'preact/jsx-runtime';
import { OfType } from '../../util';

type HistoryEvent = PhraseUttered | Notified;

const commands = signal<HistoryEvent[]>([]);

listen<HistoryEvent>('ENTRY_ADDED', ({ payload }) => {
  commands.value = [payload, ...commands.value.slice(0, 8)];
});

export const CommandHistory = () => (
  <div class="command-history">
    <h2>Voice Command History</h2>
    <div class="command-history-entries">
      {[...commands.value].reverse().map(CommandHistoryItem)}
    </div>
  </div>
);

type TypeElements = {
  [k in HistoryEvent['type']]: (e: OfType<HistoryEvent, k>) => JSX.Element;
};
const entryElements = {
  PHRASE_UTTERED: (e) => <div className="entry command">{e.phrase}</div>,
  NOTIFIED: (e) => <div className={`entry notify-${e.kind}`}>{e.msg}</div>,
} as const satisfies TypeElements;

const CommandHistoryItem = <E extends HistoryEvent>(e: E) =>
  // @ts-expect-error ? shrug
  entryElements[e.type](e);
