import { signal } from '@preact/signals';
import { BaseDirectory, readTextFile } from '@tauri-apps/plugin-fs';

export const currentTask = signal('');
export const currentProject = signal('');

setInterval(async () => {
  currentTask.value = await readTextFile('.current-task', {
    baseDir: BaseDirectory.Home,
  });
  currentProject.value = await readTextFile('.current-project', {
    baseDir: BaseDirectory.Home,
  });
}, 5000);
