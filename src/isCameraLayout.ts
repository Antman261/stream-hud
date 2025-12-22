import { computed } from '@preact/signals';
import { layout } from './layoutState';
import { isStreaming } from './service/obs';

export const isCameraLayout = computed(() => {
  return (
    layout.value === 'stream' || isStreaming.value || layout.value === 'cam'
  );
});
