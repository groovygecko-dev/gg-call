import React from 'react';

import { DailyClientProvider } from '@/components/Providers';
import { ViewLayout } from '@/components/ViewLayout';

export default async function ProducerPage({
  params: { name },
}: {
  params: { name: string };
}) {

  return (
    <DailyClientProvider roomName={name} requiresToken>
      <ViewLayout />
    </DailyClientProvider>
  );
}
