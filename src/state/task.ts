import { signal } from '@preact/signals';
import { BaseDirectory, readTextFile } from '@tauri-apps/plugin-fs';
import { isStreaming } from '../service/obs';

type TaskPath = { task: string; project: string };
type TaskTypes = { streaming: TaskPath; default: TaskPath };

export const currentTask = signal('');
export const currentProject = signal('');
const paths = {
  streaming: { task: '.stream-task', project: '.stream-project' },
  default: { task: '.current-task', project: '.current-project' },
} as const satisfies TaskTypes;

let currentPaths: TaskPath = paths.default;

isStreaming.subscribe((streaming) => {
  currentPaths = streaming ? paths.streaming : paths.default;
});

setInterval(async () => {
  currentTask.value = await readTextFile(currentPaths.task, {
    baseDir: BaseDirectory.Home,
  });
  currentProject.value = await readTextFile(currentPaths.project, {
    baseDir: BaseDirectory.Home,
  });
}, 5000);
