import React from 'react';

import { Call } from '@/components/Call';
import { Loader } from '@/components/Loader';
import { DailyClientProvider } from '@/components/Room/DailyClientProvider';

async function generateToken(roomName: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/daily/token`,
    {
      method: 'POST',
      body: JSON.stringify({
        roomName,
        isOwner: true,
      }),
    }
  );
  const { token } = await res.json();
  return token;
}

export default async function ProducerPage({
  params: { name },
}: {
  params: { name: string };
}) {
  const token = await generateToken(name);

  if (!token) return <Loader showHeader={false} />;

  return (
    <DailyClientProvider roomName={name} token={token} requiresToken>
      <Call />
    </DailyClientProvider>
  );
}
