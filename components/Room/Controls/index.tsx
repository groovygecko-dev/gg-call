import { useControlsState } from '@/states/controlsState';
import { useThrottledDailyEvent } from '@daily-co/daily-react';
import { DailyAudioHandle } from '@daily-co/daily-react/dist/components/DailyAudio';
import dynamic from 'next/dynamic';
import { useCallback, useEffect } from 'react';

const MuteButton = dynamic(() =>
  import('@/components/Room/Controls/MuteButton').then((mod) => mod.MuteButton),
);

export function Controls({
  dailyAudioHandle,
}: {
  dailyAudioHandle: DailyAudioHandle;
}) {

  const [dailyAudiosState, setControlsState] = useControlsState();

  useEffect(() => {
    if (dailyAudiosState.audios.length > 0) {
      dailyAudiosState.audios.forEach((audio: HTMLAudioElement) => {
        audio.muted = dailyAudiosState.muted;
        if (!dailyAudiosState.muted) {
          audio.volume = dailyAudiosState.volume;
        }
      });
    }
  }, [dailyAudiosState]);

  const setAudios = useCallback(() => {
    if (!dailyAudiosState) {
      return;
    }

    if (dailyAudioHandle) {
      setTimeout(() => {
        setControlsState({
          ...dailyAudiosState,
          audios: dailyAudioHandle.getAllAudio() || [],
        });
      });
    }
  }, [dailyAudiosState, setControlsState]);

  useThrottledDailyEvent(
    ['active-speaker-change', 'track-started', 'participant-left'],
    useCallback(
      () => {
        setAudios();
      },
      [setAudios],
    ),
    200,
  );

  return (
    <>
      <MuteButton />
    </>
  );
}
