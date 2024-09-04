import { useCallback, useState } from 'react';
import { useControlsState } from '@/states/controlsState';
import { Button } from '@/ui/Button';
import { Icons } from '@/ui/Icons';
import { DailyAudioHandle } from '@daily-co/daily-react/dist/components/DailyAudio';

export function MuteButton({
  dailyAudioRef,
}: {
  dailyAudioRef: DailyAudioHandle;
}) {
  const [controlsState, setControlsState] = useControlsState();

  const handleOnClick = useCallback(() => {
    if (!controlsState) return;

    const isMuted = !controlsState.muted;
    setControlsState({
      ...controlsState,
      muted: isMuted,
    });
  }, [controlsState, setControlsState]);

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="w-9 px-0"
        onClick={handleOnClick}
      >
        {controlsState.muted ? <Icons.volume2 /> : <Icons.volumeX />}
      </Button>
    </>
  );
}
