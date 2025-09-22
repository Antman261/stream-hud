import { TalonState as State } from './stateManager';
import { callWith, compose, withDebugLogging } from '../util';
import { EventType, EventMap } from './talonEvents';

type Listener<T extends EventType> = (e: EventMap[T], s?: State) => void;
type Reducer<T extends EventType = EventType> = (
  s: State,
  e: EventMap[T]
) => State;

export const onEvent = <T extends EventType>(t: T, fn: Listener<T>) =>
  getTaps(t).add(fn);
export const offEvent = <T extends EventType>(t: T, fn: Listener<T>) =>
  getTaps(t).delete(fn);

const withWiretaps =
  (reduce: Reducer): Reducer =>
  (state, event) => {
    const updated = reduce(state, event);
    [...getTaps(event.type)].forEach(callWith(event, updated));
    return updated;
  };

const getReducer = <T extends EventType>(e: T) => reducers[e] as Reducer<T>;
export const talonState = compose(
  <T extends EventType>(s: State, e: EventMap[T]) => getReducer(e.type)(s, e),
  [withDebugLogging('reduceTalonState'), withWiretaps]
);

const reducers = {
  MIC_SELECTED: (state, { mic }) => ({
    ...state,
    mic,
    lastMic: mic === 'None' ? state.lastMic : mic,
  }),
  DROWSED: (state) => ({ ...state, status: 'ASLEEP' }),
  AWOKEN: (state) => ({ ...state, status: 'AWAKE' }),
  PHRASE_UTTERED: (state) => state,
  MODES_CHANGED: (state, { modes }) => ({ ...state, modes }),
} as const satisfies { [key in EventType]: Reducer<key> };

const wiretaps = {
  MIC_SELECTED: new Set<Listener<'MIC_SELECTED'>>(),
  DROWSED: new Set<Listener<'DROWSED'>>(),
  AWOKEN: new Set<Listener<'AWOKEN'>>(),
  PHRASE_UTTERED: new Set<Listener<'PHRASE_UTTERED'>>(),
  MODES_CHANGED: new Set<Listener<'MODES_CHANGED'>>(),
} as const;
const getTaps = <T extends EventType>(e: T) => wiretaps[e] as Set<Listener<T>>;
