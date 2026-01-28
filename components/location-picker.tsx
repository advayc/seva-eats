import { Radii, Spacing } from '@/constants/theme';
import { useThemeColors } from '@/hooks/use-theme-colors';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

interface LocationPickerProps {
  address: string;
  onAddressChange: (address: string) => void;
  onLocationChange?: (lat: number, lon: number) => void;
  initialLatitude?: number;
  initialLongitude?: number;
  placeholder?: string;
  currentAddress?: string;
  currentLat?: number;
  currentLon?: number;
}

export function LocationPicker({
  address,
  onAddressChange,
  onLocationChange,
  initialLatitude = 43.7315,
  initialLongitude = -79.7624,
  placeholder = 'Enter a shelter or partner address',
  currentAddress,
  currentLat,
  currentLon,
}: LocationPickerProps) {
  const colors = useThemeColors();

  const handleQuickAddLocation = () => {
    if (currentAddress) {
      onAddressChange(currentAddress);
      onLocationChange?.(currentLat ?? 43.7315, currentLon ?? -79.7624);
    }
  };

  return (
    <View>
      {/* Address Input */}
      <View style={[styles.addressInputRow, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <MaterialIcons name="location-on" size={20} color={colors.accent} />
        <TextInput
          style={[styles.addressInput, { color: colors.text }]}
          placeholder={placeholder}
          value={address}
          onChangeText={onAddressChange}
          multiline
          placeholderTextColor={colors.mutedText}
        />
      </View>

      {/* Quick Add Current Location Button */}
      {currentAddress && (
        <Pressable
          style={[styles.quickAddButton, { backgroundColor: colors.isDark ? 'rgba(249, 115, 22, 0.1)' : '#FFF7ED', borderColor: colors.accent }]}
          onPress={handleQuickAddLocation}
        >
          <MaterialIcons name="my-location" size={18} color={colors.accent} />
          <Text style={[styles.quickAddText, { color: colors.accent }]}>Quick add current location</Text>
        </Pressable>
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
  quickAddButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginTop: Spacing.md,
    borderWidth: 1,
    borderRadius: Radii.md,
  },
  quickAddText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
