import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Camera } from 'lucide-react-native';
import { peopleService } from '@/services/peopleService';
import { useForm, Controller } from 'react-hook-form';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'react-native';
import { Platform } from 'react-native';

type PersonFormData = {
  cedula: string;
  nombre: string;
  apellidos: string;
  nacionalidad: string;
  alias: string;
  genero: string;
  fechaNacimiento: string;
  observaciones: string;
};

export default function CreatePersonScreen() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);
  
  const { control, handleSubmit, formState: { errors } } = useForm<PersonFormData>({
    defaultValues: {
      cedula: '',
      nombre: '',
      apellidos: '',
      nacionalidad: 'Costarricense',
      alias: '',
      genero: 'Masculino',
      fechaNacimiento: '',
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

  const onSubmit = async (data: PersonFormData) => {
    setIsSubmitting(true);
    
    try {
      const personData = {
        ...data,
        foto: photo || '',
      };
      
      await peopleService.createPerson(personData);
      Alert.alert(
        'Éxito',
        'Persona registrada correctamente',
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
        <Text style={styles.headerTitle}>Registrar Persona</Text>
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
            <Text style={styles.label}>Cédula *</Text>
            <Controller
              control={control}
              rules={{ required: 'Este campo es requerido' }}
              name="cedula"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={[styles.input, errors.cedula && styles.inputError]}
                  placeholder="Ingrese el número de cédula"
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
            {errors.cedula && <Text style={styles.errorText}>{errors.cedula.message}</Text>}
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
                  placeholder="Ingrese el nombre"
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
            {errors.nombre && <Text style={styles.errorText}>{errors.nombre.message}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Apellidos *</Text>
            <Controller
              control={control}
              rules={{ required: 'Este campo es requerido' }}
              name="apellidos"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={[styles.input, errors.apellidos && styles.inputError]}
                  placeholder="Ingrese los apellidos"
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
            {errors.apellidos && <Text style={styles.errorText}>{errors.apellidos.message}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nacionalidad *</Text>
            <Controller
              control={control}
              rules={{ required: 'Este campo es requerido' }}
              name="nacionalidad"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={[styles.input, errors.nacionalidad && styles.inputError]}
                  placeholder="Ingrese la nacionalidad"
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
            {errors.nacionalidad && <Text style={styles.errorText}>{errors.nacionalidad.message}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Alias</Text>
            <Controller
              control={control}
              name="alias"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={styles.input}
                  placeholder="Ingrese el alias (opcional)"
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Género *</Text>
            <Controller
              control={control}
              rules={{ required: 'Este campo es requerido' }}
              name="genero"
              render={({ field: { onChange, value } }) => (
                <View style={styles.radioGroup}>
                  <TouchableOpacity 
                    style={[styles.radioButton, value === 'Masculino' && styles.radioButtonSelected]}
                    onPress={() => onChange('Masculino')}
                  >
                    <Text style={[styles.radioText, value === 'Masculino' && styles.radioTextSelected]}>Masculino</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.radioButton, value === 'Femenino' && styles.radioButtonSelected]}
                    onPress={() => onChange('Femenino')}
                  >
                    <Text style={[styles.radioText, value === 'Femenino' && styles.radioTextSelected]}>Femenino</Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Fecha de Nacimiento</Text>
            <Controller
              control={control}
              name="fechaNacimiento"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={styles.input}
                  placeholder="YYYY-MM-DD"
                  value={value}
                  onChangeText={onChange}
                />
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
    borderRadius: 60,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  photoPreview: {
    width: 120,
    height: 120,
    borderRadius: 60,
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
    marginBottom: 16,
  },
  radioButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 12,
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