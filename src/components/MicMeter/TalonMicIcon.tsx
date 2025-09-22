import './micIcon.css';
import { amplitude } from '../../device/microphone';
import { useTalonDispatch } from '../../hooks/useTalonDispatch';
import { isMicActive } from '../../talon';
import { OnOffBtn } from '../../elements/OnOffBtn';
import { FunctionComponent as FC } from 'preact';
import { toClass } from '../../util';

export const TalonMicIcon = () => {
  return (
    <div class="mic-icon-wrapper">
      <MicOffIcon />
      <MicOnIcon />
    </div>
  );
};
const toHsla = (amp: number) => `hsla(${135 - amp * 100}, 100%, 82%, 1)`;
const toStyle = (amp: number) =>
  `transform: scale(${amp});
   background: ${toHsla(amp)};
   box-shadow: 0 0 ${amp * 20}px ${toHsla(amp)};`;

const MicOnIcon: FC = () => {
  const { toggleMic } = useTalonDispatch();
  const classes = toClass(
    'mic-icon',
    'mic-meter',
    isMicActive.value ? '' : 'hidden'
  );
  return (
    <div onClick={toggleMic} class={classes}>
      <div class="meter-outer">
        <div class="meter-inner" style={toStyle(amplitude.value)} />
      </div>
    </div>
  );
};

const MicOffIcon: FC = () => {
  const { toggleMic } = useTalonDispatch();
  const classes = toClass('mic-icon', !isMicActive.value ? '' : 'hidden');
  return <OnOffBtn onClick={toggleMic} on={false} class={classes} icon="Mic" />;
};
