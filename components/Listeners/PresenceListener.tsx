import { useCallback, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { useViewers } from '@/states/viewersState';
import { useEEApi } from '@/states/eeApiState';
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

  const participantIds = useParticipantIds({
    filter: useCallback((p: DailyParticipant) => p.permissions.hasPresence, []),
  });

  const [, setViewers] = useViewers();
  const [eeApi, setEEApi] = useEEApi();

  const fetchParticipants = useCallback(async () => {
    let participants: Participant[] = [];

    if (eeApi && eeApi.token !== '') {
      const participantsRes = await fetch(`${eeApi.basePath}presence`, {
        headers: new Headers({
          'Authorization': `Bearer ${eeApi.token}`,
          'Content-Type': 'application/json'
        })
      });
      participants = (await participantsRes.json())?.participants || [];
    }

    const viewers = participants
      .filter((p) => !participantIds.includes(p.id))
      .map((p) => ({
        sessionId: p.id,
        userName: p.userName,
      }));

    setViewers(viewers);
  }, [name, participantIds, setViewers, eeApi]);


  useEffect(() => {

    if (!eeApi || eeApi?.token.toString() === '') {
      setEEApi({
        token: params.get('eeToken') || '',
        basePath: params.get('basePath') || '',
      });
    }

  }, [params, eeApi, setEEApi])

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
