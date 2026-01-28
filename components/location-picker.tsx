import { Radii, Spacing } from '@/constants/theme';
import { useThemeColors } from '@/hooks/use-theme-colors';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

interface LocationPickerProps {
  address: string;
  onAddressChange: (address: string) => void;
  onLocationChange?: (lat: number, lon: number) => void;
  initialLatitude?: number;
  initialLongitude?: number;
  placeholder?: string;
  currentAddress?: string;
}

export function LocationPicker({
  address,
  onAddressChange,
  onLocationChange,
  initialLatitude = 43.7315,
  initialLongitude = -79.7624,
  placeholder = 'Enter a shelter or partner address',
  currentAddress,
}: LocationPickerProps) {
  const colors = useThemeColors();
  const [showMap, setShowMap] = useState(false);
  const [markerLocation, setMarkerLocation] = useState({
    latitude: initialLatitude,
    longitude: initialLongitude,
  });

  const handleMapPress = (e: any) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setMarkerLocation({ latitude, longitude });
    onLocationChange?.(latitude, longitude);
  };

  return (
    <View>
      {/* Address Input */}
      <Pressable
        style={[styles.addressInputRow, { backgroundColor: colors.surface, borderColor: colors.border }]}
        onPress={() => setShowMap(!showMap)}
      >
        <MaterialIcons name="location-on" size={20} color={colors.accent} />
        <TextInput
          style={[styles.addressInput, { color: colors.text }]}
          placeholder={placeholder}
          value={address}
          onChangeText={onAddressChange}
          multiline
          placeholderTextColor={colors.mutedText}
          editable={!showMap}
        />
        <MaterialIcons name={showMap ? 'expand-less' : 'expand-more'} size={20} color={colors.mutedText} />
      </Pressable>

      {/* Use Current Location Button */}
      {currentAddress && address !== currentAddress && (
        <Pressable
          style={styles.useCurrentButton}
          onPress={() => onAddressChange(currentAddress)}
        >
          <MaterialIcons name="my-location" size={16} color={colors.accent} />
          <Text style={[styles.useCurrentText, { color: colors.accent }]}>Use current location</Text>
        </Pressable>
      )}

      {/* Map */}
      {showMap && (
        <View style={[styles.mapContainer, { borderColor: colors.border }]}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: markerLocation.latitude,
              longitude: markerLocation.longitude,
              latitudeDelta: 0.015,
              longitudeDelta: 0.0121,
            }}
            onPress={handleMapPress}
            customMapStyle={colors.isDark ? darkMapStyle : lightMapStyle}
          >
            <Marker
              coordinate={markerLocation}
              title="Delivery Location"
              description={address || 'Selected location'}
              pinColor={colors.accent}
            />
          </MapView>

          {/* Map Instructions */}
          <View style={[styles.mapInstructions, { backgroundColor: colors.surface }]}>
            <MaterialIcons name="info" size={16} color={colors.accent} />
            <Text style={[styles.instructionText, { color: colors.mutedText }]}>Tap on the map to pin your location</Text>
          </View>

          {/* Confirm Button */}
          <Pressable
            style={[styles.confirmButton, { backgroundColor: colors.accent }]}
            onPress={() => setShowMap(false)}
          >
            <Text style={styles.confirmButtonText}>Confirm Location</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const darkMapStyle = [
  {
    elementType: 'geometry',
    stylers: [
      {
        color: '#212121',
      },
    ],
  },
  {
    elementType: 'labels.icon',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#757575',
      },
    ],
  },
  {
    elementType: 'labels.text.stroke',
    stylers: [
      {
        color: '#212121',
      },
    ],
  },
  {
    featureType: 'administrative',
    elementType: 'geometry',
    stylers: [
      {
        color: '#757575',
      },
    ],
  },
  {
    featureType: 'administrative.country',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#9e9e9e',
      },
    ],
  },
  {
    featureType: 'administrative.land_parcel',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#bdbdbd',
      },
    ],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#757575',
      },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [
      {
        color: '#181818',
      },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#616161',
      },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.stroke',
    stylers: [
      {
        color: '#1d1d1d',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'geometry.fill',
    stylers: [
      {
        color: '#2c2c2c',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#8a8a8a',
      },
    ],
  },
  {
    featureType: 'road.arterial',
    elementType: 'geometry',
    stylers: [
      {
        color: '#373737',
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [
      {
        color: '#3c3c3c',
      },
    ],
  },
  {
    featureType: 'road.highway.controlled_access',
    elementType: 'geometry',
    stylers: [
      {
        color: '#4e4e4e',
      },
    ],
  },
  {
    featureType: 'road.local',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#616161',
      },
    ],
  },
  {
    featureType: 'transit',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#757575',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [
      {
        color: '#0c1735',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#3d3d3d',
      },
    ],
  },
];

const lightMapStyle = [
  {
    elementType: 'labels.icon',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
];

const styles = StyleSheet.create({
  addressInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    borderWidth: 1,
    borderRadius: Radii.md,
    gap: Spacing.sm,
    minHeight: 50,
  },
  addressInput: {
    flex: 1,
    fontSize: 15,
    paddingVertical: Spacing.sm,
    maxHeight: 100,
  },
  mapContainer: {
    marginTop: Spacing.md,
    borderWidth: 1,
    borderRadius: Radii.md,
    overflow: 'hidden',
    height: 300,
  },
  map: {
    flex: 1,
  },
  mapInstructions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  instructionText: {
    fontSize: 12,
    flex: 1,
  },
  confirmButton: {
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.md,
    paddingVertical: Spacing.md,
    borderRadius: Radii.md,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
