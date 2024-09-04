import { useCallback, useState } from 'react';
import { Button } from '@/ui/Button';
import { Icons } from '@/ui/Icons';
import { DailyAudioHandle } from '@daily-co/daily-react/dist/components/DailyAudio';

export function MuteButton({
  dailyAudioRef,
}: {
  dailyAudioRef: DailyAudioHandle;
}) {
  const [muted, setMuted] = useState<boolean>(false);

  const handleOnClick = useCallback(() => {
    const isMuted = !muted;
    dailyAudioRef?.getAllAudio().forEach((audio: HTMLAudioElement) => {
      audio.muted = isMuted;
    });
    setMuted(isMuted);
  }, [muted, setMuted, dailyAudioRef]);

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="w-9 px-0"
        onClick={handleOnClick}
      >
        {muted ? <Icons.volume2 /> : <Icons.volumeX />}
      </Button>
    </>
  );
}
