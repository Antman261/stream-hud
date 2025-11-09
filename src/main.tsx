import './font/css/ibm-plex-mono-all.min.css';
import { render } from 'preact';
import { initTalonPolling } from './talon/index.ts';
import { windowManager } from './windowManager.ts';
import './main.css';
import './main-stream.css';
import { initWebsocket } from './service/obs.ts';
import { Layout } from './Layouts.tsx';

render(<Layout />, document.getElementById('root')!);

windowManager().then((wm) => wm.init());
initTalonPolling();
initWebsocket();
