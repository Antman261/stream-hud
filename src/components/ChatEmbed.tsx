const style = `height: 350px;overflow-y: clip;margin-top: -30px;border:none;`;

export const ChatEmbed = () => (
  <div style={style}>
    <iframe
      src="https://www.twitch.tv/embed/antmancodes/chat?parent=localhost"
      height="450"
      width="436"
    ></iframe>
  </div>
);
