type EventBase = { occurredAt: number };
export type PhraseUttered = {
  type: 'PHRASE_UTTERED';
  phrase: string;
  phrase_commands: string[][];
} & EventBase;

export type MicSelected = { type: 'MIC_SELECTED'; mic: string } & EventBase;

export type Awoken = { type: 'AWOKEN' } & EventBase;

export type Drowsed = { type: 'DROWSED' } & EventBase;

export type ModesChanged = {
  type: 'MODES_CHANGED';
  modes: string[];
} & EventBase;

export type EngineChanged = {
  type: 'ENGINE_CHANGED';
  engine: string;
} & EventBase;

export type LayoutKind = 'stream' | 'narrow';
export type LayoutChanged = {
  type: 'LAYOUT_CHANGED';
  kind: LayoutKind;
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
  | Notified
  | EngineChanged
  | LayoutChanged;

export type EventMap = {
  PHRASE_UTTERED: PhraseUttered;
  MIC_SELECTED: MicSelected;
  AWOKEN: Awoken;
  DROWSED: Drowsed;
  MODES_CHANGED: ModesChanged;
  ENGINE_CHANGED: EngineChanged;
  LAYOUT_CHANGED: LayoutChanged;
};
export type EventType = keyof EventMap;
