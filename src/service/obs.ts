// https://github.com/obsproject/obs-websocket/blob/master/docs/generated/protocol.md#inputvolumemeters
// https://github.com/obsproject/obs-websocket/blob/master/docs/generated/protocol.md#inputvolumechanged
// https://github.com/obsproject/obs-websocket/blob/master/docs/generated/protocol.md#inputmutestatechanged

import { OBSWebSocket } from 'obs-websocket-js';
import { obsWebsocketParams } from '../env.ts';
import { computed, signal } from '@preact/signals';
import { withSafety } from '../util/withSafety.ts';

type ObsStats = Awaited<ReturnType<typeof obs.call<'GetStats'>>>;
type StreamStats = Awaited<ReturnType<typeof obs.call<'GetStreamStatus'>>>;

const obs = new OBSWebSocket();

let hasInit = false;
let statsInterval: number | undefined;
export const obsStats = signal<ObsStats | undefined>();
export const streamStats = signal<StreamStats | undefined>();
export const outputDuration = computed(
  () => streamStats.value?.outputDuration ?? 0
);
export const isStreaming = computed(() => !!outputDuration.value);

export const initWebsocket = async () => {
  if (hasInit) return;
  hasInit = true;
  try {
    clearInterval(statsInterval);
    await obs.connect(...obsWebsocketParams);
    statsInterval = setInterval(async () => {
      const p1 = withSafety(
        async () => (obsStats.value = await obs.call('GetStats'))
      )();
      const p2 = withSafety(
        async () => (streamStats.value = await obs.call('GetStreamStatus'))
      )();
      if ((await p1) instanceof Error) {
        obsStats.value = undefined;
      }
      if ((await p2) instanceof Error) {
        streamStats.value = undefined;
      }
    }, 2000) as unknown as number;
  } catch (error) {
    hasInit = false;
    obsStats.value = undefined;
    statsInterval = setInterval(initWebsocket, 20_000) as unknown as number;
    console.log(error);
  }
};
