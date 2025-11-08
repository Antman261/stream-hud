import z from 'zod/v4';
import { Signal, signal } from '@preact/signals';
import { Command } from '@tauri-apps/plugin-shell';
import { jsonCodec } from './jsonCodec';

type ZType = z.core.$ZodType;
type Sidecar<S extends ZType, C extends ZType> = {
  send(msg: z.output<C>): Promise<void>;
  lastMessage: Signal<z.output<S> | undefined>;
  exit(): Promise<void>;
};

const sidecars: Record<string, Promise<Sidecar<any, any>>> = {};

export const getSidecar = async <S extends ZType, C extends ZType>(
  name: string,
  serverMsgSchema: S,
  clientMsgSchema: C
): Promise<Sidecar<S, C>> => {
  if (sidecars[name]) return sidecars[name];
  return (sidecars[name] ??= initSidecar(
    name,
    serverMsgSchema,
    clientMsgSchema
  ));
};

const initSidecar = async <S extends ZType, C extends ZType>(
  name: string,
  serverMsgSchema: S,
  clientMsgSchema: C
): Promise<Sidecar<S, C>> => {
  const serverMsgCodec = jsonCodec(serverMsgSchema);
  const clientMsgCodec = jsonCodec(clientMsgSchema);
  const command = Command.sidecar(`binaries/${name}`);
  command.stdout.on(
    'data',
    (data) => (lastMessage.value = serverMsgCodec.decode(data))
  );
  const child = await command.spawn();
  const lastMessage = signal<z.output<S>>();
  lastMessage.subscribe((v) => console.log('received:', v));
  return {
    send: async (msg) => {
      await child.write(clientMsgCodec.encode(msg));
    },
    lastMessage,
    exit: async () => {
      await child.kill();
      delete sidecars[name];
    },
  };
};
