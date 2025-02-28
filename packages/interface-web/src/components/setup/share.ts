// import { cuttingBoardFormat } from '@/store/features/users/slice';
import { defaultConfig } from 'core';

export const baseInitialValues = {
  cuttingBoard: true,
  cuttingBoardFormat: ['image'],
  concurrentQuantity: defaultConfig.maxConcurrency,
  waitingInterval: defaultConfig.waitingTime,
  shortcutPaste: true,
};
