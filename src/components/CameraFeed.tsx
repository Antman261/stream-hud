import { signal } from '@preact/signals';
import { useCallback, useEffect, useRef } from 'preact/hooks';
import './CameraFeed.css';

const style = `
max-height: 415px;
width: 422px;
overflow-y: clip;
margin-top: 10px;
margin-bottom: 5px;
margin-left: 7px;
border-radius: 18px;
box-shadow: 1px 1px 16px rgba(0, 0, 0, 0.6)
`;

const getWebcam = async () => {
  await navigator.mediaDevices.enumerateDevices();
  const devices = await navigator.mediaDevices.enumerateDevices();
  console.log({ devices });
  return navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
      frameRate: 30,
      height: 1080,
      width: 1920,
      deviceId:
        devices.find((d) => d.label === 'Elgato Virtual Camera')?.deviceId ??
        'Elgato Virtual Camera',
    },
  });
};

const hasStarted = signal(false);
const selectedCamera = signal('');

export const CameraFeed = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const startVideo = useCallback(async () => {
    const webcam = await getWebcam();
    const [webcamTrack, ...others] = webcam.getVideoTracks();
    selectedCamera.value = webcamTrack?.label ?? 'None';
    console.log('others:', others);

    console.log('selectedWebcam:', webcamTrack?.label);
    console.log({
      settings: webcamTrack?.getSettings(),
      capabilities: webcamTrack?.getCapabilities(),
      constraints: webcamTrack?.getConstraints(),
    });
    if (videoRef.current === null) return;
    videoRef.current.srcObject = webcam;
    videoRef.current.play();
    hasStarted.value = true;
  }, [videoRef]);
  return (
    <div id="camera-feed" style={style}>
      <div class="selected-camera">{selectedCamera}</div>
      <video
        ref={videoRef}
        height={420}
        onClick={startVideo}
        class="camera-video"
      ></video>
    </div>
  );
};
