import React from 'react';
import { DailyAudio } from '@daily-co/daily-react';

import { Tray } from '@/components/Call/Tray';
import { Layout } from '@/components/Call/Tray/Layout';
import { Listeners } from '@/components/Room/Listeners';
import { Modals } from '@/components/Room/Modals';
import { Sidebar } from '@/components/Room/Sidebar';
import { Stage } from '@/components/Room/Stage';
import { VcsPreview } from '@/components/Vcs/VcsPreview';

export function Room() {
  return (
    <div className="flex-1">
      <div className="flex h-full">
        <div className="relative flex w-full flex-1 flex-col md:w-[calc(100%-400px)]">
          <VcsPreview />
          <Layout />
          <Stage />
          <Tray />
        </div>
        <Sidebar />
      </div>
      <Modals />
      <DailyAudio />
      <Listeners />
    </div>
  );
}
