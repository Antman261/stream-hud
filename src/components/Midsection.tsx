import { currentProject, currentTask } from '../state/task';
import { ButtonDeck } from '../windows/ButtonDeck';
import { CommandHistory } from '../windows/CommandHistory';
import './Midsection.css';

const CurrentTask = () => {
  return (
    <div class="semi-section current-task">
      <h2>Current Task</h2>
      <div class="text">{currentTask.value}</div>
    </div>
  );
};
const CurrentProject = () => {
  return (
    <div class="semi-section current-task">
      <h2>Project</h2>
      <div class="text">{currentProject.value}</div>
    </div>
  );
};

export const TalonTray = () => (
  <div class="talon-tray-section">
    <CommandHistory />
    <ButtonDeck />
  </div>
);

export const TaskSection = () => (
  <div class="task-section column">
    <CurrentTask />
    <CurrentProject />
  </div>
);

export const Midsection = () => (
  <div class="midsection">
    <TaskSection />
    <TalonTray />
  </div>
);
