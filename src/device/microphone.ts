import { signal } from "@preact/signals";
import { memoise } from "../util";
import { offPollTick, onPollTick, state } from "../talon";
import { onEvent } from "../talon/reducer";
import { avgAmplitude } from "./audioAnalysis";

export const amplitude = signal(0);

export const stopMetering = async () => offPollTick(await initMetering());

const deviceConstraints = { audio: { echoCancellation: false } };
const audioCxt = new AudioContext({ latencyHint: 'playback' });
let analyserNode: AnalyserNode;
let mic: string | undefined;
let stream: MediaStream | undefined;
let mediaStreamAudioSourceNode: MediaStreamAudioSourceNode | undefined;
let isUpdating = false;

const meterActiveMic = async () => {
    if (isUpdating) return;
    isUpdating = true;
    stream = await navigator.mediaDevices.getUserMedia(deviceConstraints);
    const startingTracks = stream.getAudioTracks();
    const removedTracks = startingTracks.filter(inactiveMicTracks(state.value.mic));
    try {
      removedTracks.forEach(stream.removeTrack);
    } catch(error) {
      console.error('Error removing tracks:', error)
    }
    mediaStreamAudioSourceNode = audioCxt.createMediaStreamSource(stream);
    mediaStreamAudioSourceNode.connect(analyserNode);
    mic = state.value.mic;
    isUpdating = false;
}

const configureAudioContext = async () => {
  analyserNode = new AnalyserNode(audioCxt, { fftSize: 32, maxDecibels: 0 });
  if (state.value.mic !== mic) { await meterActiveMic(); }
  stream?.addEventListener('addtrack', meterActiveMic);
  stream?.addEventListener('removetrack', meterActiveMic);

}

const initMetering = memoise(async () => {
  await configureAudioContext();
  const bufferLength = analyserNode.frequencyBinCount;
  const calcAvgAmplitude = avgAmplitude(bufferLength);
  const data = new Uint8Array(bufferLength);
  return () => {
    analyserNode.getByteFrequencyData(data);
    amplitude.value = calcAvgAmplitude(data);
  };
});

let updateAmplitude: (() => void) | undefined; 
const startMetering = async () => {
  if (updateAmplitude) return onPollTick(updateAmplitude);;
  updateAmplitude = await initMetering();
  onPollTick(updateAmplitude);
}

onEvent('MIC_SELECTED', ({ mic }) => mic === 'None' ? stopMetering() : startMetering());

const inactiveMicTracks = (mic: string) => ({label}: MediaStreamTrack) => label !== mic;