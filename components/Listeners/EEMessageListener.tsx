import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { ETokenType, useEEApi } from '@/states/eeApiState';
import { useMeetingState } from '@daily-co/daily-react';
import { useStage } from '@/hooks/useStage';

export function EEMessageListener() {
  const [, setEEApi] = useEEApi();
  const meetingState = useMeetingState();
  const pathname = usePathname();
  const { state, isRequesting, requestToJoin, cancelRequestToJoin } = useStage();
  const role = pathname.split('/').pop();

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
          switch(event.data.action) {
            case 'cancelRequestToJoin':
              cancelRequestToJoin();
              break;
            case 'requestToJoin':
              requestToJoin();
              break;
          }
        }
      },
      false,
    );
  }, [setEEApi, cancelRequestToJoin, requestToJoin]);

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
  }, [meetingState]);

  useEffect(() => {

    if (role !== 'viewer') {
      return;
    }

    window.parent.postMessage(
      {
        state: state,
        isRequesting: isRequesting,
      },
      '*',
    );
  }, [state, isRequesting]);

  return null;
}
