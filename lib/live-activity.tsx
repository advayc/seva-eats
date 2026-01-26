import type { ReactNode } from 'react';
import { Platform } from 'react-native';
import Constants, { ExecutionEnvironment } from 'expo-constants';
import { NativeModulesProxy } from 'expo-modules-core';

import { REQUEST_STATUS_LABELS, type MealRequest } from '@/context/RequestContext';

let HStack: any;
let Image: any;
let Spacer: any;
let Text: any;
let VStack: any;
let padding: any;

try {
  const expoUI = require('@expo/ui/swift-ui');
  HStack = expoUI.HStack;
  Image = expoUI.Image;
  Spacer = expoUI.Spacer;
  Text = expoUI.Text;
  VStack = expoUI.VStack;
  const modifiers = require('@expo/ui/swift-ui/modifiers');
  padding = modifiers.padding;
} catch {
  // @expo/ui not available
}

type SFSymbol = string;

export const LIVE_ACTIVITY_NAME = 'SevaMealActivity';

export type MealActivityData = {
  status: MealRequest['status'];
  statusLabel: string;
  shortStatus: string;
  subtitle: string;
  etaMinutes: number | null;
  etaLabel: string;
  etaValue: string;
  etaUnit: string;
  icon: SFSymbol;
  volunteerName?: string;
  gurdwaraName?: string;
};

const STATUS_ICONS: Record<MealRequest['status'], SFSymbol> = {
  pending: 'clock.fill' as SFSymbol,
  matched: 'person.fill' as SFSymbol,
  picked_up: 'bag.fill' as SFSymbol,
  on_the_way: 'car.fill' as SFSymbol,
  delivered: 'checkmark.circle.fill' as SFSymbol,
  cancelled: 'xmark.circle.fill' as SFSymbol,
};

const SHORT_STATUS: Record<MealRequest['status'], string> = {
  pending: 'Finding',
  matched: 'Matched',
  picked_up: 'Picked up',
  on_the_way: 'On the way',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

export function buildMealActivityData(request: MealRequest): MealActivityData {
  const now = Date.now();
  const etaMinutes = request.estimatedDelivery
    ? Math.max(1, Math.round((request.estimatedDelivery.getTime() - now) / 60000))
    : null;

  const etaLabel = etaMinutes ? `${etaMinutes}m` : '--';

  const subtitle = request.status === 'pending'
    ? 'Finding a volunteer near you'
    : request.volunteerName
      ? `${request.volunteerName} is handling your request`
      : 'Tracking your meal request';

  return {
    status: request.status,
    statusLabel: REQUEST_STATUS_LABELS[request.status],
    shortStatus: SHORT_STATUS[request.status],
    subtitle,
    etaMinutes,
    etaLabel,
    etaValue: etaMinutes ? `${etaMinutes}` : '--',
    etaUnit: etaMinutes ? 'min' : 'eta',
    icon: STATUS_ICONS[request.status],
    volunteerName: request.volunteerName,
    gurdwaraName: request.gurdwaraName,
  };
}

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

export function createMealLiveActivity(data: MealActivityData): LiveActivityComponent {
  return () => ({
    banner: (
      <VStack modifiers={[padding({ all: 12 })]}>
        <Text weight="bold" size={16}>{`Seva Eats`}</Text>
        <Text weight="semibold" size={14}>{`${data.statusLabel}`}</Text>
        <Text size={12} color="#6B7280">{`${data.subtitle}`}</Text>
      </VStack>
    ),
    compactLeading: <Image systemName={data.icon} color="#F97316" />,
    compactTrailing: <Text weight="bold" size={12}>{`${data.etaLabel}`}</Text>,
    minimal: <Image systemName={data.icon} color="#F97316" />,
    expandedLeading: (
      <VStack modifiers={[padding({ all: 10 })]}>
        <Image systemName={data.icon} color="#F97316" />
        <Text size={12}>{`${data.shortStatus}`}</Text>
      </VStack>
    ),
    expandedCenter: (
      <VStack modifiers={[padding({ all: 10 })]}>
        <Text weight="bold" size={14}>{`${data.statusLabel}`}</Text>
        <Text size={12} color="#6B7280">{`${data.subtitle}`}</Text>
      </VStack>
    ),
    expandedTrailing: (
      <VStack modifiers={[padding({ all: 10 })]}>
        <Text weight="bold" size={20}>{`${data.etaValue}`}</Text>
        <Text size={12}>{`${data.etaUnit}`}</Text>
      </VStack>
    ),
    expandedBottom: (
      <VStack modifiers={[padding({ all: 10 })]}>
        <HStack>
          <Image systemName={'mappin.circle.fill' as SFSymbol} color="#10B981" />
          <Text size={12}>{`${data.gurdwaraName ?? 'Nearest Gurdwara'}`}</Text>
          <Spacer />
        </HStack>
        {data.volunteerName ? (
          <Text size={12}>{`Volunteer: ${data.volunteerName}`}</Text>
        ) : null}
      </VStack>
    ),
  });
}

type ExpoWidgetsModule = {
  startLiveActivity?: (name: string, component: LiveActivityComponent, url?: string) => string;
  updateLiveActivity?: (id: string, name: string, component: LiveActivityComponent) => void;
};

function hasExpoWidgetsNativeModule(): boolean {
  if (Platform.OS !== 'ios') return false;
  if (Constants.executionEnvironment === ExecutionEnvironment.StoreClient) return false;
  return !!NativeModulesProxy?.ExpoWidgets;
}

function getExpoWidgetsModule(): ExpoWidgetsModule | null {
  if (!hasExpoWidgetsNativeModule()) return null;
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require('expo-widgets') as ExpoWidgetsModule;
  } catch {
    return null;
  }
}

export function startMealLiveActivity(request: MealRequest): string | null {
  const module = getExpoWidgetsModule();
  if (!module?.startLiveActivity) return null;
  const data = buildMealActivityData(request);
  const activity = createMealLiveActivity(data);
  const deepLink = `seveats://request/${request.id}`;
  return module.startLiveActivity(LIVE_ACTIVITY_NAME, activity, deepLink);
}

export function updateMealLiveActivity(request: MealRequest, activityId?: string | null): void {
  if (!activityId) return;
  const module = getExpoWidgetsModule();
  if (!module?.updateLiveActivity) return;
  const data = buildMealActivityData(request);
  const activity = createMealLiveActivity(data);
  module.updateLiveActivity(activityId, LIVE_ACTIVITY_NAME, activity);
}
