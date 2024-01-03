import { atom, useRecoilState } from 'recoil';

type TeeApiRequested = {
  token: string;
  type: ETokenType;
  basePath: string;
  tokenSet: boolean
};

export enum ETokenType {
  EE = 'jwt',
  DAILY = 'daily',
}

const requestedEEApiState = atom<TeeApiRequested>({
  key: 'ee-api-state',
  default: {
    token: '',
    basePath: '',
    type: ETokenType.EE,
    tokenSet: false,
  },
});

export const useEEApi = () => useRecoilState(requestedEEApiState);