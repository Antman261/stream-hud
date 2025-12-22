import './ButtonDeck.css';
import { toClass } from '../../util/index.ts';
import {
  isAwake,
  isMicActive,
  isMixedMode,
  isStreamMode,
} from '../../talon/index.ts';
import { TalonMicIcon } from '../../components/MicMeter/TalonMicIcon.tsx';
import { TalonModeIcons } from '../../components/TalonModeIcons.tsx';
import { VerticalBar } from '../../elements/VerticalBar.tsx';

export const ButtonDeck = () => {
  const classes = toClass(
    'button-deck',
    (!isAwake.value || !isMicActive.value) && 'bg-off',
    isMixedMode.value && 'bg-warn',
    isStreamMode.value && 'bg-stream'
  );
  return (
    <div data-tauri-drag-region class={classes}>
      <TalonModeIcons />
      <VerticalBar />
      <TalonMicIcon />
    </div>
  );
};
