'use client';

import React, { useEffect, useState } from 'react';
import DailyIframe, { DailyCall } from '@daily-co/daily-js';
import { DailyProvider } from '@daily-co/daily-react';

import { Header } from '@/components/header';
import { Icons } from '@/components/icons';

export function DailyClientProvider({
  roomName,
  children,
  requiresToken = false,
}: React.PropsWithChildren<{
  roomName: string;
  requiresToken?: boolean;
}>) {
  const [callObject, setCallObject] = useState<DailyCall | null>(null);
  const [token, setToken] = useState('');

  useEffect(() => {
    if (!roomName || token || !requiresToken) return;

    const fetchToken = async () => {
      const res = await fetch(`/api/daily/token`, {
        method: 'POST',
        body: JSON.stringify({
          roomName,
          isOwner: true,
        }),
      });
      const { token } = await res.json();
      setToken(token);
    };
    fetchToken();
  }, [requiresToken, roomName, token]);

  useEffect(() => {
    if (callObject || !roomName || (requiresToken && !token)) return;

    const url = `https://${process.env.NEXT_PUBLIC_DAILY_DOMAIN}.daily.co/${roomName}`;
    let newCallObject: DailyCall | null = null;
    try {
      newCallObject = DailyIframe.createCallObject({
        url,
        token,
        strictMode: true,
        dailyConfig: {
          useDevicePreferenceCookies: true,
        },
      });
    } catch {
      newCallObject = DailyIframe.getCallInstance();
    }
    setCallObject(newCallObject);

    // attach callObject to window
    window['callObject'] = newCallObject;

    newCallObject.preAuth({ url, token });
  }, [callObject, requiresToken, roomName, token]);

  if (!callObject)
    return (
      <div className="flex h-full w-full flex-1 flex-col">
        <Header />
        <div className="flex h-full w-full flex-1 items-center justify-center bg-muted text-muted-foreground">
          <Icons.spinner className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );

  return <DailyProvider callObject={callObject}>{children}</DailyProvider>;
}
