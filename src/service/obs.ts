// https://github.com/obsproject/obs-websocket/blob/master/docs/generated/protocol.md#inputvolumemeters
// https://github.com/obsproject/obs-websocket/blob/master/docs/generated/protocol.md#inputvolumechanged
// https://github.com/obsproject/obs-websocket/blob/master/docs/generated/protocol.md#inputmutestatechanged

import { OBSWebSocket } from 'obs-websocket-js';
import { obsWebsocketParams } from '../env';
import { signal } from '@preact/signals';

const obs = new OBSWebSocket();

let hasInit = false;
let statsInterval: number | undefined;
export const stats = signal<Record<string, string | number>>({});

export const initWebsocket = async () => {
  if (hasInit) return;
  hasInit = true;
  await obs.connect(...obsWebsocketParams);
  clearInterval(statsInterval);
  setInterval(async () => {
    stats.value = await obs.call('GetStats');
    // console.log(stats.value);
  }, 2000);
};
