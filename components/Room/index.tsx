import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { usePathname } from 'next/navigation';
import { useControlsState } from '@/states/controlsState';
import { DailyAudio, useThrottledDailyEvent } from '@daily-co/daily-react';
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
  const { state } = useStage();
  const dailyAudioRef = useRef<DailyAudioHandle>(null);
  const [dailyAudiosState, setControlsState] = useControlsState();

  useEffect(() => {
    setRole(pathname.split('/').pop() || '');
  }, [pathname, setRole]);

  const setAudios = useCallback(() => {
    if (!dailyAudiosState) {
      return;
    }

    if (dailyAudioRef?.current) {
      setTimeout(() => {
        const audios = dailyAudioRef?.current?.getAllAudio() || [];
        console.log(audios);

        if (audios.length > 0) {
          audios.forEach((audio: HTMLAudioElement) => {
            audio.muted = dailyAudiosState.muted;
            console.log(audio.muted);
          });
        }

        setControlsState({
          ...dailyAudiosState,
          audios: dailyAudioRef?.current?.getAllAudio() || [],
        });
      });
    }
  }, [dailyAudiosState, setControlsState]);

  useThrottledDailyEvent(
    ['active-speaker-change', 'track-started', 'participant-left'],
    useCallback(
      (evts) => {
        evts.forEach((ev) => {
          console.log(ev);
          switch (ev.action) {
            case 'active-speaker-change':
            case 'track-started':
            case 'participant-left':
              setAudios();
              break;
          }
        });
      },
      [setAudios],
    ),
    200,
  );

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
          {role === 'viewer' && dailyAudioRef?.current ? (
            <Controls dailyAudioRef={dailyAudioRef.current} />
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
