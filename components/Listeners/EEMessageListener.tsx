import { useCallback, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useControlsState } from '@/states/controlsState';
import { ETokenType, useEEApi } from '@/states/eeApiState';
import { useLocalSessionId, useMeetingState } from '@daily-co/daily-react';

import { useStage } from '@/hooks/useStage';

export function EEMessageListener() {
  const [, setEEApi] = useEEApi();
  const meetingState = useMeetingState();
  const [controlsState, setControlsState] = useControlsState();
  const pathname = usePathname();
  const {
    state,
    isRequesting,
    requestToJoin,
    cancelRequestToJoin,
    accept,
    deny,
  } = useStage();
  const role = pathname.split('/').pop();
  const localSessionId = useLocalSessionId();

  const handleControlsStateChange = useCallback(
    (state: any) => {
      if (!controlsState || controlsState.muted) return;

      const { mute, volume } = state;

      setControlsState({
        ...controlsState,
        muted: [true, false].includes(mute) ? mute : controlsState.muted,
        volume: +volume >= 0 ? +volume : controlsState.volume,
      });
    },
    [controlsState, setControlsState],
  );

  useEffect(() => {
    window.addEventListener(
      'message',
      (event) => {
        if (event.origin === process.env.NEXT_PUBLIC_BASE_URL) {
          return;
        }

        if (event.data.eeToken && event.data.basePath) {
          setEEApi({
            token: event.data.eeToken,
            basePath: event.data.basePath,
            type: ETokenType.EE,
            tokenSet: true,
          });
        }

        if (event.data.action) {
          switch (event.data.action) {
            case 'cancel-request-to-join':
              cancelRequestToJoin();
              break;
            case 'request-to-join':
              requestToJoin();
              break;
            case 'gg-call-accept-request-to-join':
              accept(event.data.action.sessionId);
              break;
            case 'gg-call-deny-request-to-join':
              deny(event.data.action.sessionId);
              break;
            case 'gg-controls-state-change':
              handleControlsStateChange(event.data?.data);
              break;
          }
        }
      },
      false,
    );
  }, [setEEApi, cancelRequestToJoin, requestToJoin, accept, deny]);

  useEffect(() => {
    if (role !== 'viewer') {
      return;
    }

    window.parent.postMessage(
      {
        meetingReady: meetingState === 'joined-meeting',
      },
      '*',
    );
  }, [role, meetingState]);

  useEffect(() => {
    if (role !== 'viewer') {
      return;
    }

    window.parent.postMessage(
      {
        state: state,
        sessionId: localSessionId,
        isRequesting: isRequesting,
      },
      '*',
    );
  }, [role, state, isRequesting, localSessionId]);

  return null;
}
