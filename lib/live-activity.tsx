import type { ReactNode } from 'react';
import { Platform } from 'react-native';
import Constants, { ExecutionEnvironment } from 'expo-constants';
import { NativeModulesProxy } from 'expo-modules-core';

import { REQUEST_STATUS_LABELS, type MealRequest } from '@/context/RequestContext';

// Debug logging utility
const DEBUG = __DEV__;
function debugLog(message: string, data?: any) {
  if (DEBUG) {
    console.log(`[LiveActivity] ${message}`, data !== undefined ? data : '');
  }
}

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
  debugLog('Successfully loaded @expo/ui/swift-ui components');
} catch (error) {
  debugLog('Failed to load @expo/ui/swift-ui', error);
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
    : request.showVolunteerName && request.volunteerName
      ? `${request.volunteerName} is handling your request`
      : 'Tracking your meal request';

  const data = {
    status: request.status,
    statusLabel: REQUEST_STATUS_LABELS[request.status],
    shortStatus: SHORT_STATUS[request.status],
    subtitle,
    etaMinutes,
    etaLabel,
    etaValue: etaMinutes ? `${etaMinutes}` : '--',
    etaUnit: etaMinutes ? 'min' : 'eta',
    icon: STATUS_ICONS[request.status],
    volunteerName: request.showVolunteerName ? request.volunteerName : undefined,
    gurdwaraName: request.gurdwaraName,
  };

  debugLog('Built activity data', { requestId: request.id, status: request.status, etaMinutes });
  return data;
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
  // Check if UI components are available
  if (!VStack || !HStack || !Text || !Image || !Spacer || !padding) {
    debugLog('UI components not available, returning empty activity');
    return () => ({});
  }

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
  endLiveActivity?: (id: string) => void;
};

function hasExpoWidgetsNativeModule(): boolean {
  debugLog('Checking for ExpoWidgets native module...');
  
  if (Platform.OS !== 'ios') {
    debugLog('Not iOS, Live Activities not available');
    return false;
  }
  
  if (Constants.executionEnvironment === ExecutionEnvironment.StoreClient) {
    debugLog('Running in Expo Go, Live Activities not available');
    return false;
  }
  
  const hasModule = !!NativeModulesProxy?.ExpoWidgets;
  debugLog('ExpoWidgets module available:', hasModule);
  
  if (!hasModule) {
    debugLog('NativeModulesProxy contents:', Object.keys(NativeModulesProxy || {}));
  }
  
  return hasModule;
}

function getExpoWidgetsModule(): ExpoWidgetsModule | null {
  if (!hasExpoWidgetsNativeModule()) {
    debugLog('No native module available');
    return null;
  }
  
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const module = require('expo-widgets') as ExpoWidgetsModule;
    debugLog('Successfully loaded expo-widgets module', {
      hasStartLiveActivity: !!module?.startLiveActivity,
      hasUpdateLiveActivity: !!module?.updateLiveActivity,
      hasEndLiveActivity: !!module?.endLiveActivity,
    });
    return module;
  } catch (error) {
    debugLog('Failed to load expo-widgets module', error);
    return null;
  }
}

export function startMealLiveActivity(request: MealRequest): string | null {
  debugLog('Starting Live Activity for request:', request.id);
  
  const module = getExpoWidgetsModule();
  if (!module?.startLiveActivity) {
    debugLog('startLiveActivity function not available');
    return null;
  }
  
  try {
    const data = buildMealActivityData(request);
    const activity = createMealLiveActivity(data);
    const deepLink = `seveats://request/${request.id}`;
    
    debugLog('Calling startLiveActivity with:', {
      name: LIVE_ACTIVITY_NAME,
      deepLink,
    });
    
    const activityId = module.startLiveActivity(LIVE_ACTIVITY_NAME, activity, deepLink);
    debugLog('Live Activity started successfully, ID:', activityId);
    return activityId;
  } catch (error) {
    debugLog('Error starting Live Activity:', error);
    return null;
  }
}

export function updateMealLiveActivity(request: MealRequest, activityId?: string | null): void {
  if (!activityId) {
    debugLog('No activity ID provided, skipping update');
    return;
  }
  
  debugLog('Updating Live Activity:', { activityId, requestId: request.id, status: request.status });
  
  const module = getExpoWidgetsModule();
  if (!module?.updateLiveActivity) {
    debugLog('updateLiveActivity function not available');
    return;
  }
  
  try {
    const data = buildMealActivityData(request);
    const activity = createMealLiveActivity(data);
    module.updateLiveActivity(activityId, LIVE_ACTIVITY_NAME, activity);
    debugLog('Live Activity updated successfully');
  } catch (error) {
    debugLog('Error updating Live Activity:', error);
  }
}

export function endMealLiveActivity(activityId?: string | null): void {
  if (!activityId) {
    debugLog('No activity ID provided, skipping end');
    return;
  }
  
  debugLog('Ending Live Activity:', activityId);
  
  const module = getExpoWidgetsModule();
  if (!module?.endLiveActivity) {
    debugLog('endLiveActivity function not available');
    return;
  }
  
  try {
    module.endLiveActivity(activityId);
    debugLog('Live Activity ended successfully');
  } catch (error) {
    debugLog('Error ending Live Activity:', error);
  }
}

// Diagnostic function to check Live Activity availability
export function getLiveActivityDiagnostics(): {
  isAvailable: boolean;
  platform: string;
  executionEnvironment: string;
  hasNativeModule: boolean;
  hasUIComponents: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (Platform.OS !== 'ios') {
    errors.push('Live Activities are only available on iOS');
  }
  
  if (Constants.executionEnvironment === ExecutionEnvironment.StoreClient) {
    errors.push('Live Activities are not available in Expo Go. Use a development build.');
  }
  
  const hasNativeModule = !!NativeModulesProxy?.ExpoWidgets;
  if (!hasNativeModule) {
    errors.push('ExpoWidgets native module not found. Make sure expo-widgets is installed and you have a development build.');
  }
  
  const hasUIComponents = !!(VStack && HStack && Text && Image && Spacer && padding);
  if (!hasUIComponents) {
    errors.push('@expo/ui/swift-ui components not available');
  }
  
  const diagnostics = {
    isAvailable: Platform.OS === 'ios' && 
      Constants.executionEnvironment !== ExecutionEnvironment.StoreClient && 
      hasNativeModule && 
      hasUIComponents,
    platform: Platform.OS,
    executionEnvironment: Constants.executionEnvironment ?? 'unknown',
    hasNativeModule,
    hasUIComponents,
    errors,
  };
  
  debugLog('Live Activity diagnostics:', diagnostics);
  return diagnostics;
}
