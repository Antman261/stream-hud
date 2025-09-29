import './font/css/ibm-plex-mono-all.min.css';
import { render } from 'preact';
import { initTalonPolling } from './talon';
import { windowManager } from './windowManager';
import { CameraFeed } from './components/CameraFeed';
import { ChatBox } from './components/ChatBox/ChatBox';
import { Midsection } from './components/Midsection';
import './main.css';

const App = () => {
  return [<ChatBox />, <Midsection />, <CameraFeed />];
};

render(<App />, document.getElementById('root')!);
windowManager.init();
initTalonPolling();
