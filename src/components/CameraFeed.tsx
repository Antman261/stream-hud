import { signal } from '@preact/signals';
import { useCallback, useEffect, useRef } from 'preact/hooks';

const style = `
max-height: 415px;
width: 422px;
overflow-x: clip;
overflow-y: clip;
margin-top: 10px;
margin-bottom: 5px;
margin-left: 7px;
border-radius: 18px;
box-shadow: 1px 1px 16px rgba(0, 0, 0, 0.6)
`;

const getWebcam = async () => {
  const devices = await navigator.mediaDevices.enumerateDevices();
  console.log({ devices });
  return navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
      frameRate: 30,
      height: 720,
      width: 1280,
      deviceId:
        devices.find((d) => d.label === 'Elgato Virtual Camera')?.deviceId ??
        'Elgato Virtual Camera',
    },
  });
};

const hasStarted = signal(false);

export const CameraFeed = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    startVideo();
  }, ['']);
  const startVideo = useCallback(async () => {
    const webcam = await getWebcam();
    const [webcamTrack] = webcam.getVideoTracks();

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
      <video
        ref={videoRef}
        height={420}
        style={`margin-left: -185px;height: 490px;margin-top:-70px`}
      ></video>
    </div>
  );
};
