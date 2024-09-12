import { useCallback, useMemo } from 'react';
import { useControlsState } from '@/states/controlsState';
import { Slider } from '@/ui/Slider';

export function VolumeSlider() {
  const [controlsState, setControlsState] = useControlsState();

  const volume: number = useMemo(() => {
    return controlsState.volume;
  }, [controlsState]);

  const disabled: boolean = useMemo(() => {
    return controlsState.muted;
  }, [controlsState]);

  const handleChange = useCallback(
    (value: number[]) => {
      if (!controlsState) return;

      setControlsState({
        ...controlsState,
        volume: value[0],
      });
    },
    [controlsState, setControlsState],
  );

  return (
    <>
      <Slider
        disabled={disabled}
        min={0}
        max={1}
        step={0.1}
        value={[volume]}
        className={`w-72 ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
        onValueChange={handleChange}
      ></Slider>
      <span className="w-10">{disabled ? 0 : volume * 100}</span>
    </>
  );
}
