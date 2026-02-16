import { Radii, Spacing } from '@/constants/theme';
import { useThemeColors } from '@/hooks/use-theme-colors';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';
import { Alert, Image, Pressable, StyleSheet, Text, View } from 'react-native';

interface ProofOfDeliveryProps {
  onPhotoCapture: (photoUri: string) => void;
  initialPhoto?: string;
}

export function ProofOfDelivery({ onPhotoCapture, initialPhoto }: ProofOfDeliveryProps) {
  const colors = useThemeColors();
  const [photo, setPhoto] = useState<string | null>(initialPhoto ?? null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        console.log('Camera permission not granted');
      }
    })();
  }, []);

  const handleTakePhoto = async () => {
    try {
      setIsLoading(true);
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const photoUri = result.assets[0].uri;
        setPhoto(photoUri);
        onPhotoCapture(photoUri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to capture photo');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePickImage = async () => {
    try {
      setIsLoading(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const photoUri = result.assets[0].uri;
        setPhoto(photoUri);
        onPhotoCapture(photoUri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View>
      {photo ? (
        <View style={[styles.photoPreview, { borderColor: colors.border }]}>
          <Image source={{ uri: photo }} style={styles.previewImage} />
          <Pressable
            style={[styles.removeButton, { backgroundColor: colors.accent }]}
            onPress={() => setPhoto(null)}
          >
            <MaterialIcons name="close" size={18} color="#FFF8F0" />
          </Pressable>
          <Text style={[styles.photoStatus, { color: colors.accent }]}>Photo captured ✓</Text>
        </View>
      ) : (
        <View style={styles.buttonContainer}>
          <Pressable
            style={[styles.button, { backgroundColor: colors.accent }]}
            onPress={handleTakePhoto}
            disabled={isLoading}
          >
            <MaterialIcons name="photo-camera" size={20} color="#FFF8F0" />
            <Text style={styles.buttonText}>Take Photo</Text>
          </Pressable>

          <Pressable
            style={[styles.button, { backgroundColor: colors.isDark ? 'rgba(249, 115, 22, 0.2)' : '#FFF7ED', borderColor: colors.accent, borderWidth: 1 }]}
            onPress={handlePickImage}
            disabled={isLoading}
          >
            <MaterialIcons name="image" size={20} color={colors.accent} />
            <Text style={[styles.buttonText, { color: colors.accent }]}>Upload Photo</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    gap: Spacing.sm,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    borderRadius: Radii.md,
  },
  buttonText: {
    color: '#FFF8F0',
    fontSize: 15,
    fontWeight: '600',
  },
  photoPreview: {
    position: 'relative',
    borderWidth: 1,
    borderRadius: Radii.md,
    overflow: 'hidden',
    height: 250,
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  removeButton: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoStatus: {
    position: 'absolute',
    bottom: Spacing.sm,
    left: Spacing.sm,
    fontWeight: '600',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    color: '#FFF8F0',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: 4,
  },
});
