import React from 'react';
import { config } from '@/config';
import { ButtonProps } from '@/ui/Button';

import { Header } from '@/components/Header';
import { PrivilegeCard } from '@/components/Room/Privilege/PrivilegeCard';

interface Privilege {
  heading: string;
  description: string;
  buttonText: string;
  buttonVariant: ButtonProps['variant'];
  privilege: 'producer' | 'presenter' | 'viewer';
}

const privilegeOptions: Privilege[] = [
  {
    heading: 'Producer',
    description:
      'Join call in new tab as a meeting owner. You can configure layouts and the stream settings.',
    buttonText: 'Join as producer',
    buttonVariant: 'default',
    privilege: 'producer',
  },
  {
    heading: 'Presenter',
    description:
      'Add an owner to the room prior to adding additional participants. Select this option to join from the perspective of a presenter.',
    buttonText: 'Join as presenter',
    buttonVariant: 'secondary',
    privilege: 'presenter',
  },
  {
    heading: 'Viewer',
    description:
      'Add an owner to the room prior to adding additional participants. Select this option to join from the perspective of a participant.',
    buttonText: 'Join as viewer',
    buttonVariant: 'outline',
    privilege: 'viewer',
  },
];

export default function RoomPage({
  params: { name },
}: {
  params: { name: string };
}) {
  return (
    <div className="flex h-full flex-col overflow-auto">
      <Header inCall={false} />
      <div className="flex flex-1 flex-col items-center justify-center gap-y-6">
        <h2 className="text-2xl font-bold leading-3">{config.name}</h2>
        <p className="text-center leading-7">{config.description}</p>
        <div className="mx-4 flex flex-col items-stretch justify-center gap-4 sm:mx-0 sm:flex-row"></div>
        <p className="text-center text-muted-foreground"></p>
      </div>
    </div>
  );
}
