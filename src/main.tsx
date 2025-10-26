import './font/css/ibm-plex-mono-all.min.css';
import { render } from 'preact';
import { initTalonPolling } from './talon';
import { windowManager } from './windowManager';
import './main.css';
import './main-narrow.css';
import { initWebsocket } from './service/obs';
import { Layout } from './Layouts';

render(<Layout />, document.getElementById('root')!);

windowManager().then((wm) => wm.init());
initTalonPolling();
initWebsocket();
