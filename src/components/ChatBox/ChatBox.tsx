import './ChatBox.css';
import { useEffect } from 'preact/hooks';
import { Emoji, Fragment, Message, messages } from './chatState';
import { setupChatbot } from './setupChatbot';
import { outputDuration } from '../../service/obs';

export const ChatBox = () => {
  useEffect(() => {
    setupChatbot(messages);
  }, ['']);
  return outputDuration.value ? (
    <div class="chat-box">{messages.value.map(ChatMessage).reverse()}</div>
  ) : null;
};

const ChatMessage = (msg: Message) => (
  <div class="chat-message">
    <strong style={msg.color ? `color: ${msg.color}` : ''}>{msg.name}: </strong>
    <span class="text">
      {msg.fragments.length > 0 ? msg.fragments.map(RichContent) : msg.text}
    </span>
    <div class="message-controls">
      <div class="message-control-item" onClick={msg.deleteMessage}>
        X
      </div>
    </div>
  </div>
);
export const toEmojiUrl = (e: Emoji): string =>
  `https://static-cdn.jtvnw.net/emoticons/v2/${e.id}/default/light/3.0`;

const RichContent = (frag: Fragment) => (
  <span class={frag.type}>{toFragmentContent(frag)}</span>
);

const toFragmentContent = (frag: Fragment) => {
  switch (frag.type) {
    case 'text':
      return frag.text;
    case 'emote':
      return EmojiFrag(frag.emote);
    default:
      return frag.text;
  }
};

const EmojiFrag = (e: Emoji) => <img src={toEmojiUrl(e)} class="emoji" />;
