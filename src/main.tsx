import './font/css/ibm-plex-mono-all.min.css';
import { render } from 'preact';
import { ButtonDeck } from './windows/ButtonDeck';
import { initTalonPolling } from './talon';
import { CommandHistory } from './windows/CommandHistory';
import { windowManager } from './windowManager';
import { CameraFeed } from './components/CameraFeed';
import { ChatBox } from './components/ChatBox/ChatBox';

const TalonTray = () => [<CommandHistory />, <ButtonDeck />];

const App = () => {
  return [<ChatBox />, <TalonTray />, <CameraFeed />];
};

render(<App />, document.getElementById('root')!);
windowManager.init();
initTalonPolling();
