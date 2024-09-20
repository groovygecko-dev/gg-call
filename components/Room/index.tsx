import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { usePathname } from 'next/navigation';
import { DailyAudio } from '@daily-co/daily-react';
import { DailyAudioHandle } from '@daily-co/daily-react/dist/components/DailyAudio';

import { useStage } from '@/hooks/useStage';
import { Modals } from '@/components/Room/Modals';
import { Sidebar } from '@/components/Room/Sidebar';
import { Stage } from '@/components/Room/Stage';
import { Tray } from '@/components/Room/Tray';
import { LayoutSwitchMenu } from '@/components/Room/Tray/LayoutSwitchMenu';
import { VcsPreview } from '@/components/Room/Vcs';

import { Controls } from './Controls';

export function Room() {
  const pathname = usePathname();
  const [role, setRole] = useState<string>('');
  const [isVisible, setVisible] = useState<boolean>(false);
  const { state } = useStage();
  const dailyAudioRef = useRef<DailyAudioHandle>(null);
  

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

  const hasControls = useMemo(() => {
    return role === 'viewer' && !['on-stage', 'back-stage'].includes(state);
  }, [state, role]);

  const onVisibleChange = useCallback(
    (visible: boolean) => {
      setVisible(visible);
    },
    [setVisible],
  );

  return (
    <div className="flex-1">
      <div className="flex h-full">
        <div
          onMouseOver={() => onVisibleChange(true)}
          onMouseOut={() => onVisibleChange(false)}
          onMouseLeave={() => onVisibleChange(false)}
          className="relative flex w-full flex-1 flex-col md:w-[calc(100%-400px)]"
        >
          <VcsPreview />
          {hasControls && dailyAudioRef?.current ? (
            <Controls
              dailyAudioHandle={dailyAudioRef.current}
              isVisible={isVisible}
            />
          ) : (
            ''
          )}
          {role !== 'viewer' ? <LayoutSwitchMenu /> : ''}
          {role === 'producer' ? <Stage /> : ''}
          {hasTray ? <Tray /> : ''}
        </div>
        {role !== 'viewer' ? <Sidebar /> : ''}
      </div>
      <Modals />
      <DailyAudio autoSubscribeActiveSpeaker ref={dailyAudioRef} />
    </div>
  );
}
