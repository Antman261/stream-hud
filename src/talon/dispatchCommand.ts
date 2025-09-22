import { Command } from '@tauri-apps/plugin-shell';

let priorCmdPromise: Promise<unknown> = Promise.resolve();

export const dispatchCommand = async (command: string) => {
  const args = [
    '-c',
    `echo '${command.replace(
      'actions.user.sync_talon_tray_state()',
      ''
    )}\nactions.user.sync_talon_tray_state()' | ~/.talon/bin/repl`,
  ];
  const cmd = Command.create('bash', args);
  await awaitSafely(priorCmdPromise);
  const cmdPromise = cmd.execute();
  priorCmdPromise = cmdPromise;
  const { signal, stderr, stdout } = await cmdPromise;
  const errText = stdout.split('\n')[1];
  if (signal) console.warn(errText);
  if (signal) console.error(stderr);
};

const awaitSafely = async (promise: Promise<unknown>) => {
  try {
    await promise;
  } catch (error) {
    console.error(error);
  }
};
