import { useCallback, useEffect } from 'react';
import { useParams } from '@/states/params';
import {
  ParticipantsState,
  useParticipantsState,
} from '@/states/participantsState';
import { DailyEventObjectAppMessage } from '@daily-co/daily-js';
import { useAppMessage } from '@daily-co/daily-react';
import { dequal } from 'dequal';

import { getDiff } from '@/lib/getDiff';

interface SyncParams {
  type: 'params';
  params: Record<string, any>;
}

interface SyncParticipants {
  type: 'participants';
  participants: ParticipantsState;
}

type SyncParamsAppMessage = SyncParams | SyncParticipants;

export const useSyncParams = (vcsCompRef) => {
  const [params, setParams] = useParams();
  const [paxState, setPaxState] = useParticipantsState();

  const sendAppMessage = useAppMessage<SyncParamsAppMessage>({
    onAppMessage: useCallback(
      (ev: DailyEventObjectAppMessage<SyncParamsAppMessage>) => {
        switch (ev.data.type) {
          case 'params':
            setParams(ev.data.params);
            break;
          case 'participants':
            if (dequal(ev.data.participants, paxState)) return;
            setPaxState(ev.data.participants);
            break;
          default:
            break;
        }
      },
      [paxState, setParams, setPaxState]
    ),
  });

  useEffect(() => {
    if (!vcsCompRef.current) return;

    const diff = getDiff(vcsCompRef.current?.paramValues, params);
    if (
      diff &&
      Object.keys(diff).length === 0 &&
      Object.getPrototypeOf(diff) === Object.prototype
    )
      return;

    for (const key in diff) {
      vcsCompRef.current.sendParam(key, diff[key]);
    }

    // send params to other participants
    sendAppMessage({ type: 'params', params });
  }, [params, sendAppMessage, vcsCompRef]);
};

export const useSyncParticipants = () => {
  const sendAppMessage = useAppMessage<SyncParticipants>();

  const updateParticipants = useCallback(
    (participants) => sendAppMessage({ type: 'participants', participants }),
    [sendAppMessage]
  );

  return { updateParticipants };
};
