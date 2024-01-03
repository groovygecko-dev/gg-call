import { atom, useRecoilState } from 'recoil';

type TEEApiRequested = {
  token: string;
  type: ETokenType;
  basePath: string;
  tokenSet: boolean
};

export enum ETokenType {
  EE = 'jwt',
  DAILY = 'daily',
}

const requestedEEApiState = atom<TEEApiRequested>({
  key: 'ee-api-state',
  default: {
    token: '',
    basePath: '',
    type: ETokenType.EE,
    tokenSet: false,
  },
});

export const useEEApi = () => useRecoilState(requestedEEApiState);