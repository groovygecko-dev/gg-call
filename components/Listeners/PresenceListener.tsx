import { useCallback, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { useViewers } from '@/states/viewersState';
import { useEEToken } from '@/states/eeTokenState';
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
  const [eeToken, setEEToken] = useEEToken();

  const fetchParticipants = useCallback(async () => {
    let participants: Participant[] = [];

    if (eeToken && eeToken !== '') {
      const participantsRes = await fetch(`/api/daily/presence?roomName=${name}`);
      participants = (await participantsRes.json())?.participants || [];
    }

    const viewers = participants
      .filter((p) => !participantIds.includes(p.id))
      .map((p) => ({
        sessionId: p.id,
        userName: p.userName,
      }));

    setViewers(viewers);
  }, [name, participantIds, setViewers, eeToken]);


  useEffect(() => {

    if (!eeToken || eeToken === '') {
      setEEToken(params.get('eeToken') || '');
    }

  }, [params, eeToken, setEEToken])

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
