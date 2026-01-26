import * as Location from 'expo-location';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import type { DeliveryLocation } from './types';

type LocationContextType = {
  userLocation: DeliveryLocation | null;
  permissionStatus: Location.PermissionStatus | null;
  isLoading: boolean;
  refreshLocation: () => Promise<void>;
};

const LocationContext = createContext<LocationContextType | null>(null);

export function LocationProvider({ children }: { children: ReactNode }) {
  const [userLocation, setUserLocation] = useState<DeliveryLocation | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<Location.PermissionStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const resolveAddress = useCallback(async (coords: Location.LocationObjectCoords) => {
    try {
      const [place] = await Location.reverseGeocodeAsync({
        latitude: coords.latitude,
        longitude: coords.longitude,
      });
      if (!place) return 'Current location';
      const parts = [place.name, place.city, place.region].filter(Boolean);
      return parts.join(', ') || 'Current location';
    } catch {
      return 'Current location';
    }
  }, []);

  const refreshLocation = useCallback(async () => {
    setIsLoading(true);
    const { status } = await Location.requestForegroundPermissionsAsync();
    setPermissionStatus(status);

    if (status !== 'granted') {
      setUserLocation(null);
      setIsLoading(false);
      return;
    }

    const current = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
    const address = await resolveAddress(current.coords);

    setUserLocation({
      latitude: current.coords.latitude,
      longitude: current.coords.longitude,
      address,
    });
    setIsLoading(false);
  }, [resolveAddress]);

  useEffect(() => {
    refreshLocation();
  }, [refreshLocation]);

  const value = useMemo(
    () => ({
      userLocation,
      permissionStatus,
      isLoading,
      refreshLocation,
    }),
    [userLocation, permissionStatus, isLoading, refreshLocation]
  );

  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>;
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
}
