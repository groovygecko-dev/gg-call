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
    <div className="col-span-7">
      <div className="grid grid-cols-4 gap-2">
        <label className="">{volume * 100}</label>
        <Slider
          disabled={disabled}
          min={0}
          max={1}
          step={0.1}
          value={[volume]}
          className="w-full px-0 disabled:bg-slate-50"
          onValueChange={handleChange}
        ></Slider>
      </div>
    </div>
  );
}
