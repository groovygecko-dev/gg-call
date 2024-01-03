import React, { useCallback, useEffect, useState } from 'react';
import { Card } from '@/ui/Card';
import {
  useDaily,
  useLocalSessionId,
  usePermissions,
} from '@daily-co/daily-react';

import { Loader } from '@/components/Loader';
import { Setup } from '@/components/Room/Haircheck/Setup';

export function Haircheck() {
  const [state, setState] = useState<'name-setup' | 'haircheck'>('name-setup');
  const localSessionId = useLocalSessionId();
  const { hasPresence } = usePermissions();
  const daily = useDaily();

  useEffect(() => {

    if (!daily) return;

    if (hasPresence) setState('haircheck');

  }, [daily, hasPresence]);

  if (!localSessionId) return <Loader showHeader={false} />;

  return (
    <div className="flex h-full w-full flex-1 items-center justify-center p-4 sm:p-0">
      <Card className="w-full sm:w-[70dvw] md:w-[50dvw] lg:w-[45dvw] xl:w-[30dvw] 2xl:w-[25dvw]">
        {state === 'haircheck' ? <Setup /> : ''}
      </Card>
    </div>
  );
}
