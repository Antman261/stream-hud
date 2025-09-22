import { dispatchCommand } from '../talon';

export const useTalonDispatch = () => ({
  toggleSpeech: () => dispatchCommand('actions.user.toggle_talon()'),
  toggleMic: () => dispatchCommand(`actions.user.toggle_microphone()`),
});
