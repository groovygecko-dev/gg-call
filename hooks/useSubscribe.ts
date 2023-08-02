import { useCallback } from 'react';
import { DailyParticipant } from '@daily-co/daily-js';
import {
  useDaily,
  useLocalSessionId,
  useParticipantIds,
} from '@daily-co/daily-react';

import { useIsOwner } from '@/hooks/useIsOwner';
import { useStage } from '@/hooks/useStage';

export const useSubscribe = () => {
  const daily = useDaily();
  const isOwner = useIsOwner();
  const { waitingParticipantIds } = useStage();
  const localSessionId = useLocalSessionId();

  const subscribedIds = useParticipantIds({
    filter: useCallback(
      (p: DailyParticipant) => p.tracks.video.subscribed === true,
      []
    ),
  });

  const stagedIds = useParticipantIds({
    filter: useCallback(
      (p: DailyParticipant) => p.tracks.video.subscribed === 'staged',
      []
    ),
  });

  const subscribeToWaitingParticipants = useCallback(() => {
    if (!isOwner || !daily) return;

    const updateSubscriptions = {};

    waitingParticipantIds.forEach((id) => {
      if (subscribedIds.includes(id) || localSessionId === id) return;
      updateSubscriptions[id] = { setSubscribedTracks: true };
    });

    if (Object.keys(updateSubscriptions).length === 0) return;
    daily.updateParticipants(updateSubscriptions);
  }, [daily, isOwner, localSessionId, subscribedIds, waitingParticipantIds]);

  const unsubscribeFromWaitingParticipants = useCallback(() => {
    if (!isOwner || !daily) return;

    const updateSubscriptions = {};

    waitingParticipantIds.forEach((id) => {
      if (stagedIds.includes(id) || localSessionId === id) return;
      updateSubscriptions[id] = { setSubscribedTracks: 'staged' };
    });

    if (Object.keys(updateSubscriptions).length === 0) return;
    daily.updateParticipants(updateSubscriptions);
  }, [daily, isOwner, localSessionId, stagedIds, waitingParticipantIds]);

  return {
    subscribeToWaitingParticipants,
    unsubscribeFromWaitingParticipants,
  };
};
