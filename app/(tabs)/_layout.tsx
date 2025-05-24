import { Tabs } from 'expo-router';
import { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { Users, Car, Building2, MapPin } from 'lucide-react-native';

export default function TabLayout() {
  const { isAuthenticated, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      const inAuthGroup = segments[0] === '(auth)';
      
      if (!isAuthenticated && !inAuthGroup) {
        router.replace('/(auth)/login');
      } else if (isAuthenticated && inAuthGroup) {
        router.replace('/(tabs)');
      }
    }
  }, [isAuthenticated, segments, isLoading]);

  if (isLoading) {
    return null;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#1a3b72',
        tabBarInactiveTintColor: '#888',
        tabBarStyle: { 
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontFamily: 'Inter-Medium',
          fontSize: 12,
        },
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color, size }) => (
            <Users size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="vehicles"
        options={{
          title: 'Vehículos',
          tabBarIcon: ({ color, size }) => (
            <Car size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="properties"
        options={{
          title: 'Propiedades',
          tabBarIcon: ({ color, size }) => (
            <Building2 size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="locations"
        options={{
          title: 'Ubicaciones',
          tabBarIcon: ({ color, size }) => (
            <MapPin size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}