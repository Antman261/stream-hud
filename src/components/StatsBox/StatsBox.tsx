import { stats } from '../../service/obs';
import './StatsBox.css';

export const StatsBox = () => {
  return (
    <div class="stats-box">
      <div class="stats-item">
        <strong>CPU:</strong> {Number(stats.value.cpuUsage).toFixed(1)}%
      </div>
    </div>
  );
};
