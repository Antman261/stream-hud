import { FunctionComponent } from 'preact';
import { obsStats } from '../../service/obs';
import './StatsBox.css';
import { Defined } from '../Defined';
import { engineName, state } from '../../talon';
import { signal } from '@preact/signals';

export const StatsBox = () => (
  <div class="stats-box">
    <Clock />
    <StatsScope name="Talon">
      <Defined value={state.value.engine}>
        <StatsItem>{engineName.value}</StatsItem>
      </Defined>
    </StatsScope>
    <Defined value={obsStats.value}>
      <StatsScope name="OBS">
        <Defined value={obsStats.value?.outputSkippedFrames}>
          {obsStats.value?.outputSkippedFrames ? (
            <StatsItem name="Dropped">
              {obsStats.value?.outputSkippedFrames}
            </StatsItem>
          ) : null}
        </Defined>
        <Defined value={obsStats.value?.cpuUsage}>
          <StatsItem name="CPU">
            {Number(obsStats.value?.cpuUsage).toFixed(1)}%
          </StatsItem>
        </Defined>
      </StatsScope>
    </Defined>
  </div>
);

const now = signal(new Date());
setInterval(() => (now.value = new Date()), 1000);

const Clock: FunctionComponent = () => {
  return (
    <div class="clock">
      {toNumberPadded(now.value.getHours())}:
      {toNumberPadded(now.value.getMinutes())}:
      {toNumberPadded(now.value.getSeconds())}
    </div>
  );
};

const toNumberPadded = (number: number) =>
  number < 10 ? `0${number}` : number;

type ItemProps = { name?: string };
const StatsItem: FunctionComponent<ItemProps> = ({ name, children }) => (
  <div class="stats-item">
    {name ? <strong>{name}:</strong> : null} {children}
  </div>
);
const StatsScope: FunctionComponent<ItemProps> = ({ name, children }) => (
  <div class="stats-scope">
    {name}[{children}]{' '}
  </div>
);
