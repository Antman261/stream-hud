import { currentTask } from '../state/task';
import { ButtonDeck } from '../windows/ButtonDeck';
import { CommandHistory } from '../windows/CommandHistory';

const CurrentTask = () => {
  return (
    <div class="semi-section current-task">
      <h2>Current Task</h2>
      <div class="text">{currentTask.value}</div>
    </div>
  );
};

const talonTrayCss = `
flex-grow: 1;
border-left: 2px solid hsla(255, 94%, 79%, 0.5);
`;

const TalonTray = () => (
  <div style={talonTrayCss}>
    <CommandHistory />
    <ButtonDeck />
  </div>
);

const midsectionCss = `
display: flex;
flex-direction:row;
border-top: 2px solid hsla(255, 94%, 79%, 0.5);
border-bottom: 2px solid hsla(255, 94%, 79%, 0.5);
`;

export const Midsection = () => (
  <div style={midsectionCss}>
    <CurrentTask />
    <TalonTray />
  </div>
);
