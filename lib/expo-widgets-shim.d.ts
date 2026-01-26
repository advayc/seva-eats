declare module 'expo-widgets' {
  import type { ReactNode } from 'react';

  export type LiveActivityComponent = () => {
    banner?: ReactNode;
    bannerSmall?: ReactNode;
    compactLeading?: ReactNode;
    compactTrailing?: ReactNode;
    minimal?: ReactNode;
    expandedLeading?: ReactNode;
    expandedCenter?: ReactNode;
    expandedTrailing?: ReactNode;
    expandedBottom?: ReactNode;
  };

  export function startLiveActivity(
    name: string,
    liveActivity: LiveActivityComponent,
    url?: string
  ): string;

  export function updateLiveActivity(
    id: string,
    name: string,
    liveActivity: LiveActivityComponent
  ): void;
}
