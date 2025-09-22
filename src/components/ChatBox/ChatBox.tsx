import { signal } from '@preact/signals';
import { initChatbot } from '../../service/twitch';
import './ChatBox.css';
import { useEffect } from 'preact/hooks';

type Message = { name: string; text: string };

const messages = signal<Message[]>([]);
const addMessage = (msg: Message) => {
  messages.value = [msg, ...messages.value.slice(0, 10)];
};

export const ChatBox = () => {
  useEffect(() => {
    (async () => {
      const bot = await initChatbot();
      bot.onMessage((e) => {
        const { text } = e;
        addMessage({ name: e.userDisplayName, text });
      });
      bot.onJoin((e) => {
        console.log('Joined:', e);
      });
    })();
  }, ['']);
  return (
    <div class="chat-box">{messages.value.map(ChatMessage).reverse()}</div>
  );
};

const ChatMessage = (msg: Message) => (
  <div class="chat-message">
    <strong class={'username ' + toColor(msg.name)}>{msg.name}: </strong>
    <span class="text">{msg.text}</span>
  </div>
);

const userNameMap: Record<string, string> = {};
const colors = ['blue', 'red', 'yellow', 'pink', 'white', 'orange', 'green'];
let colorIdx = 0;
const nextColor = () => {
  const color = colors[colorIdx];
  colorIdx = (colorIdx + 1) % colors.length;
  return color;
};
const toColor = (name: string) => {
  const color = userNameMap[name] ?? nextColor();
  return (userNameMap[name] = color);
};
