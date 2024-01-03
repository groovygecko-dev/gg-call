import { ETokenType, useEEApi } from '@/states/eeApiState';
import { useMeetingState } from '@daily-co/daily-react';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export function EEMessageListener() {

  const [, setEEApi] = useEEApi();
  const meetingState = useMeetingState();
  const pathname = usePathname();

  useEffect(() => {

    window.addEventListener(
      "message",
      (event) => {

        if (event.origin === process.env.NEXT_PUBLIC_BASE_URL) {
          return;
        }

        if (event.data.eeToken && event.data.basePath) {
          setEEApi({
            token: event.data.eeToken,
            basePath: event.data.basePath,
            type: ETokenType.EE,
            tokenSet: true
          });
        }
      },
      false,
    );
    
  }, [setEEApi]);

  useEffect(() => {

    const role = pathname.split('/').pop();

    if (role === 'viewer') {
      window.postMessage(
        {
          meetingState: meetingState,
        },
        '*'
      );
    }

  }, [pathname, meetingState]);

  return null;
}
