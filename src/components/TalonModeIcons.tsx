import { FunctionComponent as FC } from 'preact';
import { JSX } from 'preact/jsx-runtime';
import { PenIcon, Twitch } from '../elements/icons';
import { modes } from '../talon';
import { CodeIcon } from '../elements/icons/CodeIcon';

export const TalonModeIcons = () => {
  return (
    <div class="mode-icons deck-section deck-section-wide">
      {modes.value.map(ModeIcon)}
    </div>
  );
};

const Square: FC = ({ children }) => <div class="icon-square">{children}</div>;

const modeIcons: Record<string, JSX.Element | string> = {
  STREAM: <Twitch />,
  CODE: (
    <Square>
      <CodeIcon />
    </Square>
  ),
  DICTATION: <PenIcon />,
  MIXED: <PenIcon />,
};

const GenericMode = (name: string) => <Square>{name.charAt(0)}</Square>;

const ModeIcon = (name: string) => {
  return (
    <div class="deck-item deck-item-labeled">
      {modeIcons[name] ?? GenericMode(name)}
      <span>{name}</span>
    </div>
  );
};
