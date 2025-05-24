import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { WebView } from 'react-native-webview';
import { locationsService } from '@/services/locationsService';
import { LocationType } from '@/types';

export default function LocationMapScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [location, setLocation] = useState<LocationType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchLocation();
  }, [id]);

  const fetchLocation = async () => {
    if (!id) return;
    
    try {
      const data = await locationsService.getLocationById(parseInt(id));
      setLocation(data);
    } catch (error) {
      console.error('Error fetching location:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Generate HTML with map
  const generateMapHTML = () => {
    if (!location) return '';
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <style>
          body, html, #map { height: 100%; margin: 0; padding: 0; }
        </style>
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />
      </head>
      <body>
        <div id="map"></div>
        <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
        <script>
          const map = L.map('map').setView([${location.latitud}, ${location.longitud}], 15);
          
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
          }).addTo(map);
          
          const marker = L.marker([${location.latitud}, ${location.longitud}]).addTo(map);
          marker.bindPopup("${location.nombre}").openPopup();
        </script>
      </body>
      </html>
    `;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#1a3b72" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {location ? location.nombre : 'Mapa de Ubicación'}
        </Text>
      </View>
      
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1a3b72" />
        </View>
      ) : location ? (
        <View style={styles.mapContainer}>
          <WebView
            source={{ html: generateMapHTML() }}
            style={styles.map}
            originWhitelist={['*']}
            javaScriptEnabled={true}
            domStorageEnabled={true}
          />
          <View style={styles.infoContainer}>
            <Text style={styles.infoTitle}>{location.nombre}</Text>
            <Text style={styles.infoDescription}>{location.descripcion}</Text>
            <View style={styles.coordinatesContainer}>
              <View style={styles.coordinateItem}>
                <Text style={styles.coordinateLabel}>Latitud:</Text>
                <Text style={styles.coordinateValue}>{location.latitud}</Text>
              </View>
              <View style={styles.coordinateItem}>
                <Text style={styles.coordinateLabel}>Longitud:</Text>
                <Text style={styles.coordinateValue}>{location.longitud}</Text>
              </View>
            </View>
          </View>
        </View>
      ) : (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No se pudo cargar la ubicación</Text>
        </View>
      )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  infoContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  infoTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#333',
    marginBottom: 8,
  },
  infoDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginBottom: 12,
  },
  coordinatesContainer: {
    flexDirection: 'row',
    marginTop: 4,
  },
  coordinateItem: {
    flexDirection: 'row',
    marginRight: 16,
  },
  coordinateLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#666',
  },
  coordinateValue: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginLeft: 4,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#e53e3e',
    textAlign: 'center',
  },
});