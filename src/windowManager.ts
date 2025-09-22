import { window } from '@tauri-apps/api';
import { LogicalPosition } from '@tauri-apps/api/window';

let hasInIt = false;

export const windowManager = {
  async init() {
    if (hasInIt) return;
    hasInIt = true;
    const win = window.getCurrentWindow();
    const monitor = await window.currentMonitor();
    const scaleFactor = monitor?.scaleFactor ?? 1;
    const monitorWidth = monitor?.size.toLogical(scaleFactor).width;
    const windowWidth = (await win.outerSize()).toLogical(scaleFactor).width;
    const xOffset = (monitorWidth ?? 1980) - windowWidth;
    win.setPosition(new LogicalPosition(xOffset, 0));
  },
};
