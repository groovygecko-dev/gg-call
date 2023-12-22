import { atom, useRecoilState } from 'recoil';

type TeeApiRequested = {
  token: string;
  basePath: string;
};

const requestedEEApiState = atom<TeeApiRequested>({
  key: 'ee-api-state',
  default: {
    token: '',
    basePath: '',
  },
});

export const useEEApi = () => useRecoilState(requestedEEApiState);