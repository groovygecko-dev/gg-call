'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { config } from '@/config';

const CallHeader = dynamic(() =>
  import('@/components/Header/CallHeader').then((mod) => mod.CallHeader),
);
// const GithubLink = dynamic(() =>
//   import('@/components/Header/GithubLink').then((mod) => mod.GithubLink),
// );

export function Header({ inCall = true }: { inCall?: boolean }) {
  return (
    <header className="min-h-16 sticky top-0 z-40 h-16 max-h-16 w-full border-b bg-background px-4">
      <div className="mx-2 flex h-full items-center justify-between">
        <Link href="/" target="_blank">
          <div className="flex items-center justify-center gap-x-1">
            {/* <Image src="/slash.png" alt="Daily's Logo" height={30} width={30} /> */}
            {/* <span className="inline-block font-bold">{config.name}</span> */}
          </div>
        </Link>
        {inCall ? <CallHeader /> : ''}
      </div>
    </header>
  );
}
