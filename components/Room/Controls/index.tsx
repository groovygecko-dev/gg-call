import { useCallback, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useControlsState } from '@/states/controlsState';
import { useThrottledDailyEvent } from '@daily-co/daily-react';
import { DailyAudioHandle } from '@daily-co/daily-react/dist/components/DailyAudio';

const MuteButton = dynamic(() =>
  import('@/components/Room/Controls/MuteButton').then((mod) => mod.MuteButton),
);

const VolumeSlider = dynamic(() =>
  import('@/components/Room/Controls/VolumeSlider').then(
    (mod) => mod.VolumeSlider,
  ),
);

export function Controls({
  dailyAudioHandle,
  isVisible = false,
}: {
  dailyAudioHandle: DailyAudioHandle;
  isVisible: boolean;
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
  }, [dailyAudiosState, dailyAudioHandle, setControlsState]);

  useThrottledDailyEvent(
    ['active-speaker-change', 'track-started', 'participant-left'],
    useCallback(() => {
      setAudios();
    }, [setAudios]),
    200,
  );

  return (
    <>
      {isVisible ? (
        <div className="fixed inset-x-0 bottom-0 w-full bg-white/[.80]">
          <div className="flex items-center justify-center space-x-5">
            <MuteButton />
            <VolumeSlider />
          </div>
        </div>
      ) : (
        ''
      )}
    </>
  );
}
