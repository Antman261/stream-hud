import { storedSignal } from '../state/storedSignal.ts';
import { currentProject, currentTask } from '../state/task.ts';
import { onEvent } from '../talon/reducer.ts';
import { CommandHistory } from '../windows/CommandHistory/index.ts';
import './Midsection.css';

const CurrentTask = () => {
  return (
    <div class="semi-section current-task">
      <h2>Task</h2>
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
    {/* <ButtonDeck /> */}
  </div>
);

const isTaskSectionHidden = storedSignal(false, 'isTaskSectionHidden');
onEvent(
  'TASK_SECTION_TOGGLED',
  () => (isTaskSectionHidden.value = !isTaskSectionHidden.value)
);
export const TaskSection = () =>
  isTaskSectionHidden.value ? null : (
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
