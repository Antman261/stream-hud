import { CameraFeed } from './components/CameraFeed';
import { ChatBox } from './components/ChatBox/ChatBox';
import { Midsection } from './components/Midsection';
import { StatsBox } from './components/StatsBox/StatsBox';
import { onEvent } from './talon/reducer';
import { layout } from './layoutState';
import { isStreaming } from './service/obs';
import { Truthy } from './components/Defined';
import { toClass } from './util';
import { windowManager } from './windowManager';
import { isCameraLayout } from './isCameraLayout';

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
        <Midsection />
        <Truthy value={isStreaming.value}>
          <ChatBox />
        </Truthy>
      </main>
    </div>
  );
};
