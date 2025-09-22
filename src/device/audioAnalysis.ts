const max8Bit = 255;
export const avgAmplitude = (bufferLength: number) => {
  let max = 0;
  for (let i = 0; i < bufferLength; i++) { max += weighLowFreqs(max8Bit, i); }
  max = max / 2;
  return (data: Uint8Array): number => {
    let sum = 0;
    for (let i = 0; i < bufferLength; i++) { sum += weighLowFreqs(data[i], i); }
    const amplitude = sum / max;
    return amplitude > 0.16 ? amplitude : 0
  }
}
const weighLowFreqs = (amp: number, freqBinIdx: number) => amp / (freqBinIdx === 0 ? 10 : freqBinIdx + 1);