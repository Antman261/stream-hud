import { window } from '@tauri-apps/api';
import { LogicalSize } from '@tauri-apps/api/window';
import { delay } from './util/delay';
import { moveWindow, Position } from '@tauri-apps/plugin-positioner';
import { Size } from './Size';
import { isCameraLayout } from './isCameraLayout';

type WindowManager = {
  init(): Promise<void>;
  // setSize(size: Partial<Size>): Promise<void>;
  setStreaming(): Promise<void>;
  setWithCamera(): Promise<void>;
  setSmall(): Promise<void>;
};

let _windowManager: WindowManager;

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
  // const yOffset = 30;
  const getSizes = async () => {
    const windowSize = (await win.outerSize())?.toLogical(scaleFactor);
    const monitorSize = monitor?.size.toLogical(scaleFactor);
    return { windowSize, monitorSize };
  };
  const setLogicalSize = async (size: Partial<Size>) => {
    const { windowSize } = await getSizes();
    return win.setSize(
      new LogicalSize(
        size.width ?? windowSize.width,
        size.height ?? windowSize.height
      )
    );
  };
  const makeFullHeight = async () => {
    const { monitorSize } = await getSizes();
    await setLogicalSize({
      width: 360,
      height: monitorSize.height,
    });
    await moveWindow(Position.TopRight);
  };
  const repositionWindow = async () => {
    await moveWindow(Position.TopLeft);
    if (isCameraLayout.value === false) {
      await setLogicalSize({ height: 315 });
      await moveWindow(Position.BottomRight);
    }
  };
  _windowManager = {
    async init() {
      await repositionWindow();
    },
    async setStreaming() {
      await makeFullHeight();
    },
    async setWithCamera() {
      await setLogicalSize({ height: 698 });
      await moveWindow(Position.BottomRight);
    },
    async setSmall() {
      await setLogicalSize({ width: 360, height: 315 });
      await moveWindow(Position.BottomRight);
    },
  };
  return _windowManager;
};
