import React, { useEffect, useRef } from 'react';
import {
  DESKTOP_ASPECT_RATIO,
  MOBILE_ASPECT_RATIO,
} from '@/constants/aspectRatio';

import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useIsOwner } from '@/hooks/useIsOwner';
import { useVCS } from '@/hooks/useVCS';

export function VcsPreview() {
  const isOwner = useIsOwner();
  const isMobile = useIsMobile();
  const divRef = useRef<HTMLDivElement>(null);

  const { outputElementRef, vcsCompRef, width, height } = useVCS({
    viewportRef: divRef,
    aspectRatio: isMobile ? MOBILE_ASPECT_RATIO : DESKTOP_ASPECT_RATIO,
  });

  useEffect(() => {
    const vcsComp = vcsCompRef.current;
    return () => vcsComp?.stop();
  }, [vcsCompRef]);

  return (
    <div className="h-full w-full flex-1">
      <div
        ref={divRef}
        className={cn(
          'bg-muted flex w-full items-center justify-center',
          isOwner ? 'h-[calc(100dvh-24rem)]' : 'h-[calc(100dvh-9rem)]'
        )}
      >
        <div
          className="bg-black"
          ref={outputElementRef}
          style={{ width, height }}
        />
      </div>
    </div>
  );
}
