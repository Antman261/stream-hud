import { window } from '@tauri-apps/api';
import { LogicalPosition, LogicalSize } from '@tauri-apps/api/window';
import { delay } from './util/delay';

type WindowManager = {
  init(): Promise<void>;
  setWidth(logicalWidth: number): Promise<void>;
};

type Size = { width: number; height: number };

let _windowManager: WindowManager | undefined;

export const windowManager = async (): Promise<WindowManager> => {
  if (_windowManager !== undefined) {
    return _windowManager;
  }
  const win = window.getCurrentWindow();
  const monitor = await window.currentMonitor();
  if (monitor == null) {
    await delay(100);
    return windowManager();
  }
  const scaleFactor = monitor?.scaleFactor ?? 1;
  const yOffset = 30;
  const getSizes = async () => {
    const windowSize = (await win.outerSize())?.toLogical(scaleFactor);
    const monitorSize = monitor?.size.toLogical(scaleFactor);
    return { windowSize, monitorSize };
  };
  const newLogicalSize = async (size: Partial<Size>) => {
    const { windowSize } = await getSizes();
    return new LogicalSize(
      size.width ?? windowSize.width,
      size.height ?? windowSize.height
    );
  };
  const resizeVertically = async () => {
    const { monitorSize } = await getSizes();
    const newSize = await newLogicalSize({
      height: monitorSize.height - yOffset,
    });
    await win.setSize(newSize);
  };
  const positionRight = async () => {
    const { windowSize, monitorSize } = await getSizes();
    const xOffset = (monitorSize.width ?? 1920) - windowSize.width;
    await win.setPosition(new LogicalPosition(xOffset, yOffset));
  };
  _windowManager = {
    async init() {
      await resizeVertically();
      await positionRight();
    },
    async setWidth(width) {
      const newSize = await newLogicalSize({ width });
      await win.setSize(newSize);
      await positionRight();
    },
  };
  return _windowManager;
};
