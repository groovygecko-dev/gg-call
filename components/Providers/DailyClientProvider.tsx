'use client';

import React, { useEffect, useState } from 'react';
import { useParams, usePathname, useSearchParams } from 'next/navigation';
import DailyIframe, { DailyCall } from '@daily-co/daily-js';
import { DailyProvider } from '@daily-co/daily-react';

import { Loader } from '@/components/Loader';
import { useEEApi } from '@/states/eeApiState';

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

    if (!eeApi || eeApi.token === '') {
      setEEApi({
        token: params.get('eeToken') || '',
        basePath: params.get('basePath') || '',
      });
    }

    const handleCreateCallObject = async () => {

      if (callObject || !roomName || !eeApi || !eeApi.token || !eeApi.basePath) return;
      
      const role = pathname.split('/').pop();

      const joinDataResponse = await fetch(`${eeApi.basePath}join-data`, {
        headers: new Headers({
          'Authorization': `Bearer ${eeApi.token}`,
          'Content-Type': 'application/json'
        })
      });

      const joinData: EEJoinDataResponse = await joinDataResponse.json();
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

      if (role === 'viewer') {
        await newCallObject.join();
      }
    };

    handleCreateCallObject();
  }, [callObject, requiresToken, roomName, pathname, eeApi, params]);

  if (!callObject) return <Loader />;

  return <DailyProvider callObject={callObject}>{children}</DailyProvider>;
}
