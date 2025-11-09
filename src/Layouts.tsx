import { CameraFeed } from './components/CameraFeed.tsx';
import { ChatBox } from './components/ChatBox/ChatBox.tsx';
import { Midsection } from './components/Midsection.tsx';
import { StatsBox } from './components/StatsBox/StatsBox.tsx';
import { onEvent } from './talon/reducer.ts';
import { layout } from './layoutState.ts';
import { isStreaming } from './service/obs.ts';
import { Truthy } from './components/Defined.tsx';
import { toClass } from './util/index.ts';
import { windowManager } from './windowManager.ts';
import { isCameraLayout } from './isCameraLayout.ts';

const updateWindowSize = async () => {
  const wm = await windowManager();
  if (isStreaming.value) return await wm.setStreaming();
  if (isCameraLayout.value) return wm.setWithCamera();
  await wm.setSmall();
};
onEvent('LAYOUT_CHANGED', (e) => {
  layout.value = e.kind;
});
layout.subscribe(updateWindowSize);
isStreaming.subscribe(updateWindowSize);

export const Layout = () => {
  const mainClasses = [
    isStreaming.value ? 'stream' : 'narrow',
    isCameraLayout.value ? undefined : 'small',
  ];
  return (
    <div id="wrapper" class={toClass(...mainClasses)}>
      <main class={toClass(...mainClasses)}>
        <StatsBox />
        <Truthy value={isCameraLayout.value}>
          <CameraFeed />
        </Truthy>
        <Truthy value={isStreaming.value}>
          <ChatBox />
        </Truthy>
        <Midsection />
      </main>
    </div>
  );
};
