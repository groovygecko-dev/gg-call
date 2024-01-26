import React, { useEffect, useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';
import { DailyAudio } from '@daily-co/daily-react';

import { useStage } from '@/hooks/useStage';
import { Modals } from '@/components/Room/Modals';
import { Sidebar } from '@/components/Room/Sidebar';
import { Stage } from '@/components/Room/Stage';
import { Tray } from '@/components/Room/Tray';
import { LayoutSwitchMenu } from '@/components/Room/Tray/LayoutSwitchMenu';
import { VcsPreview } from '@/components/Room/Vcs';

export function Room() {
  const pathname = usePathname();
  const [role, setRole] = useState<string>('');
  const { state } = useStage();

  useEffect(() => {
    setRole(pathname.split('/').pop() || '');
  }, [pathname, setRole]);

  const hasTray = useMemo(() => {
    if (role === 'presenter') {
      return true;
    }

    if (role === 'viewer') {
      return ['on-stage', 'back-stage'].includes(state);
    }

    return true;
  }, [state, role]);

  return (
    <div className="flex-1">
      <div className="flex h-full">
        <div className="relative flex w-full flex-1 flex-col md:w-[calc(100%-400px)]">
          <VcsPreview />
          {role !== 'viewer' ? <LayoutSwitchMenu /> : ''}
          {role === 'producer' ? <Stage /> : ''}
          {hasTray ? <Tray /> : ''}
        </div>
        {role !== 'viewer' ? <Sidebar /> : ''}
      </div>
      <Modals />
      <DailyAudio autoSubscribeActiveSpeaker />
    </div>
  );
}
