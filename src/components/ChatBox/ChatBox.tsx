import './ChatBox.css';
import { useEffect } from 'preact/hooks';
import { Message, messages } from './chatState';
import { setupChatbot } from './setupChatbot';

export const ChatBox = () => {
  useEffect(() => {
    setupChatbot(messages);
  }, ['']);
  return (
    <div class="chat-box">{messages.value.map(ChatMessage).reverse()}</div>
  );
};

const ChatMessage = (msg: Message) => (
  <div class="chat-message">
    <strong style={msg.color ? `color: ${msg.color}` : ''}>{msg.name}: </strong>
    <span class="text">{msg.text}</span>
    <div class="message-controls">
      <div class="message-control-item" onClick={msg.deleteMessage}>
        X
      </div>
    </div>
  </div>
);
