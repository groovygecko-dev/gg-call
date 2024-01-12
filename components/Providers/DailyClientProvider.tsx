'use client';

import React, { useEffect, useState } from 'react';
import { useParams, usePathname, useSearchParams } from 'next/navigation';
import { ETokenType, useEEApi } from '@/states/eeApiState';
import DailyIframe, { DailyCall } from '@daily-co/daily-js';
import { DailyProvider } from '@daily-co/daily-react';

import { Loader } from '@/components/Loader';

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
      kbs?: number;
      trackConstraints?: {
        width?: number;
        height?: number;
        frameRate?: number;
      };
    };
  };
}

export function DailyClientProvider({
  roomName,
  children,
}: React.PropsWithChildren<DailyClientProps>) {
  const pathname = usePathname();
  const params = useSearchParams();

  const [callObject, setCallObject] = useState<DailyCall | null>(null);
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
    } else {
      // TODO: do some fix for no token.
    }

    const handleCreateCallObject = async () => {
      if (callObject || !roomName || !eeApi || !eeApi.tokenSet) return;

      const joinDataPromise: Promise<EEJoinDataResponse> = new Promise(
        (resolve, reject) => {
          fetch(`${eeApi.basePath}join-data`, {
            headers: new Headers({
              [role === 'presenter' ? 'Daily-Auth-Token' : 'Authorization']:
                role === 'presenter' ? eeApi.token : `Bearer ${eeApi.token}`,
              'Content-Type': 'application/json',
            }),
          }).then((joinDataResponse: Response) => {
            if (!joinDataResponse.ok) {
              reject();
            }

            joinDataResponse.json().then((dataResponse: EEJoinDataResponse) => {
              resolve(dataResponse);
            });
          });
        },
      );

      const joinData = await joinDataPromise;
      const url = joinData.url;
      const token = joinData.token;

      let newCallObject: DailyCall | null = null;

      try {
        newCallObject = DailyIframe.createCallObject({
          url,
          token,
          strictMode: true,
          sendSettings: {
            video: ['producer', 'presenter'].includes(role || '')
              ? 'quality-optimized'
              : 'default-video',
          },
          dailyConfig: {
            useDevicePreferenceCookies: true,
            userMediaVideoConstraints:
              joinData.config?.bandwidth?.trackConstraints,
          },
          subscribeToTracksAutomatically: false,
        });

        await newCallObject.updateReceiveSettings({
          base: { video: { layer: 3 } },
        });
      } catch {
        newCallObject = DailyIframe.getCallInstance();
      }
      setCallObject(newCallObject);
      // attach callObject to window
      (window as any)['callObject'] = newCallObject;
      await newCallObject.preAuth({ url, token });

      switch (role) {
        case 'viewer':
          await newCallObject.join({});

          newCallObject.loadCss({
            bodyClass: 'h-full font-sans antialiased viewer-layout',
            cssText:
              '.viewer-layout, .viewer-layout .LiveFeed {background-color: transparent}',
          });

          break;

        case 'producer':
          await newCallObject.join({
            userData: {
              acceptedToJoin: true,
            },
          });

          if (joinData?.config?.bandwidth) {
            newCallObject.setBandwidth(joinData.config.bandwidth);
          }

          break;
      }
    };

    handleCreateCallObject();
  }, [callObject, roomName, pathname, setEEApi, eeApi, params]);

  if (!callObject) return <Loader />;

  return <DailyProvider callObject={callObject}>{children}</DailyProvider>;
}
