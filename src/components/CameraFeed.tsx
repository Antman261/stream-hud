import { signal } from '@preact/signals';
import { useCallback, useRef } from 'preact/hooks';
import './CameraFeed.css';

const style = `
max-height: 415px;
min-height: 366px;
overflow-y: clip;
margin: 7px;
border-radius: 18px;
box-shadow: 1px 1px 16px rgba(0, 0, 0, 0.6)
`;

const getWebcam = async () => {
  await navigator.mediaDevices.enumerateDevices();
  const devices = await navigator.mediaDevices.enumerateDevices();
  return navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
      frameRate: 30,
      height: 1080,
      width: 1920,
      deviceId:
        devices.find((d) => d.label === 'OBS Virtual Camera')?.deviceId ??
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
    const [webcamTrack, ..._] = webcam.getVideoTracks();
    selectedCamera.value = webcamTrack?.label ?? 'None';
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
