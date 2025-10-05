import { FunctionComponent } from 'preact';
import { obsStats } from '../../service/obs';
import './StatsBox.css';
import { Maybe } from './Maybe';
import { engineName, state } from '../../talon';

export const StatsBox = () => (
  <div class="stats-box">
    <StatsScope name="Talon">
      <Maybe value={state.value.engine}>
        <StatsItem name="Eng">{engineName.value}</StatsItem>
      </Maybe>
    </StatsScope>
    <StatsScope name="OBS">
      <Maybe value={obsStats.value?.outputSkippedFrames}>
        <StatsItem name="Dropped">
          {obsStats.value?.outputSkippedFrames}
        </StatsItem>
      </Maybe>
      <Maybe value={obsStats.value?.cpuUsage}>
        <StatsItem name="CPU">
          {Number(obsStats.value?.cpuUsage).toFixed(1)}%
        </StatsItem>
      </Maybe>
    </StatsScope>
  </div>
);

type ItemProps = { name: string };
const StatsItem: FunctionComponent<ItemProps> = ({ name, children }) => (
  <div class="stats-item">
    <strong>{name}:</strong> {children}
  </div>
);
const StatsScope: FunctionComponent<ItemProps> = ({ name, children }) => (
  <div class="stats-scope">
    {name}[{children}]{' '}
  </div>
);
