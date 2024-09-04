import dynamic from 'next/dynamic';
import { DailyAudioHandle } from '@daily-co/daily-react/dist/components/DailyAudio';

const MuteButton = dynamic(() =>
  import('@/components/Room/Controls/MuteButton').then((mod) => mod.MuteButton),
);

export function Controls({
  dailyAudioRef,
}: {
  dailyAudioRef: DailyAudioHandle;
}) {
  return (
    <>
      <MuteButton dailyAudioRef={dailyAudioRef} />
    </>
  );
}
