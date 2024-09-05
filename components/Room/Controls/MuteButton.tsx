import { useCallback } from 'react';
import { useControlsState } from '@/states/controlsState';
import { Button } from '@/ui/Button';
import { Icons } from '@/ui/Icons';

export function MuteButton() {
  const [controlsState, setControlsState] = useControlsState();

  const handleOnClick = useCallback(() => {
    if (!controlsState) return;

    setControlsState({
      ...controlsState,
      muted: !controlsState.muted,
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
        {controlsState.muted ? <Icons.volumeX /> : <Icons.volume2 />}
      </Button>
    </>
  );
}
