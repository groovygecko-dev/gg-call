'use client';

import React, { useEffect, useState } from 'react';
import { useParams, usePathname, useSearchParams } from 'next/navigation';
import DailyIframe, { DailyCall } from '@daily-co/daily-js';
import { DailyProvider } from '@daily-co/daily-react';

import { Loader } from '@/components/Loader';
import { useEEApi, ETokenType } from '@/states/eeApiState';
import { resolve } from 'path';

interface DailyClientProps {
  roomName: string;
  token?: string;
  requiresToken?: boolean;
}

interface EEJoinDataResponse {
  url: string;
  token: string;
  config?: {
    bandwidth?: {
      kbs?: number,
      trackConstraints?: {
        width?: number,
        height?: number,
        frameRate?: number,
      },
    }
  };
}

export function DailyClientProvider({
  roomName,
  children,
  token = '',
  requiresToken = false,
}: React.PropsWithChildren<DailyClientProps>) {
  const pathname = usePathname();
  const params = useSearchParams();

  const [callObject, setCallObject] = useState<DailyCall | null>(null);
  const [eeApi, setEEApi] = useEEApi();

  useEffect(() => {

    const apiToken = params.get('eeToken') || (params.get('t') || '');
    const role = pathname.split('/').pop();

    if (apiToken !== '') {
      if (!eeApi.tokenSet) {
        setEEApi({
          token: apiToken,
          basePath: params.get('basePath') || '',
          type: role === 'presenter' ? ETokenType.DAILY : ETokenType.EE,
          tokenSet: true
        });
      }
    } else {
      // TODO: do some fix for no token.
    }

    const handleCreateCallObject = async () => {

      if (callObject || !roomName || !eeApi || !eeApi.tokenSet) return;

      let joinDataPromise: Promise<EEJoinDataResponse>;

      if (role === 'presenter') {
        joinDataPromise = new Promise((resolve) => {
          resolve({
            token: eeApi.token,
            url: `https://${process.env.NEXT_PUBLIC_DAILY_DOMAIN}.daily.co/${roomName}`
          })
        });
      } else {
        joinDataPromise = new Promise((resolve, react) => {
          fetch(`${eeApi.basePath}join-data`, {
            headers: new Headers({
              [eeApi.type === ETokenType.EE ? 'Authorization' : 'test']: eeApi.type === ETokenType.EE ? `Bearer ${eeApi.token}` : eeApi.token,
              'Content-Type': 'application/json',
            })
          }).then((joinDataResponse: Response) => {
            if (!joinDataResponse.ok) {
              react();
            }

            joinDataResponse.json().then((dataResponse: EEJoinDataResponse) => {
              resolve(dataResponse);
            })
          });
        });
      }

      const joinData = await joinDataPromise;
      const url = joinData.url;
      token = joinData.token;

      let newCallObject: DailyCall | null = null;
      try {
        newCallObject = DailyIframe.createCallObject({
          url,
          token,
          strictMode: true,
          sendSettings: {
            video: role === 'producer' ? 'quality-optimized' : 'default-video',
          },
          dailyConfig: {
            useDevicePreferenceCookies: true,
          },
          subscribeToTracksAutomatically: false,
        });
      } catch {
        newCallObject = DailyIframe.getCallInstance();
      }
      setCallObject(newCallObject);
      // attach callObject to window
      (window as any)['callObject'] = newCallObject;
      await newCallObject.preAuth({ url, token });

      if (['viewer', 'producer'].includes(role || '')) {
        const userData: any = {};
        if (role === 'producer') {
          userData['acceptedToJoin'] = true;
        }

        await newCallObject.join({
          userData: userData
        });
      }
    };

    handleCreateCallObject();
  }, [callObject, requiresToken, roomName, pathname, setEEApi, eeApi, params]);

  if (!callObject) return <Loader />;

  return <DailyProvider callObject={callObject}>{children}</DailyProvider>;
}
