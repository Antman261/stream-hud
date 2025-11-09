import z from 'zod/v4';
import { Signal, signal } from '@preact/signals';
import { Command } from '@tauri-apps/plugin-shell';
import { jsonCodec } from 'codecs';

type ZType = z.core.$ZodType;
type Sidecar<S extends ZType, C extends ZType> = {
  send(msg: z.output<C>): Promise<void>;
  lastMessage: Signal<z.output<S> | undefined>;
  exit(): Promise<void>;
};

// deno-lint-ignore no-explicit-any
const sidecars: Record<string, Promise<Sidecar<any, any>>> = {};

export const getSidecar = <S extends ZType, C extends ZType>(
  name: string,
  serverMsgSchema: S,
  clientMsgSchema: C
): Promise<Sidecar<S, C>> => {
  return (sidecars[name] ??= initSidecar(
    name,
    serverMsgSchema,
    clientMsgSchema
  ));
};

type Opt = Partial<{ wsPath: URL }>;
const initSidecar = async <S extends ZType, C extends ZType>(
  name: string,
  serverMsgSchema: S,
  clientMsgSchema: C,
  { wsPath }: Opt = {}
): Promise<Sidecar<S, C>> => {
  const serverMsgCodec = jsonCodec(serverMsgSchema);
  const clientMsgCodec = jsonCodec(clientMsgSchema);
  const lastMessage = signal<z.output<S>>();
  const child = await spawnSidecar({
    onStdout: (data) => (lastMessage.value = serverMsgCodec.decode(data)),
    name,
  });
  if (wsPath) {
    const ws = new WebSocket(wsPath);
    ws.addEventListener('message', ({ data }) => {
      console.log('stream-server(msg):', data);
      lastMessage.value = serverMsgCodec.decode(data);
    });
    return {
      send: async (msg) => ws.send(clientMsgCodec.encode(msg)),
      lastMessage,
      exit: async () => {
        ws.close();
        await child.kill();
        delete sidecars[name];
      },
    };
  }
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

type SpawnOptions = { onStdout: (data: string) => void; name: string };

const spawnSidecar = async ({ onStdout, name }: SpawnOptions) => {
  const command = Command.sidecar(`binaries/${name}`);
  command.stdout.on('data', (data) => {
    console.log('stream-server:', data);
    onStdout(data);
  });
  command.stderr.on('data', (data) => {
    console.log('stream-server:', data);
  });
  return await command.spawn();
};
