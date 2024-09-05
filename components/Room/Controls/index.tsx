import dynamic from 'next/dynamic';

const MuteButton = dynamic(() =>
  import('@/components/Room/Controls/MuteButton').then((mod) => mod.MuteButton),
);

export function Controls() {
  return (
    <>
      <MuteButton />
    </>
  );
}
