import { useCallback, useEffect } from 'react';
import { useParams, usePathname, useSearchParams } from 'next/navigation';
import { ETokenType, useEEApi } from '@/states/eeApiState';
import { useViewers } from '@/states/viewersState';
import {
  DailyEventObjectParticipantCounts,
  DailyParticipant,
} from '@daily-co/daily-js';
import { useDailyEvent, useParticipantIds } from '@daily-co/daily-react';

import { useIsOwner } from '@/hooks/useIsOwner';

interface Participant {
  id: string;
  userName: string;
}

export function PresenceListener() {
  const { name } = useParams();
  const isOwner = useIsOwner();
  const params = useSearchParams();
  const pathname = usePathname();

  const participantIds = useParticipantIds({
    filter: useCallback((p: DailyParticipant) => p.permissions.hasPresence, []),
  });

  const [, setViewers] = useViewers();
  const [eeApi, setEEApi] = useEEApi();

  useEffect(() => {
    const apiToken = params.get('eeToken') || params.get('t') || '';
    const role = pathname.split('/').pop();

    if (apiToken !== '') {
      if (!eeApi.tokenSet) {
        setEEApi({
          token: apiToken,
          basePath: params.get('basePath') || '',
          type: role === 'presenter' ? ETokenType.DAILY : ETokenType.EE,
          tokenSet: true,
        });
      }
    }
  }, [eeApi, setEEApi, params, pathname]);

  const fetchParticipants = useCallback(async () => {
    let participants: Participant[] = [];

    if (eeApi.tokenSet) {
      try {
        const participantsRes = await fetch(`${eeApi.basePath}presence`, {
          headers: new Headers({
            [eeApi.type === ETokenType.EE
              ? 'Authorization'
              : 'Daily-Auth-Token']:
              eeApi.type === ETokenType.EE
                ? `Bearer ${eeApi.token}`
                : eeApi.token,
            'Content-Type': 'application/json',
          }),
        });
        participants = (await participantsRes.json())?.participants || [];
      } catch (error) {
        console.log(error);
      }
    }

    const viewers = participants
      .filter((p) => !participantIds.includes(p.id))
      .map((p) => ({
        sessionId: p.id,
        userName: p.userName,
      }));

    setViewers(viewers);
  }, [participantIds, setViewers, eeApi]);

  useDailyEvent(
    'participant-counts-updated',
    useCallback(
      (ev: DailyEventObjectParticipantCounts) => {
        if (!isOwner) return;

        if (ev.participantCounts.hidden > 0) {
          fetchParticipants();
          setTimeout(fetchParticipants, 2500);
        } else setViewers([]);
      },
      [fetchParticipants, isOwner, setViewers],
    ),
  );

  return null;
}
