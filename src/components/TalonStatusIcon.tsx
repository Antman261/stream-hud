import { OnOffBtn } from "../elements/OnOffBtn";
import { useTalonDispatch } from "../hooks/useTalonDispatch";
import { state } from "../talon";

export const TalonStatusIcon = () => {
  const {toggleSpeech} = useTalonDispatch()
  const { status } = state.value;
  const isAwake = status  === 'AWAKE';
  return <OnOffBtn onClick={toggleSpeech} on={isAwake}>{isAwake ? 'On' : 'Off'}</OnOffBtn>
}