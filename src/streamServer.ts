import { serverMsgSchema, clientMsgSchema } from 'codecs';
import { getSidecar } from './ipc/index.ts';

export const getStreamServer = async () => {
  console.log('Starting streamServer...');
  return await getSidecar('stream-server', serverMsgSchema, clientMsgSchema);
};
