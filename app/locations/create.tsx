import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Camera, MapPin } from 'lucide-react-native';
import { locationsService } from '@/services/locationsService';
import { useForm, Controller } from 'react-hook-form';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { Image } from 'react-native';
import { Platform } from 'react-native';

type LocationFormData = {
  nombre: string;
  descripcion: string;
  tipo: string;
  observaciones: string;
};

export default function CreateLocationScreen() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  
  const { control, handleSubmit, formState: { errors } } = useForm<LocationFormData>({
    defaultValues: {
      nombre: '',
      descripcion: '',
      tipo: 'Punto de interés',
      observaciones: '',
    }
  });

  const requestCameraPermission = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso denegado', 'Se necesita permiso para acceder a la cámara');
        return false;
      }
      return true;
    }
    return true;
  };

  const requestLocationPermission = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso denegado', 'Se necesita permiso para acceder a la ubicación');
        return false;
      }
      return true;
    }
    return true;
  };

  const takePicture = async () => {
    const hasPermission = await requestCameraPermission();
    
    if (hasPermission) {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        setPhoto(result.assets[0].uri);
      }
    }
  };

  const getCurrentLocation = async () => {
    const hasPermission = await requestLocationPermission();
    
    if (hasPermission) {
      try {
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Highest,
        });
        
        setLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
        
        Alert.alert('Ubicación obtenida', 'La ubicación actual ha sido registrada');
      } catch (error) {
        Alert.alert('Error', 'No se pudo obtener la ubicación actual');
        console.error(error);
      }
    }
  };

  const onSubmit = async (data: LocationFormData) => {
    if (!location) {
      Alert.alert('Error', 'Debe registrar una ubicación GPS');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const locationData = {
        ...data,
        foto: photo || '',
        latitud: location.latitude,
        longitud: location.longitude,
      };
      
      await locationsService.createLocation(locationData);
      Alert.alert(
        'Éxito',
        'Ubicación registrada correctamente',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar el registro');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#1a3b72" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Registrar Ubicación</Text>
      </View>
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.formContainer}>
          <View style={styles.photoSection}>
            {photo ? (
              <Image source={{ uri: photo }} style={styles.photoPreview} />
            ) : (
              <View style={styles.photoPlaceholder}>
                <Camera size={40} color="#888" />
              </View>
            )}
            <TouchableOpacity style={styles.cameraButton} onPress={takePicture}>
              <Text style={styles.cameraButtonText}>Tomar Foto</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nombre *</Text>
            <Controller
              control={control}
              rules={{ required: 'Este campo es requerido' }}
              name="nombre"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={[styles.input, errors.nombre && styles.inputError]}
                  placeholder="Ingrese un nombre para la ubicación"
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
            {errors.nombre && <Text style={styles.errorText}>{errors.nombre.message}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Descripción *</Text>
            <Controller
              control={control}
              rules={{ required: 'Este campo es requerido' }}
              name="descripcion"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={[styles.input, errors.descripcion && styles.inputError, styles.textArea]}
                  placeholder="Ingrese una descripción detallada"
                  value={value}
                  onChangeText={onChange}
                  multiline
                  numberOfLines={4}
                />
              )}
            />
            {errors.descripcion && <Text style={styles.errorText}>{errors.descripcion.message}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tipo *</Text>
            <Controller
              control={control}
              rules={{ required: 'Este campo es requerido' }}
              name="tipo"
              render={({ field: { onChange, value } }) => (
                <View style={styles.radioGroup}>
                  <TouchableOpacity 
                    style={[styles.radioButton, value === 'Punto de interés' && styles.radioButtonSelected]}
                    onPress={() => onChange('Punto de interés')}
                  >
                    <Text style={[styles.radioText, value === 'Punto de interés' && styles.radioTextSelected]}>Punto de interés</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.radioButton, value === 'Área de vigilancia' && styles.radioButtonSelected]}
                    onPress={() => onChange('Área de vigilancia')}
                  >
                    <Text style={[styles.radioText, value === 'Área de vigilancia' && styles.radioTextSelected]}>Área de vigilancia</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.radioButton, value === 'Punto de control' && styles.radioButtonSelected]}
                    onPress={() => onChange('Punto de control')}
                  >
                    <Text style={[styles.radioText, value === 'Punto de control' && styles.radioTextSelected]}>Punto de control</Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          </View>

          <View style={styles.locationSection}>
            <Text style={styles.label}>Ubicación GPS *</Text>
            <View style={styles.locationContainer}>
              {location ? (
                <View style={styles.locationData}>
                  <Text style={styles.locationText}>Lat: {location.latitude.toFixed(6)}</Text>
                  <Text style={styles.locationText}>Long: {location.longitude.toFixed(6)}</Text>
                </View>
              ) : (
                <Text style={styles.locationPlaceholder}>No se ha registrado ubicación</Text>
              )}
              <TouchableOpacity style={styles.locationButton} onPress={getCurrentLocation}>
                <MapPin size={20} color="#fff" />
                <Text style={styles.locationButtonText}>Obtener Ubicación</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Observaciones</Text>
            <Controller
              control={control}
              name="observaciones"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Ingrese observaciones adicionales"
                  value={value}
                  onChangeText={onChange}
                  multiline
                  numberOfLines={4}
                />
              )}
            />
          </View>

          <TouchableOpacity 
            style={styles.submitButton} 
            onPress={handleSubmit(onSubmit)}
            disabled={isSubmitting}
          >
            <Text style={styles.submitButtonText}>
              {isSubmitting ? 'Guardando...' : 'Guardar'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    height: 60,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#333',
    marginLeft: 16,
  },
  scrollView: {
    flex: 1,
  },
  formContainer: {
    padding: 16,
  },
  photoSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  photoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  photoPreview: {
    width: 120,
    height: 120,
    borderRadius: 10,
    marginBottom: 12,
  },
  cameraButton: {
    backgroundColor: '#1a3b72',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  cameraButtonText: {
    color: '#fff',
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#fff',
    fontFamily: 'Inter-Regular',
  },
  inputError: {
    borderColor: '#e53e3e',
  },
  errorText: {
    color: '#e53e3e',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginTop: 4,
  },
  textArea: {
    height: 100,
    paddingTop: 12,
    textAlignVertical: 'top',
  },
  radioGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  radioButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 12,
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  radioButtonSelected: {
    backgroundColor: '#1a3b72',
    borderColor: '#1a3b72',
  },
  radioText: {
    fontFamily: 'Inter-Medium',
    color: '#333',
  },
  radioTextSelected: {
    color: '#fff',
  },
  locationSection: {
    marginBottom: 16,
  },
  locationContainer: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 16,
  },
  locationData: {
    marginBottom: 12,
  },
  locationText: {
    fontSize: 15,
    fontFamily: 'Inter-Regular',
    color: '#333',
    marginBottom: 4,
  },
  locationPlaceholder: {
    fontSize: 15,
    fontFamily: 'Inter-Regular',
    color: '#888',
    marginBottom: 12,
    fontStyle: 'italic',
  },
  locationButton: {
    backgroundColor: '#1a3b72',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 6,
  },
  locationButtonText: {
    color: '#fff',
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    marginLeft: 8,
  },
  submitButton: {
    backgroundColor: '#1a3b72',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
});