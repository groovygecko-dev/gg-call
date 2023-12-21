import { atom, useRecoilState } from 'recoil';

const eeTokenState = atom<string>({
  key: 'ee-token-state',
  default: '',
});

export const useEEToken = () => useRecoilState(eeTokenState);