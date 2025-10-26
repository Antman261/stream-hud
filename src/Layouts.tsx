import { signal } from '@preact/signals';
import { CameraFeed } from './components/CameraFeed';
import { ChatBox } from './components/ChatBox/ChatBox';
import { Midsection, TalonTray, TaskSection } from './components/Midsection';
import { StatsBox } from './components/StatsBox/StatsBox';
import { LayoutKind } from './talon';
import { onEvent } from './talon/reducer';
import { windowManager } from './windowManager';

const layout = signal<LayoutKind>('stream');
const layoutWidths: Record<LayoutKind, number> = {
  stream: 440,
  narrow: 360,
};
onEvent('LAYOUT_CHANGED', (e) => {
  layout.value = e.kind;
  (async () => {
    const wm = await windowManager();
    await wm.setWidth(layoutWidths[e.kind]);
  })();
});

export const Layout = () => {
  switch (layout.value) {
    case 'stream':
      return (
        <main class="stream">
          <StatsBox />
          <ChatBox />
          <Midsection />
          <CameraFeed />
        </main>
      );
    case 'narrow':
      return (
        <main class="narrow">
          <StatsBox />
          <TaskSection />
          <TalonTray />
          <CameraFeed />
        </main>
      );
  }
};
