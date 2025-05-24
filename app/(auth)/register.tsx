import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { authService } from '@/services/authService';
import { Shield } from 'lucide-react-native';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async () => {
    if (!name || !email || !username || !password || !confirmPassword) {
      Alert.alert('Error', 'Todos los campos son requeridos');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    setIsLoading(true);

    try {
      await authService.register({
        name,
        email,
        username,
        password
      });
      
      Alert.alert(
        'Registro Exitoso', 
        'Su cuenta ha sido creada. Por favor inicie sesión.',
        [{ text: 'OK', onPress: () => router.replace('/login') }]
      );
    } catch (error) {
      Alert.alert('Error', 'No se pudo completar el registro. Por favor intente de nuevo.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.logoContainer}>
        <Shield size={60} color="#1a3b72" />
        <Text style={styles.title}>Crear Cuenta</Text>
      </View>
      
      <View style={styles.formContainer}>
        <Text style={styles.label}>Nombre Completo</Text>
        <TextInput
          style={styles.input}
          placeholder="Ingrese su nombre completo"
          value={name}
          onChangeText={setName}
        />
        
        <Text style={styles.label}>Correo Electrónico</Text>
        <TextInput
          style={styles.input}
          placeholder="Ingrese su correo electrónico"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        
        <Text style={styles.label}>Usuario</Text>
        <TextInput
          style={styles.input}
          placeholder="Ingrese un nombre de usuario"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
        
        <Text style={styles.label}>Contraseña</Text>
        <TextInput
          style={styles.input}
          placeholder="Ingrese una contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        
        <Text style={styles.label}>Confirmar Contraseña</Text>
        <TextInput
          style={styles.input}
          placeholder="Confirme su contraseña"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
        
        <TouchableOpacity 
          style={styles.registerButton} 
          onPress={handleRegister}
          disabled={isLoading}
        >
          <Text style={styles.registerButtonText}>
            {isLoading ? 'Procesando...' : 'Registrarse'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.loginLink} 
          onPress={() => router.replace('/login')}
        >
          <Text style={styles.loginLinkText}>
            ¿Ya tiene una cuenta? Inicie sesión
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1a3b72',
    marginTop: 16,
  },
  formContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
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
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  registerButton: {
    backgroundColor: '#1a3b72',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  loginLink: {
    marginTop: 20,
    alignItems: 'center',
  },
  loginLinkText: {
    color: '#1a3b72',
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
});