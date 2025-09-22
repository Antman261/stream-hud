import './OnOffBtn.css';
import { FunctionComponent as FC } from 'preact';
import { OnClickProp } from './OnClickProp';
import { PowerIcon, MicOff } from './icons';
import { toClass } from '../util';

type Props = OnClickProp & {
  on: boolean;
  icon?: 'Power' | 'Mic';
  class?: string;
};
export const OnOffBtn: FC<Props> = ({ children, onClick, on, icon, ...p }) => {
  const classes = toClass('on-off-button', on ? 'on' : 'off', p.class);
  return (
    <div onClick={onClick} class={classes}>
      <Icon icon={icon ?? 'Power'} />
      <span>{children}</span>
    </div>
  );
};

const icons = {
  Power: PowerIcon,
  Mic: MicOff,
} as const;
const Icon: FC<Required<Pick<Props, 'icon'>>> = ({ icon }) => icons[icon]();
