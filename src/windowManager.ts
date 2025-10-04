import { window } from '@tauri-apps/api';
import { LogicalPosition, LogicalSize } from '@tauri-apps/api/window';

let hasInIt = false;

export const windowManager = {
  async init() {
    if (hasInIt) return;
    hasInIt = true;
    const win = window.getCurrentWindow();
    const monitor = await window.currentMonitor();
    if (monitor == null) {
      hasInIt = false;
      setTimeout(windowManager.init, 100);
      return;
    }
    console.log({ monitor });
    const scaleFactor = monitor?.scaleFactor ?? 1;
    // const windowSize = (await win.innerSize()).toLogical(scaleFactor);
    const windowSize = (await win.outerSize())?.toLogical(scaleFactor);
    const monitorSize = monitor?.size.toLogical(scaleFactor);
    const yOffset = 30;
    const newWindowSize = new LogicalSize(
      windowSize.width,
      monitorSize.height - yOffset
    );
    win.setSize(newWindowSize);
    console.log('Window size');
    console.log(newWindowSize.toJSON());
    const xOffset = (monitorSize.width ?? 1920) - windowSize.width;
    win.setPosition(new LogicalPosition(xOffset, yOffset));
  },
};
