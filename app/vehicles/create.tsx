import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Camera } from 'lucide-react-native';
import { vehiclesService } from '@/services/vehiclesService';
import { useForm, Controller } from 'react-hook-form';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'react-native';
import { Platform } from 'react-native';

type VehicleFormData = {
  placa: string;
  marca: string;
  modelo: string;
  color: string;
  anno: string;
  tipo: string;
  observaciones: string;
};

export default function CreateVehicleScreen() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);
  
  const { control, handleSubmit, formState: { errors } } = useForm<VehicleFormData>({
    defaultValues: {
      placa: '',
      marca: '',
      modelo: '',
      color: '',
      anno: '',
      tipo: 'Automóvil',
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

  const onSubmit = async (data: VehicleFormData) => {
    setIsSubmitting(true);
    
    try {
      const vehicleData = {
        ...data,
        foto: photo || '',
      };
      
      await vehiclesService.createVehicle(vehicleData);
      Alert.alert(
        'Éxito',
        'Vehículo registrado correctamente',
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
        <Text style={styles.headerTitle}>Registrar Vehículo</Text>
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
            <Text style={styles.label}>Placa *</Text>
            <Controller
              control={control}
              rules={{ required: 'Este campo es requerido' }}
              name="placa"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={[styles.input, errors.placa && styles.inputError]}
                  placeholder="Ingrese el número de placa"
                  value={value}
                  onChangeText={onChange}
                  autoCapitalize="characters"
                />
              )}
            />
            {errors.placa && <Text style={styles.errorText}>{errors.placa.message}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Marca *</Text>
            <Controller
              control={control}
              rules={{ required: 'Este campo es requerido' }}
              name="marca"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={[styles.input, errors.marca && styles.inputError]}
                  placeholder="Ingrese la marca"
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
            {errors.marca && <Text style={styles.errorText}>{errors.marca.message}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Modelo *</Text>
            <Controller
              control={control}
              rules={{ required: 'Este campo es requerido' }}
              name="modelo"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={[styles.input, errors.modelo && styles.inputError]}
                  placeholder="Ingrese el modelo"
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
            {errors.modelo && <Text style={styles.errorText}>{errors.modelo.message}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Color *</Text>
            <Controller
              control={control}
              rules={{ required: 'Este campo es requerido' }}
              name="color"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={[styles.input, errors.color && styles.inputError]}
                  placeholder="Ingrese el color"
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
            {errors.color && <Text style={styles.errorText}>{errors.color.message}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Año *</Text>
            <Controller
              control={control}
              rules={{ required: 'Este campo es requerido' }}
              name="anno"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={[styles.input, errors.anno && styles.inputError]}
                  placeholder="Ingrese el año"
                  value={value}
                  onChangeText={onChange}
                  keyboardType="numeric"
                />
              )}
            />
            {errors.anno && <Text style={styles.errorText}>{errors.anno.message}</Text>}
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
                    style={[styles.radioButton, value === 'Automóvil' && styles.radioButtonSelected]}
                    onPress={() => onChange('Automóvil')}
                  >
                    <Text style={[styles.radioText, value === 'Automóvil' && styles.radioTextSelected]}>Automóvil</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.radioButton, value === 'Motocicleta' && styles.radioButtonSelected]}
                    onPress={() => onChange('Motocicleta')}
                  >
                    <Text style={[styles.radioText, value === 'Motocicleta' && styles.radioTextSelected]}>Motocicleta</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.radioButton, value === 'Camión' && styles.radioButtonSelected]}
                    onPress={() => onChange('Camión')}
                  >
                    <Text style={[styles.radioText, value === 'Camión' && styles.radioTextSelected]}>Camión</Text>
                  </TouchableOpacity>
                </View>
              )}
            />
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