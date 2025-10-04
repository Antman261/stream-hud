import './font/css/ibm-plex-mono-all.min.css';
import { render } from 'preact';
import { initTalonPolling } from './talon';
import { windowManager } from './windowManager';
import { CameraFeed } from './components/CameraFeed';
import { ChatBox } from './components/ChatBox/ChatBox';
import { Midsection } from './components/Midsection';
import './main.css';
import { initWebsocket } from './service/obs';
import { StatsBox } from './components/StatsBox/StatsBox';

const App = () => {
  return (
    <main>
      <StatsBox />
      <ChatBox />
      <Midsection />
      <CameraFeed />
    </main>
  );
};

render(<App />, document.getElementById('root')!);
windowManager.init();
initTalonPolling();
initWebsocket();
