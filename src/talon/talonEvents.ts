type EventBase = { occurredAt: number };
export type PhraseUttered = {
  type: 'PHRASE_UTTERED';
  phrase: string;
} & EventBase;
export type MicSelected = { type: 'MIC_SELECTED'; mic: string } & EventBase;
export type Awoken = { type: 'AWOKEN' } & EventBase;
export type Drowsed = { type: 'DROWSED' } & EventBase;
export type ModesChanged = {
  type: 'MODES_CHANGED';
  modes: string[];
} & EventBase;
export type Notified = {
  type: 'NOTIFIED';
  kind: 'success' | 'info' | 'alert' | 'warn';
  msg: string;
} & EventBase;

export type TalonEvent =
  | PhraseUttered
  | MicSelected
  | Awoken
  | Drowsed
  | Notified;
export type EventMap = {
  PHRASE_UTTERED: PhraseUttered;
  MIC_SELECTED: MicSelected;
  AWOKEN: Awoken;
  DROWSED: Drowsed;
  MODES_CHANGED: ModesChanged;
};
export type EventType = keyof EventMap;
