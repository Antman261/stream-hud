import './CommandHistory.css';
import { signal } from '@preact/signals';
import { Notified, PhraseUttered } from '../../talon/index.ts';
import { listen } from '@tauri-apps/api/event';
import { JSX } from 'preact/jsx-runtime';
import { OfType } from '../../util/index.ts';

type HistoryEvent = PhraseUttered | Notified;

const commands = signal<HistoryEvent[]>([]);

listen<HistoryEvent>('ENTRY_ADDED', ({ payload }) => {
  commands.value = [payload, ...commands.value.slice(0, 25)];
});

export const CommandHistory = () => (
  <div class="command-history">
    <h2 data-tauri-drag-region>Voice Command History</h2>
    <div class="command-history-entries">
      {[...commands.value].reverse().map(CommandHistoryItem)}
    </div>
  </div>
);

type TypeElements = {
  [k in HistoryEvent['type']]: (e: OfType<HistoryEvent, k>) => JSX.Element;
};
const entryElements = {
  PHRASE_UTTERED: (e) => (
    <div className="entry command">
      {e.phrase_commands
        .map(CommandEntry)
        .reduce<(ReturnType<typeof CommandEntry> | string)[]>((p, a, i) => {
          if (i > 0 && i < e.phrase_commands.length) p.push(Sep());
          p.push(a);
          return p;
        }, [] as unknown as (ReturnType<typeof CommandEntry> | string)[])}
    </div>
  ),
  NOTIFIED: (e) => <div className={`entry notify-${e.kind}`}>{e.msg}</div>,
} as const satisfies TypeElements;

const Sep = () => <span class="command-separator">|</span>;

const CommandEntry = (words: string[]) => {
  const text = words.join(' ');
  const color = toWordColor(text);
  return <span style={`color: ${color}`}>{text}</span>;
};
const textColors: Record<string, string> = {};
const toWordColor = (text: string): string =>
  (textColors[text] = textColors[text] ??= nextColor());
const colors = [
  '#6363fd',
  'hsl(0, 87%, 44%)',
  'hsl(45, 74%, 57%)',
  'hsl(307, 94%, 46%)',
  'hsl(88, 25%, 90%)',
  'hsl(22, 100%, 37%)',
  'hsl(90, 83%, 38%)',
];
let colorIdx = 0;
const nextColor = (): string => {
  const color = colors[colorIdx]!;
  colorIdx = (colorIdx + 1) % colors.length;
  return color;
};

const CommandHistoryItem = <E extends HistoryEvent>(e: E) =>
  // @ts-expect-error ? shrug
  entryElements[e.type](e);
