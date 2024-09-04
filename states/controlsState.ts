import { atom, useRecoilState } from 'recoil';

type TControlsState = {
  muted: boolean;
  volume: number;
  audios: HTMLAudioElement[];
};

const controlsState = atom<TControlsState>({
  key: 'controls-state',
  default: {
    muted: false,
    volume: 1,
    audios: [],
  },
});

export const useControlsState = () => useRecoilState(controlsState);

// const dailyAudioHandle = atom<HTMLAudioElement[]>({
//   key: 'audio-element-state',
//   default: [],
// });

// export const useDailyAudiosState = () => useRecoilState(dailyAudioHandle);