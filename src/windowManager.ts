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
  setHeight(height: Height): Promise<void>;
};

type Height = keyof typeof heights;

const yOffset = 40;
const widthFactor = 0.12;
const heights = { tiny: 110, short: 300, medium: 708 } as const;
let _windowManager: WindowManager;
const isAlreadyRunning = (): boolean => _windowManager !== undefined;

const getWinMonitor = async () => {
  const win = window.getCurrentWindow();
  let monitor: window.Monitor | null;
  do {
    await delay(10);
    monitor = await window.currentMonitor();
  } while (monitor == null);

  return { win, monitor };
};

const getWindowSize = async (
  win: window.Window,
  scaleFactor: number
): Promise<LogicalSize> => (await win.outerSize())?.toLogical(scaleFactor);

export const windowManager = async (): Promise<WindowManager> => {
  if (isAlreadyRunning()) _windowManager;
  const { win, monitor } = await getWinMonitor();
  const scaleFactor = monitor?.scaleFactor ?? 1;
  const monitorSize = monitor?.size.toLogical(scaleFactor);
  await win.setFocusable(false);
  const positionWithSize = async (size: Partial<Size>) => {
    await setLogicalSize(size);
    await moveWindow(Position.BottomLeft);
  };
  const setLogicalSize = async (size: Partial<Size>) => {
    const { width, height } = await getWindowSize(win, scaleFactor);
    await win.setSize(
      new LogicalSize(size.width ?? width, size.height ?? height)
    );
  };
  const repositionWindow = async () => {
    await positionWithSize({
      height: isCameraLayout.value === false ? heights.short : -yOffset,
      width: monitorSize.width * widthFactor,
    });
  };
  _windowManager = {
    async init() {
      while (!isAlreadyRunning()) await delay(10);
      await repositionWindow();
    },
    async setStreaming() {
      await repositionWindow();
    },
    async setWithCamera() {
      await positionWithSize({ height: heights.medium });
    },
    async setHeight(height: Height) {
      await setLogicalSize({
        width: monitorSize.width * widthFactor,
        height: heights[height],
      });
    },
  };
  return _windowManager;
};
